/*
    게임 규칙
    1. 화난 사람과 웃는 사람이 랜덤으로 두 곳에서 500ms 동안 등장했다 사라진다.
    2. 두 사람이 사라지고 흔적을 남긴다.
    3. 화난 사람 근처에만 물웅덩이가 생긴다.
    4. 물웅덩이를 최대한 빨리 클릭해 치워야 한다.
*/

/* ----- animation ----- */
const score_hover_tl = new TimelineMax();
const score_hover_motion = 0.4;

const start_tl = new TimelineMax();

function initGame(){
    start_tl.to("#exp",1,{opacity : 1})
    .to(".start",0.5,{opacity : 1});
}

/* ----- functions ----- */
var $canvas = $(".myCanvas");
var isPushed = false;
var totalRound = 20;
var numRound = 0;
let numTargetShown = 0;
let numTargetClicked = 0;
var score = 0;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function start(){

    $(".start").html("<div>"+3+"</div>");
    if(!isPushed){
        isPushed = true;
        var countdown = 3;
        var timer = setInterval(function(){
            countdown--;
            $(".start").html("<div>"+countdown+"</div>");
            if(countdown == 0){
                $(".intro").hide();
                clearInterval(timer);
                initialize();
                playRound();
            }
        }, 1000);

    }

}

function initialize(){

    numRound = 0;
    numTargetShown = 0;
    numTargetClicked = 0;
    score = 0;

    $(".round").html(numRound);
    $(".score_box").html(score);

}

async function drawFaces(angryIdx){

    // # 1 
    var angry = new Image();
    angry.className = "faces angry";
    angry.src = "./images/angry"+angryIdx+".png"; 
    var neutral = new Image();
    neutral.className = "faces neutral";
    neutral.src = "./images/neutral.png";

    // # 2
    dx1 = (Math.random() * ($(".myCanvas").width()-50) * 1);
    dy1 = (Math.random() * ($(".myCanvas").height()-50) * 1);
    angry.style.top = dy1 + 'px';
    angry.style.left = dx1 + 'px';

    dx2 = (Math.random() * ($(".myCanvas").width()-50) * 1);
    dy2 = (Math.random() * ($(".myCanvas").height()-50) * 1);
    neutral.style.top = dy2 + 'px';
    neutral.style.left = dx2 + 'px';

    $(".myCanvas").append(angry);
    $(".myCanvas").append(neutral);

    await delay(500);

    $("img").remove();

    return [dx2,dy2];
}

async function drawPuddles(position){

    for(var i=1;i<=getRandomInt(1,5);i++){

        numTargetShown++;
        // # 1
        var puddle = new Image();
        puddle.className = "puddles";
        puddle.src = "./images/puddle.png";
        puddle.style.cursor = "pointer";

        // # 2
        const distanceX = getRandomInt(-50,50);
        const distanceY = getRandomInt(-50,50);
        let newY = position[1]*1 + distanceX;
        let newX = position[0]*1 + distanceY;
        if(newY < 30){ newY = 30 };
        if(newY > $(".myCanvas").height()-30){ newY = $(".myCanvas").height()-30 };
        if(newX < 30){ newX = 30 };
        if(newX > $(".myCanvas").width()-30){ newX = $(".myCanvas").width()-30 };

        puddle.style.top = newY + 'px';
        puddle.style.left = newX + 'px';
        puddle.onclick = function(e){
            this.remove();
            score = score + 10;
            numTargetClicked++;
            hoverScore(newX, newY);
            $(".score_box").html(score);
            //TweenMax.to(scoreholder, 1, {score:"+=10", roundProps:"score", onUpdate:updateScore, ease:Cubic.easeIn });
        };

        // # 3
        $(".myCanvas").append(puddle);

    }

    await delay(2000);
    $("img").remove();

}

function hoverScore(dx, dy){

    var score = $('<div class="hover_score" style="top:'+dy+'px; left:'+dx+'px">+10</div>');
    $(".myCanvas").append(score);
    score_hover_tl.to(score, score_hover_motion, {y: -10, opacity:0, display:"none"});
    //score_hover_tl.to(score, score_hover_motion, {y: -20, opacity:0, onComplete:detach, onCompleteParams:[score]});

}

function detach(target){
    target.remove();
}

function updateScore(){
    $(".score_box").html(scoreholder.score);
}

async function playRound(){

    // # 1
    $("img").remove();

    // # 1 
    numRound++;
    $(".round").html(numRound);

    // # 2
    var angryIdx = getRandomInt(1,4);
    position = await drawFaces(angryIdx);

    // # 3
    await drawPuddles(position);

    // # 4
    if(numRound != totalRound){
        playRound();
    }else {
        showResult();
    }

}

function showResult(){

    $(".result").remove();
    isPushed = false; // re-enable btn
    var resultScore = $("<div class='result'>최종 점수 : "+score+"점</div>");
    var resultAccuracy = $("<div class='result'>정확도 : "+Math.round(numTargetClicked/numTargetShown*100)+"%</div>");
    $(".intro_text").html("===== 결과 ===== &nbsp;");
    $("#exp").after(resultAccuracy);
    $("#exp").after(resultScore);
    $(".start").html("<div>REPLAY</div>");
    $(".intro").css("display","block");

}

$(document).ready(function () {

    initGame();

});