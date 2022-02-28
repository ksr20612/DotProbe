function startDrag(e){
    console.log("start Dragging");
}

function drag(e){
    console.log("Dragging");
}

function endDrag(e){
    console.log("stop Dragging");
}

function embrace(e){
    console.log("embracing");
}

function onElement(e){
    console.log("on element");
}

function onElement(e){
    console.log("off element");
}

$(document).ready(function () {

    var $div = $(".screen").children();
    $(".score").draggable({
        cursor : "crosshair"
    });

});