function now() {
    var today = new Date();
    var yyyy = today.getFullYear();
    var MM = today.getMonth() + 1;
    var dd = today.getDate();
    var hh = today.getHours();
    var mm = today.getMinutes();
    var ss = today.getSeconds();
    return String(10000000000 * yyyy + 100000000 * MM + 1000000 * dd + 10000 * hh + 100 * mm + ss);
}

function login(){

    var id = $("#id").val();
    var pw = $("#passwd").val();

    if(id.length * pw.length == 0) {
        alert("아이디와 비밀번호를 입력해주세요.");
        return;
    }

    var paramData = {
        "date" : now(),
        "id" : id,
        "pw" : pw,
    }

    // $.ajax({
    //     type : "POST",
    //     url : "/api/makeAccess",
    //     contentType : "application/json;charset=utf-8",
    //     dataType : "json",
    //     cache : false,
    //     data :  JSON.stringify(paramData),
    //     success : function(result){
    //         if(localStorage.getItem('jwt').length != 0){
    //              localStorage.removeItem('jwt');
    //         }
    //         localStorage.setItem('jwt', result.token)
    //         window.location.href = "/home";
    //     },
    //     error : function(result){
    //         alert("로그인에 실패하였습니다.");
    //         $("input").val('');
    //     }
    // });      

}

$(document).ready(function () {

    $("input").on('keyup keypress',function(e){
        var keyCode = e.keyCode || e.which;
        if(keyCode == 13){
            e.preventDefault();
            
            // submit
            login();

            return false;
        }

    })

});