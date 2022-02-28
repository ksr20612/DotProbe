/* ------------ timeLineMax (animations) ------------- */
const detach_message = new TimelineMax();
const detach_motion_speed = 0.2;

const fill_message = new TimelineMax();
const fill_motion_speed = 0.2;

function detachMsg(){
    const $msg = $(".loading").last().parent().parent().parent();
    detach_message.to($msg, detach_motion_speed, {y : 10, autoAlpha : 0})
    .call(remove, [$msg]);
}

var remove = function removeLastMsg(target){
    target.remove();
}

/* ------------- static variables --------------- */
var msgIdxBot = 0;
var msgIdxUser = 0;
var botName = "챗봇";
var userName;
var nowLoading = false;

/* ------------- append messages --------------- */
// append messages with loading dots
function appendMsg(sender, sentence){

    let html='';
    if(sentence){
        nowLoading = false;
        const $msg = $(".loading").last().parent();
        $msg.html(sentence);
        $msg.css("min-width","initial");
        return true;
    }

    // sender : { "bot" : 1, "me" : 0 }
    if(sender){

        msgIdxBot += 1;
        html += '<div class="message_bot" id="message_bot_'+msgIdxBot+'">';
        html +=     '<div class="bot_img"></div>';
        html +=     '<div class="bot">';
        html +=         '<div class="bot_name">'+botName+'</div>';
        html +=         '<div class="bot_msg"><div class="loading"></div></div>';
        html +=         '</div>'
        html +=     '</div>';
        html += '</div>';

    }else {

        msgIdxUser += 1;
        html += '<div class="message_user" id="message_user_'+msgIdxUser+'">';
        html +=     '<div class="user">';
        if(userName){
            html +=         '<div class="user_name">'+userName+'</div>';
        }else {
            html +=         '<div class="user_name">???</div>';            
        }
        html +=         '<div class="user_msg"><div class="loading"></div></div>';
        html +=     '</div>';
        html +=     '<div class="user_img"></div>';
        html += '</div>';

    }

    $(".screen_box").append(html);
    $(".loading").last().parent().css("min-width","6rem");

    // # scroll down to the bottom
    $('.screen_box').scrollTop($('.screen_box')[0].scrollHeight);

}

function sendMsg(){

    var msg = $("textarea").val();
    
    if(msg.length != 0){

        // # 1 append message
        appendMsg(0,msg);

        // # 2 get token & paramData
        var paramData = {
            "idx" : msgIdxUser,
            "msg" : msg
        };
        var token = localStorage.getItem("token");

        //# 3 for test : chatbot responds after 1000s
        setTimeout(function(){
            appendMsg(1,"");
        },1000);

        // # 3 send data to the server
        // $.ajax({
        //     type : "POST",
        //     url : "/api/reply",
        //     contentType : "application/json;charset=utf-8",
        //     dataType : "json",
        //     cache : false,
        //     data :  JSON.stringify(paramData),
        //     beforeSend: function (xhr) {
        //         appendMsg(1,"");
        //         xhr.setRequestHeader("Authorization","JWT " + token);
        //     },
        //     success : function(result){
    
        //         $(".bot .bot_msg").last().html(result.reply);

        //     },
        //     error : function(result){
        //         alert("전송에 실패하였습니다.");
        //         $(".message_user").last().remove();
        //         $(".message_bot").last().remove();
        //     },
        //     complete : function(result) {

        //         $("textarea").val("");

        //     }
        // });  

        $("textarea").val("");

    }
}

function delay(sec){
    return new Promise(resolve => {
        setTimeout(()=>{},sec);
    });
}

$(document).ready(function () {

    $("textarea").on('keyup keypress',function(e){
        var keyCode = e.keyCode || e.which;
        if(keyCode == 13){
            e.preventDefault();
            
            // submit
            sendMsg();

            return false;

        }
    })

    // if typing message, loading dot emerges
    $("textarea").on('propertychange change keyup paste input', (e) => {

        var currentVal = $("textarea").val();
        if(!nowLoading && currentVal.length != 0){
            nowLoading = true;
            console.log("off -> on : " + nowLoading);
            appendMsg(0,"");
        }else if(nowLoading && currentVal.length == 0){
            detachMsg();
            nowLoading = false;
            console.log("on -> off : " + nowLoading);
        }

    });


});
