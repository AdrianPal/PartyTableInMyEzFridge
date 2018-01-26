/**
 * @author: Thomas GILLOT
 */
import showBoardView from "../board";
import { fail } from "assert";


var context;

var socket = io.connect(URL_SERVER);


const width = window.innerWidth;
const height = window.innerHeight;  


var pointsEast = new Array();
var pointsNorth = new Array();
var pointsDrag = new Array();


var isPainting = false;

var isPaletteOpened = false;
var drawSize = 5;
var color = '#000000';
var startEventType = 'mousedown',
    moveEventType = 'mousemove',
    endEventType   = 'mouseup';

if (Modernizr.touch === true) {
    startEventType = 'touchstart';
    moveEventType = 'touchmove';
    endEventType   = 'touchend';
}

var isTable = false;
var connected = false;



export default function launchPictionary(players)
{
    socket.emit('connectionPic');

    while(connected == false){
        connected = isConnected();
        console.log(connected);
    }

    initView();
    initCanvasEvent();
    initBindingPalette();

    if(isTable){
        initWord();
    }
    

    
}



socket.on('isDrawing', (east, north, drag, distantColor, size) => {
    refreshCanvasOnSocket(east,north,drag, distantColor, size);
});

socket.on('connectedPic', (isTableResponse) => {
    isTable = isTableResponse;
    connected = true;
    alert((isTable)? 'This screen is the table' : 'This screen is not the table');
});

socket.on('wordInitialized', (word) => {
    initWord(word);
})

socket.on('clearCanvas', () => {
    clear();
});


function isConnected(){
    return connected;
}

function initView() {

    const html = '<div class="header">' +
    '<h4 class="pictionaryTitle"> Pictionary</h4>' + 
    '<div id="game"></div>' + 
    '</div>' +
    '<div class="palette">' +
    '<a id="openPalette">'+ 
    'Palette <span id="chev" class="fas fa-caret-right"></span>' +
    '</a>' +
    '<div id="palette-tool">' + 
    '<input type="radio" id="thinSize" name="size" value="1" checked>' + 
    '<label for="thinSize"><span class="fas fa-pencil-alt"></span></label>' +

    '<input type="radio" id="fatSize" name="size" value="20">' +
    '<label for="fatSize"><span class="fas fa-paint-brush"></span></label>'+

    '<input type="text" id="colorpicker"/>' +

    '<div id="clear"><span class="fas fa-trash-alt"></span></div>' +

    '</div>' + 

    '</div>';
    $('#boardView').remove();
    $('#app').append(html);

    $('#app').append('<canvas id="pictionaryCanvas" resize></canvas>');

    $('#app').css('position', 'fixed');

    context = document.getElementById('pictionaryCanvas').getContext("2d");

    var canvas = document.getElementById('pictionaryCanvas');
    canvas.height = document.body.clientHeight * 0.90;
    canvas.width = document.body.clientWidth;
}


function initBindingPalette() {
    $('input[name="size"]').change(function() {
        drawSize = $(this).val();
    });

    $("#colorpicker").spectrum({
        color: color,
        showPaletteOnly: true,
        togglePaletteOnly: true,
        togglePaletteMoreText: 'more',
        togglePaletteLessText: 'less',
        palette: [
            ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
            ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
            ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
            ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
            ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
            ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
            ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
            ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
        ]   
    });

    $("#colorpicker").change(function() {
        color = $(this).val();
        console.log(color);
    })

    $('#openPalette').bind('click', function() {
        isPaletteOpened = !isPaletteOpened;
        if(isPaletteOpened) {
            $('#palette-tool').css('display','inline-block');
            $('#chev').removeClass('fa-caret-right').addClass('fa-caret-left')
        }else {
            $('#palette-tool').css('display','none');
            $('#chev').removeClass('fa-caret-left').addClass('fa-caret-right')
        }
    });

    $('#clear').bind('click', function() {
        clear();
        socket.emit('clearCanvas');
    });

}


function initCanvasEvent() {
    $("#pictionaryCanvas").bind(startEventType,function(e){
        isPainting = true;
        addPoint((e.pageX - this.offsetLeft) / width, (e.pageY - this.offsetTop) /height);
        refreshCanvas();
        socket.emit('isDrawing', pointsEast,pointsNorth,pointsDrag, color, drawSize);
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


function initWord(word) {

    if(word){
        const possibleWord = ['CAT', 'DOG', 'PLATE', 'SPOON', 'KNIFE', 'FORK', 'COW', 'CUCUMBER', 'STAIRS', 'PLANET', 'EMPIRE STATE BUILDING', 'BRIDGE', 'GREEN'];
        const randomWord  = Math.floor(Math.random() * (possibleWord.length) + 0);

        $('#game').html('<h3 id="wordToFind">' + possibleWord[randomWord] + '</h3> <h3 id="countdown"></h3>');

        var oldDate = new Date();
        var newDate = new Date(oldDate.getTime() + 60000);

        $('#countdown').countdown(newDate, function(event) {
            $(this).html(event.strftime('%M:%S'));
        }).on('finish.countdown', function(event) {
            $(this).html('Expired !');
        }); ;

        socket.emit('wordInitialized', possibleWord[randomWord]);
    } else {
        $('#game').html('<h3 id="wordToFind">' + word + '</h3> <h3 id="countdown"></h3>');
    }

    
}


function addPoint(east, north, drag) {
    pointsEast.push(east);
    pointsNorth.push(north);
    pointsDrag.push(drag);
}

function refreshCanvasOnSocket(east, north, drag, distantColor, size) {
    context.strokeStyle = distantColor;
    context.lineJoin = 'round';
    context.lineWidth = size;

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
    context.strokeStyle = color;
    context.lineJoin = "round";
    context.lineWidth = drawSize;

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

function changeSize(radio) {
    console.log(radio.value());
    drawSize = radio.value;
}

function clear(){
    var canvas = document.getElementById('pictionaryCanvas');
    context.clearRect(0, 0, canvas.width, canvas.height);
}