/**
 * @author: Arnaud ZAGO
 *
 */
import SocketManager from "../../socket.manager";
import User from "../user/user";
import * as config from "../../config";
import getUrlParameter from '../../tools';


var socket = SocketManager.get();
var usersArray = [];
var gameId = 0;
var arrayForResolving = [];
var pos = '';
var currentUser = {};
var resultArray = new Array();



var launched = false;

Node.prototype.add = function (tag, cnt, txt) {
    for (var i = 0; i < cnt; i++)
        this.appendChild(ce(tag, txt));
};
Node.prototype.ins = function (tag) {
    this.insertBefore(ce(tag), this.firstChild)
};
Node.prototype.kid = function (i) {
    return this.childNodes[i]
};
Node.prototype.cls = function (t) {
    this.className += ' ' + t
};

NodeList.prototype.map = function (g) {
    for (var i = 0; i < this.length; i++) g(this[i]);
};

function ce(tag, txt) {
    var x = document.createElement(tag);
    if (txt !== undefined) x.innerHTML = txt;
    return x
}

function gid(e) {
    return document.getElementById(e)
}

function irand(x) {
    return Math.floor(Math.random() * x)
}

function make_maze() {
    var w = parseInt(5);
    var h = parseInt(5);
    var tbl = gid('generateMaze');
    tbl.innerHTML = '';
    tbl.add('tr', h);
    tbl.childNodes.map(function (x) {
        x.add('th', 1);
        x.add('td', w, '*');
        x.add('th', 1)
    });
    tbl.ins('tr');
    tbl.add('tr', 1);
    tbl.firstChild.add('th', w + 2);
    tbl.lastChild.add('th', w + 2);
    for (var i = 1; i <= h; i++) {
        for (var j = 1; j <= w; j++) {
            tbl.kid(i).kid(j).neighbors = [
                tbl.kid(i + 1).kid(j),
                tbl.kid(i).kid(j + 1),
                tbl.kid(i).kid(j - 1),
                tbl.kid(i - 1).kid(j)
            ];
        }
    }

    walk(tbl.kid(irand(h) + 1).kid(irand(w) + 1));
    let start = gid('generateMaze').kid(1).kid(1);
    let end = gid('generateMaze').lastChild.previousSibling.lastChild.previousSibling;
    start.cls("start");
    end.cls("end");

}

function shuffle(x) {
    for (var i = 3; i > 0; i--) {
        var j = irand(i + 1);
        if (j == i) continue;
        var t = x[j];
        x[j] = x[i];
        x[i] = t;
    }
    return x;
}

var dirs = ['s', 'e', 'w', 'n'];

function walk(c) {
    c.innerHTML = '&nbsp;';
    var idx = shuffle([0, 1, 2, 3]);
    for (var j = 0; j < 4; j++) {
        var i = idx[j];
        var x = c.neighbors[i];
        if (x.textContent != '*') continue;
        c.cls(dirs[i]), x.cls(dirs[3 - i]);
        walk(x);
    }
}

function drawElem(elem) {
    $('#array').append(elem)
}

function convertDir(dir) {
    switch (dir) {
        case 's':
            return 0;
        case 'e':
            return 1;
        case 'w':
            return 2;
        case 'n':
            return 3;
    }

}


function solveInstructions(array, user) {
    let start = gid('generateMaze').kid(1).kid(1);
    let end = gid('generateMaze').lastChild.previousSibling
        .lastChild.previousSibling;

    let currentPos = start;
    let path = new Array();
    path.push(start);

    for (let i = 0; i < array.length; i++) {
        let dir = array[i];

        if (currentPos.className.match('end')) {
            break;
        }
        else if (currentPos.className.match(dir)) {
            currentPos = currentPos.neighbors[convertDir(dir)];
            path.push(currentPos);
        }
        else {
            break;
        }
    }

    for (let i = 0; i < path.length; i++) {

        var paint = function () {
            return function () {
                path[i].style = "background : " + user.color;
                $('#step')[0].play();
            }
        };

        setTimeout(paint(), 500 * i);
    }

    resultArray.push({path: path, user: user});

    if(resultArray.length === usersArray.length) {
        triggerWinners()

    }
}

function isReady() {
    $('body').append('' +
        '<div id="isReadyDiv" class="btn btn-maze">' +
        '  <i id="isReady" class="fa fa-play-circle"></i>' +
        '</div');
    $('#isReadyDiv').click(function () {
        socket.emit("isReady");
        $('#isReady').replaceWith("" +
            "<p class='waiting'>Waiting for players...</p>" +
            "<p class='waiting'>Stay at your place !</p>")


    })

}

