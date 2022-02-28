function getRandomInt(min, max) {

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;

}

$(document).ready(function () {

    /*
        게임 규칙
        1. 화난 사람과 웃는 사람이 랜덤으로 두 곳에서 500ms 동안 등장했다 사라진다.
        2. 두 사람이 사라지고 흔적을 남긴다.
        3. 화난 사람 근처에만 물웅덩이가 생긴다.
        4. 물웅덩이를 최대한 빨리 클릭해 치워야 한다.
    */

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var dx1 = 0;
    var dy1 = 0;
        
    function drawFaces(angryIdx) {

        var img1 = new Image();
        img1.className = "faces";
        img1.src = "./images/angry"+angryIdx+".png"; 
        var img2 = new Image();
        img2.className = "faces";
        img2.src = "./images/neutral.png";
        img1.onload = function () {
            dx1 = (Math.random() * canvas.width-35);
            dy1 = (Math.random() * canvas.height-35);
            if(dx1 < 0) { dx1 = 0 }
            if(dy1 < 0) { dy1 = 0 }
            
            var dx2 = (Math.random() * canvas.width-35);
            var dy2 = (Math.random() * canvas.height-35);
            if(dx2 < 0) { dx2 = canvas.width-35 }
            if(dy2 < 0) { dy2 = canvas.height-35 }
            
            ctx.drawImage(img1,dx1,dy1,35,35);
            ctx.drawImage(img2,dx2,dy2,35,35);
        }

    };
        
    function drawPuddles(){

        var img = new Image();
        img.className = "puddles";
        img.src = "./images/puddle.png";

        $(".puddles").bind( "click", function() {
            $(this).fadeOut(500);
        });

        var numPuddles = getRandomInt(1,4);
        var puddleX = new Array(numPuddles);
        var puddleY = new Array(numPuddles);

        // random number of puddles ( 1 ~ 3 )
        for(var i=1;i<=numPuddles;i++){

            puddleX.push(getRandomInt(-5,5));
            puddleY.push(getRandomInt(-5,5));

        }

        for(var i=0;i<=numPuddles-1;i++){
            
            ctx.drawImage(img, puddleX[i]+dx1, puddleY[i]+dy1, 10, 10);
        
        }

    };

    function round() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var angryIdx = getRandomInt(1,4);
        ctx.beginPath();
        drawFaces(angryIdx+"");
        setTimeout(ctx.clearRect(0, 0, canvas.width, canvas.height),500)
        drawPuddles();
        ctx.closePath();
    
    }
        
    setInterval(round, 3000);


});