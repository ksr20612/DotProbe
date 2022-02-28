/******* globals *******/
let camera, scene, renderer;
const originalBoxSize = 3;
let stack = [];
let overhangs = [];
const boxHeight = 1;
let gameStarted = false;
const cameraPosition = {
    x : 4,
    y : 4,
    z : 4,
}
let world;

const init = () => {

    /***** cannon.js *****/
    world = new CANNON.World();
    world.gravity.set(0,-10,0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 40;

    // Scene (= canvas) : props=>background(default=black)
    scene = new THREE.Scene();

    // Foundation : centered box
    addLayer(0,0,originalBoxSize, originalBoxSize);

    // First layer : moveing box
    addLayer(-10,0,originalBoxSize, originalBoxSize, "x");

    // set up ligths ( need to be set if meshLambert is used )
    // ambient => every direction, base color
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 20, 0); // 큐브보다 20 높고 x축으로 10치우침(치우쳤기 때문에 우측평면이 좌측평면보다 밝음)
    scene.add(directionalLight);

    // set up cameras : perspective vs. orthographic(less realistic, but simple, )
    const width = 10;
    const height = width * (window.innerHeight / window.innerWidth);
    camera = new THREE.OrthographicCamera(
        width / -2.5,  // left
        width / 2.5,   // right
        height / 2.5,  // top
        height / -2.5, // bottom
        1,           // near
        100          // far
    );
    camera.position.set(cameraPosition.x,cameraPosition.y,cameraPosition.z);
    camera.lookAt(0,0,0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ anitialias : true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    $(".content").append(renderer.domElement);

}

// calls at each round, push layers(boxes) into the stack(list)
const addLayer = (x,z,width,depth,direction) => {
    const y = boxHeight * stack.length;
    const layer = generateBox(x,y,z,width,depth);
    layer.direction = direction; //"x"
    stack.push(layer);
}

const generateBox = (x,y,z,width,depth) => {
    // add a cube to the scene
    /*
        mesh = geometry + material
    */
    const geometry = new THREE.BoxGeometry(width,boxHeight,depth); 
    const color = new THREE.Color(`hsl(${30+stack.length*4},100%, 50%)`); // hue, saturation, lightness : hue => 30degree + round*4degree
    const material = new THREE.MeshLambertMaterial({color});

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x,y,z);
    scene.add(mesh);

    /***** cannon js *****/
    const shape = new CANNON.Box(
        new CANNON.Vec3(width / 2, boxHeight / 2, depth / 2)
    );
    let mass = falls? 5 : 0; // gravity applied if >0
    const body = new CANNON.Body({mass, shape});
    body.position.set(x,y,z);
    world.addBody(body);

    return ({
        threejs : mesh,
        cannonjs : body,
        width,
        depth
    })
}

const animation = () => {

    const speed = 0.15;
    const topLayer = stack[stack.length-1];
    topLayer.threejs.position[topLayer.direction] += speed; // +0.15 to the direction of x ( set by reference )
    topLayer.cannonjs.position[topLayer.direction] += speed;

    if(camera.position.y < boxHeight * (stack.length -2) + cameraPosition.y) {
        camera.position.y += speed;
    }

    renderer.render(scene, camera);
}

const calculateOverlapped = () => {

    const topLayer = stack[stack.length -1];
    const prevLayer = stack[stack.length -2];
    const direction = topLayer.direction;
    const size = direction === "x"? topLayer.width : topLayer.depth; 

    console.log(topLayer);
    console.log(prevLayer);

    const delta = topLayer.threejs.position[direction]-prevLayer.threejs.position[direction]
    const overhangSize = Math.abs(delta);

    return {
        overlap : size-overhangSize,
        delta : delta,
        overhangSize : overhangSize,
    }
}

const addOverhang = (x,z,width,depth) => {
    const y = boxHeight * (stack.length-1);
    const overhang = generateBox(x,y,z, width,depth);
    overhangs.push(overhang);
}

function cutBox(topLayer, overlap, size, delta) {

    const direction = topLayer.direction;
    const newWidth = direction == "x" ? overlap : topLayer.width;
    const newDepth = direction == "z" ? overlap : topLayer.depth;
  
    // Update metadata
    topLayer.width = newWidth;
    topLayer.depth = newDepth;
  
    // Update ThreeJS model
    topLayer.threejs.scale[direction] = overlap / size;
    topLayer.threejs.position[direction] -= delta / 2;
  
    // Update CannonJS model
    topLayer.cannonjs.position[direction] -= delta / 2;
  
    // Replace shape to a smaller one (in CannonJS you can't simply just scale a shape)
    const shape = new CANNON.Box(
      new CANNON.Vec3(newWidth / 2, boxHeight / 2, newDepth / 2)
    );
    topLayer.cannonjs.shapes = [];
    topLayer.cannonjs.addShape(shape);
}

$(document).ready(function () {

    init();

    window.addEventListener("click", () => {
        if(!gameStarted){
            // start game
            renderer.setAnimationLoop(animation); // passing on callback
            gameStarted = true;
        }else {
            // stop the moving box & add another layer & "calculate the overhangging and overlapping parts"
            /*
                addLayer이 호출되면 generateBox 를 통해 stack 에 layer(=box)가 push됨. (즉, 이미 이 시점에 stack에 쌓임)
                animation에 의해 top layer의 direction(x or z) 의 값이 계속 변경됨.
                언제까지? 클릭 시까지. 화면이 클릭되면 여기 else로 타고 들어옴.
                따라서 움직이는 박스를 "멈추는" 절차는 딱히 필요하지 않음. 그냥 클릭된 시점의 값을 가져오면 더이상 frame 렌더링 안됨(addLayer 순간에 topLayer가 바뀌기 때문에)
            */
            const _overlap = calculateOverlapped();
            const overlap = _overlap.overlap;
            const delta = _overlap.delta;
            const overhangSize = _overlap.overhangSize;
            if(overlap>0) {

                cutBox(topLayer, overlap, )

                const topLayer = stack[stack.length-1];
                const direction = topLayer.direction;
                const newWidth = direction === "x"? overlap : topLayer.width;
                const newDepth = direction === "z"? overlap : topLayer.depth;
                const size = direction === "x"? topLayer.width : topLayer.depth;

                // determine the new size
                topLayer.width = newWidth;
                topLayer.depth = newDepth;

                // update the actual mesh
                topLayer.threejs.scale[direction] = overlap / size;
                topLayer.threejs.position[direction] -= delta / 2; 

                // Overhang
                const overhangShift = (overlap / 2 + overhangSize / 2) * Math.sign(delta);
                const overhangX =
                direction == "x"
                    ? topLayer.threejs.position.x + overhangShift
                    : topLayer.threejs.position.x;
                const overhangZ =
                direction == "z"
                    ? topLayer.threejs.position.z + overhangShift
                    : topLayer.threejs.position.z;
                const overhangWidth = direction == "x" ? overhangSize : topLayer.width;
                const overhangDepth = direction == "z" ? overhangSize : topLayer.depth;

                addOverhang(overhangX, overhangZ, overhangWidth, overhangDepth);

                // determine the rest
                const nextX = topLayer.direction === "x"? topLayer.threejs.position.x : -10;
                const nextZ = topLayer.direction === "z"? topLayer.threejs.position.z : -10;
                const newDirection = topLayer.direction === "x"? "z" : "x";

                addLayer(nextX, nextZ, newWidth, newDepth, newDirection);

            }
        }
    });

});
