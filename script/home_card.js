/* ------- animation --------- */
const title_hover_t1 = new TimelineMax();
const title_hover_motion = 0.5;
const text_hover_motion = 0.5;

function animate(){
    title_hover_t1.to($(".back_info.active").children("div"), title_hover_motion, {opacity : 1, y: -20})
    .to($(".back_info.active").children("p"), text_hover_motion, {opacity : 1, y : -20}, "+=0.1");
}

function cardShake(){
    TweenMax.fromTo($(".mySwiper"), 0.1, {
        x : -2,
    }, {
        x : 2,
        repeat : 5,
        yoyo : true,
        ease:Quad.easeInOut
    });
}


function initializeAnim(index){

    title_hover_t1.set($(".back_info.active").children("div"), {clearProps : "opacity, y"});
    title_hover_t1.set($(".back_info.active").children("p"), {clearProps : "opacity, y"});

}

function changeBackground(index){

    console.log(index);
    
    $(".back_info").not($("back_info").eq(index)).removeClass("active");
    $(".back_info").eq(index).addClass("active");

    $(".back_info").not($("back_info").eq(index)).fadeOut(400, function(){
        initializeAnim(index);
    });
    $(".back_info").eq(index).fadeIn(400, function(){
        animate();
    });

}

window.addEventListener('wheel', e => {

    // wheel down
    if(e.deltaY < 0 ){
        swiper.slideNext();
    // wheel up
    }else if (e.deltaY > 0 ){
        swiper.slidePrev();
    }

});

$(document).ready(function() {

    // initialize
    animate();
    cardShake();

});