function triggerWinners(){
    let greater = 0;
    for (let e of resultArray) {
        console.log('element', e);
        if (e.path.length > greater) {
            greater = e.path.length;
        }
    }

    let winners = [];

    for (let winner of resultArray) {
        if (winner.path.length === greater) {
            winners.push(winner.user);
            socket.emit("result", "Victory", {user: winner.user});

            $.ajax({
                url: config.server + '/api/user/points',
                type: 'PUT',
                data: {
                    userId: winner.user._id,
                    points: 5
                }
            });

        } else {
            socket.emit("result", "Defeat", {user: winner.user});
        }
    }

    //TODO display cup next to the winner(s)

}

function resolveGame() {
    socket.on("arrayToResolve", (array, user) => {

        arrayForResolving.push({array: array.array, user: user.user});
        if (arrayForResolving.length === usersArray.length) {
            document.getElementById('generateMaze').classList.remove("blured");
            document.getElementById('progressBar').remove();


            for (let i = 0; i < arrayForResolving.length; i++) {
                var resolve = function () {
                    return function () {
                       solveInstructions(arrayForResolving[i].array, arrayForResolving[i].user);

                    }
                };
                setTimeout(resolve(), arrayForResolving[i].array.length * 1000 * i);

            }



        }
    });
}

function initMobile() {

    isReady();

    socket.on('startLabyrinth', () => {

        $('#isReadyDiv').remove();

        socket.on('result', (result) => {
            document.getElementById('maze').innerHTML = '<p class="' + result + '">' + result + '</p>';
            let colorBackground = (result==='Victory') ? 'darkgreen' : 'darkred';
            (result==='Victory') ? $('#taDa')[0].play() : $('#boo')[0].play();

            document.getElementById('maze').style.background = colorBackground;
        });

        $('body').append('' +
            '<audio  id = "boo"> <source src="../../assets/sound/boo.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
            '<audio  id = "taDa"> <source src="../../assets/sound/taDa.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
            '<div id="maze">' +
            '<div id="infos" ></div>' +
            '<p id="array"></p>' +
            '<div id="contentErase">' +
            '<div id="erase" class="btn btn-secondary btn-maze-long"><i class="fa fa-arrow-left" aria-hidden="true"></i>Suppr</div>' +
            '</div>' +
            '<div id="row-up">' +
            '   <div id="up" class="btn btn-secondary btn-maze"><i class="fa fa-chevron-up" aria-hidden="true"></i></div>' +
            '</div>' +
            '<div class="row-bottom">' +
            '   <div id="left" class="btn btn-secondary btn-maze"><i class="fa fa-chevron-left" aria-hidden="true"></i></div>' +
            '   <div id="down" class="btn btn-secondary btn-maze"><i class="fa fa-chevron-down" aria-hidden="true"></i></div>' +
            '   <div id="right" class="btn btn-secondary btn-maze"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>' +
            '</div>' +
            '<div class="send-container">' +
            '<div class="btn btn-danger btn-maze-long" id="send">' +
            '           <i class="fa fa-paper-plane"  aria-hidden="true"></i>' +
            '</div>' +
            '   </div>' +
            '</>');

        let array = [];

        var infos = document.getElementById("infos");
        infos.innerHTML = '<p class="infos">Remember the path to the <label class="color-green">begining</label>' +
            ' to the <label class="color-red">end</label></p>';

        $('#send').on('click', function () {
            socket.emit('arrayToResolve', {array: array}, {user: currentUser});
            for (let i = 0; i < array.length; i++) {
                $('#array svg').last().remove();
            }
            array = new Array();
            document.getElementById('maze').innerHTML = '<p class="waiting">Wait your result !</p>';

        });

        $('#up').click(function () {
            switch (currentUser.pos) {
                case "bottom":
                    array.push('n');
                    break;
                case "right":
                    array.push('w');
                    break;
                case "top":
                    array.push('s');
                    break;
                case "left":
                    array.push('e');
                    break;
                default:
                    array.push('n');
                    break;
            }
            drawElem('<i class="fa fa-chevron-up" aria-hidden="true">');
        });

        $('#down').click(function () {
            switch (currentUser.pos) {
                case "bottom":
                    array.push('s');
                    break;
                case "right":
                    array.push('e');
                    break;
                case "top":
                    array.push('n');
                    break;
                case "left":
                    array.push('w');
                    break;
                default:
                    array.push('s');
                    break;
            }
            drawElem('<i class="fa fa-chevron-down" aria-hidden="true">');

        });
        $('#left').click(function () {
            switch (currentUser.pos) {
                case "bottom":
                    array.push('w');
                    break;
                case "right":
                    array.push('s');
                    break;
                case "top":
                    array.push('e');
                    break;
                case "left":
                    array.push('n');
                    break;
                default:
                    array.push('w');
                    break;
            }
            drawElem('<i class="fa fa-chevron-left" aria-hidden="true">');

        });
        $('#right').click(function () {
            switch (currentUser.pos) {
                case "bottom":
                    array.push('e');
                    break;
                case "right":
                    array.push('n');
                    break;
                case "top":
                    array.push('w');
                    break;
                case "left":
                    array.push('s');
                    break;
                default:
                    array.push('e');
                    break;
            }
            drawElem('<i class="fa fa-chevron-right" aria-hidden="true">');

        });

        $('#erase').click(function () {
            array.pop();
            $('#array svg').last().remove();
        });

        socket.on('timeUp', () => {
            socket.emit('arrayToResolve', {array: array});
            for (let i = 0; i < array.length; i++) {
                $('#array svg').last().remove();
            }
            array = new Array();
            document.getElementById('maze').innerHTML = '<p class="waiting">Time Up !</p>';
        })

    });

}

