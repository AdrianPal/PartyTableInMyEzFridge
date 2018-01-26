//contient le code js qu'il y avait dans index.html
$( document ).ready(function() 
{

    const apiUrl = URL_SERVER;    
        
    $('body').on('click', '#newGame', function (e) 
    {
        e.preventDefault();        
        let $that = $(this);
        console.log('before post, url = ' + apiUrl + '/api/game');
        $.post(apiUrl + '/api/game')//problem here ?🤔🤔🤔🤔🤔🤔
            .done(function (d) 
            {
                console.log('In post.done(), '+ apiUrl + '/api/game');
                $('#addUser').removeClass('d-none');
                gameId = d.gameId;
                $that.hide();

                connectSocketForCurrentGame();
            })
            .fail(function (e)
            {
                alert('Error');
                console.log(e);
            }); 
        });


    let usersCount = 0,
        gameId = null;

    var socket = io.connect(URL_SERVER);

    socket.on('refresh game', function (d) 
    {
        d.game.forEach(function(e) 
        {
            $('#username_'+e.pos).html('<b>'+e.name+'</b>');
            $('#qrcode_'+e.pos).hide();
        });
    });

    function connectSocketForCurrentGame() 
    {
        socket.emit('enter game', gameId);
    }

    function getLink() 
    {
        return location.href.replace(/index\.html/i, "");
    }   

    $('#addUser').on('click', function (e)
    {
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