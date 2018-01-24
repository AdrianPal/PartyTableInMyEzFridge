//contient le code js qu'il y avait dans index.html

const apiUrl = "http://10.212.97.185:4000";

let usersCount = 0,
    gameId = null;

var socket = io.connect('http://10.212.97.185:4000');

socket.on('refresh game', function (d) {
    d.game.forEach(function(e) {
        $('#username_'+e.pos).html('<b>'+e.name+'</b>');
        $('#qrcode_'+e.pos).hide();
    });
});

function connectSocketForCurrentGame() {
    socket.emit('enter game', gameId);
}

function getLink() {
    return location.href.replace(/index\.html/i, "");
}

$(function () {
    $('#newGame').on('click', function (e) {
        e.preventDefault();

        let $that = $(this);

        $.post(apiUrl + '/api/game')//problem here ?🤔🤔🤔🤔🤔🤔
            .done(function (d) {
                $('#addUser').removeClass('d-none');
                gameId = d.gameId;
                $that.hide();

                connectSocketForCurrentGame();
            })
            .fail(function (e) {
                alert('Error');
                console.log(e);
            });
    });

    $('#addUser').on('click', function (e) {
        e.preventDefault();

        ++usersCount;

        let link = getLink() + './user.html?id=' +usersCount + '&gameId=' + gameId;
        
        $('#users').append('<h3>'+ usersCount +':</h3> <a href="'+ link +'"><div id="qrcode_'+ usersCount +'"></div></a><span id="username_'+ usersCount +'"></span><hr>');

        new QRCode('qrcode_' + usersCount, link);
    });
});

// function send() {
//     var name = document.getElementById('method').value;
//     var params = document.getElementById('params').value;

//     socket.emit(name, params);
// }

// socket.emit('hello', null);

// socket.on('hello', function(msg){
//     document.getElementById('test').innerHTML += '<br>'+msg;
// });

// socket.on('helloall', function(msg){
//     document.getElementById('test').innerHTML += '<br>'+msg;
// });