function initTable() {
    $('body').append('' +
        '<div id="maze">' +
        '<audio  id = "start"> <source src="../../assets/sound/start.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
        '<audio  id = "step"> <source src="../../assets/sound/step.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
        '<div>' +
        '   <h2 id="startingInformation"><i class="fa fa-mobile-alt fa-spin"></i></h2>' +
        '</div id="mazeContainer"> ' +
        '   <div id="resultContainer"></div>' +
        '   <table id="generateMaze" class="test"/>' +
        '</div>');


    var usersArrayReady = [];

    socket.on('isReady', (userId) => {
        usersArrayReady.push(userId);
        if (usersArrayReady.length === usersArray.length) {

            socket.emit('startLabyrinth');

            resolveGame();


            $('#startingInformation').remove();

            make_maze();

            $('#start')[0].play();

            // $('#maze').append('<h3 id="titleDisappear">Disappear in : </h3> <h3 id="countdown"></h3>');
            $('#maze').append('<h3 id="titleDisappear"></h3> ' +
                '<div id="progressBar">' +
                '  <div class="bar"></div>' +
                '</div>');

            var oldDate = new Date();
            var newDate = new Date(oldDate.getTime() + 20000);
            var newDateTimer = new Date(oldDate.getTime() + 200000);


            function progress2(timeleft, timetotal, $element) {
                var progressBarWidth = timeleft * $element.width() / timetotal;
                $element.find('div').animate({ width: progressBarWidth }, 500);
                if(timeleft > 0) {
                    setTimeout(function () {
                        progress2(timeleft - 1, timetotal, $element);
                    }, 1000);
                }else{
                    if(usersArray.length !== resultArray.length)
                        socket.emit('timeUp');
                }

            };

            function progress(timeleft, timetotal, $element) {
                var progressBarWidth = timeleft * $element.width() / timetotal;
                $element.find('div').animate({ width: progressBarWidth }, 500);
                if(timeleft > 0 ) {
                    setTimeout(function () {
                        progress(timeleft - 1, timetotal, $element);
                    }, 1000);
                }else{
                    var genMaze = document.getElementById("generateMaze");
                    if(usersArray.length !== resultArray.length)
                        genMaze.className += " blured";
                    progress2(60, 60, $('#progressBar'));
                }
            };

            progress(15, 15, $('#progressBar'));



            // $('#countdown').countdown(newDate, function (event) {
            //     $(this).html(event.strftime('%M:%S'));
            // }).on('finish.countdown', function (event) {
            //     $('#titleDisappear').html('<h3>You have</h3>');
            //     $('#countdown').countdown(newDateTimer, function (event) {
            //         $(this).html(event.strftime('%M:%S'));
            //     }).on('finish.countdown', function (event) {
            //         socket.emit('timeUp');
            //     });
            //     var genMaze = document.getElementById("generateMaze");
            //     genMaze.className += " blured";
            //
            // });
        }
    });




}

function getPlayers() {
    return $.get(config.server + '/api/user/' + gameId);
}

function initGame() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !launched) {
        launched = true;
        pos = getUrlParameter('pos');
        $.get(config.server + '/api/user/' + gameId + '/' + pos).done(
            res => {
                currentUser = res;
                initMobile();
                console.log(currentUser);
            }
        )

    } else if (!launched) {
        getPlayers().done(res => {
                usersArray = res;
                console.log("users Array ", usersArray);

                initTable();
                socket.emit('mobile launch labyrinth');
            }
        );
        launched = true;
    }
}

export default function launchLabyrinth(gameIdParam) {
    $('#app').remove();
    $('#start').remove();

    User.removeCurrentPlayer();

    gameId = gameIdParam;

    // setTimeout(function()
    // {
    //     //Get back to the board
    //     showBoardView(players);
    // }, 1500);

    initGame();


}