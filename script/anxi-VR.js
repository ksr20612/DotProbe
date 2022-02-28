(function setCam(){

    if (navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({video : true})
            .then(function(stream){
                var video = document.getElementById("videoElement");
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err){
                $("video").remove();
                $(".screen").html("<div>웹캠 사용이 불가능합니다.</div>");
            });
    }

})()