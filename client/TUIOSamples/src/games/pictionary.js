/**
 * @author: Thomas GILLOT
 */
import showBoardView from "../board";

var context;

var socket = io.connect('http://0.0.0.0:4000');
socket.emit('connectionPic');


const width = window.innerWidth;
const height = window.innerHeight;  


var pointsEast = new Array();
var pointsNorth = new Array();
var pointsDrag = new Array();


var isPainting = false;

var startEventType = 'mousedown',
    moveEventType = 'mousemove',
    endEventType   = 'mouseup';

if (Modernizr.touch === true) {
    startEventType = 'touchstart';
    moveEventType = 'touchmove';
    endEventType   = 'touchend';
}



export default function launchPictionary(players)
{
   $('#boardView').remove();
   $('#app').append('<h1 class="pictionaryTitle"> Welcome to the pictionary game</h1>')
   $('#app').append('<canvas id="pictionaryCanvas" resize></canvas>');

   $('#app').css('position', 'fixed');

   context = document.getElementById('pictionaryCanvas').getContext("2d");

    var canvas = document.getElementById('pictionaryCanvas');
    canvas.height = document.body.clientHeight * 0.95;
    canvas.width = document.body.clientWidth;

    $("#pictionaryCanvas").bind(startEventType,function(e){
        isPainting = true;
        addPoint((e.pageX - this.offsetLeft) / width, (e.pageY - this.offsetTop) /height);
        refreshCanvas();
        socket.emit('isDrawing', pointsEast,pointsNorth,pointsDrag);
    });

    $("#pictionaryCanvas").bind(moveEventType,function(e){
        if(isPainting) {
            addPoint((e.pageX - this.offsetLeft) / width, (e.pageY - this.offsetTop) / height, true);
            refreshCanvas();    
            socket.emit('isDrawing', pointsEast,pointsNorth,pointsDrag);
        }
    });

    $("#pictionaryCanvas").bind(endEventType,function(e){
        isPainting = false;
        pointsEast = new Array();
        pointsNorth = new Array();
        pointsDrag = new Array();
    });
}



socket.on('isDrawing', (east, north, drag) => {
    refreshCanvasOnSocket(east,north,drag);
});




function addPoint(east, north, drag) {
    pointsEast.push(east);
    pointsNorth.push(north);
    pointsDrag.push(drag);
}

function refreshCanvasOnSocket(east, north, drag) {
    context.strokeStyle = "black";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for(var i = 0; i < east.length; i++) {
        context.beginPath();
        if(drag[i] && i){
            context.moveTo(east[i-1] * width, north[i-1] * height);
        }else{
            context.moveTo((east[i] * width) - 1, north[i] * height);
        }
        context.lineTo(east[i] * width, north[i] * height);
        context.closePath();
        context.stroke();   
    }
}

function refreshCanvas() {
    context.strokeStyle = "black";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for(var i = 0; i < pointsEast.length; i++) {
        context.beginPath();
        if(pointsDrag[i] && i){
            context.moveTo(pointsEast[i-1] * width, pointsNorth[i-1] * height);
        }else{
            context.moveTo((pointsEast[i] * width) - 1, pointsNorth[i] * height);
        }
        context.lineTo(pointsEast[i] * width, pointsNorth[i] * height);
        context.closePath();
        context.stroke();   
    }
}