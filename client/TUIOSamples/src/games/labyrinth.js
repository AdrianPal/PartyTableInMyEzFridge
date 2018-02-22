/**
 * @author: Arnaud ZAGO
 *
 */
import SocketManager from "../../socket.manager";
import User from "../user/user";
import * as config from "../../config";
import getUrlParameter from '../../tools';
import Home from "../home/home";


var socket = SocketManager.get();
var usersArray = [];
var gameId = 0;
var arrayForResolving = [];
var pos = '';
var currentUser = {};
var resultArray = new Array();
var arrayReset = new Array();
var labyrinthSave;
var arraySaveDirectionForUsers = new Array();
var isMobile = false;
var usersArrayReady = [];


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


function solveInstructions(array, user, target) {
    let start = gid(target).kid(1).kid(1);
    let end = gid(target).lastChild.previousSibling
        .lastChild.previousSibling;

    let h = 5;
    let w = 5;
    let tbl = gid(target);
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

    let currentPos = start;
    let path = new Array();
    path.push(start);

    for (let i = 0; i < array.length; i++) {
        let dir = array[i];
        if (currentPos.className.match('end')) {
            break;
        } else if (currentPos.className.match(dir)) {
            currentPos = currentPos.neighbors[convertDir(dir)];
            path.push(currentPos);
        } else {
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


    if (!isMobile) {

        resultArray.push({
            path: path,
            user: user
        });

        if (resultArray.length === usersArray.length) {
            let triggerResult = function () {
                return function () {
                    triggerWinners();
                }
            };
            setTimeout(triggerResult(), path.length * 600);
        }
    }

}


function isReady() {
    $('#app').append('' +
        '<div id="contentReady">' +
        '<div id="rules">' +
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="60px" height="60px">' +
        '                    <g>' +
        '                        <g>' +
        '                            <path d="M131.187,19.652c-32.212,0-58.423,25.972-58.423,57.775l-2.124,299.552l31.867,0.228l2.125-299.663    c0-14.351,11.913-26.025,26.556-26.025h320.266V19.652H131.187z" fill="#006DF0"/>' +
        '                        </g>' +
        '                    </g>' +
        '                    <g>' +
        '                        <g>' +
        '                            <path d="M451.452,19.652c-33.386,0-60.548,27.161-60.548,60.548v336.199c0,24.304-19.779,44.083-44.083,44.083    s-44.083-19.779-44.083-44.083v-38.772c0-8.801-7.133-15.934-15.934-15.934H15.934C7.133,361.693,0,368.826,0,377.627v38.772    c0,41.879,34.071,75.95,75.95,75.95v-31.867c-24.309,0-44.083-19.779-44.083-44.083V393.56h239.004v22.838    c0,41.879,34.071,75.95,75.95,75.95c41.879,0,75.95-34.071,75.95-75.95V167.303h73.295c8.801,0,15.934-7.133,15.934-15.934v-71.17    C512,46.813,484.839,19.652,451.452,19.652z M480.133,135.436h-57.361V80.199c0-15.817,12.869-28.68,28.68-28.68    s28.68,12.864,28.68,28.68V135.436z" fill="#006DF0"/>' +
        '                        </g>' +
        '                    </g>' +
        '                    <g>' +
        '                        <g>' +
        '                            <rect x="72.763" y="460.481" width="270.335" height="31.867" fill="#006DF0"/>' +
        '                        </g>' +
        '                    </g>' +
        '                    <g>' +
        '                        <g>' +
        '                            <path d="M236.88,108.349h-82.324c-8.801,0-15.934,7.133-15.934,15.934s7.133,15.934,15.934,15.934h82.324    c8.801,0,15.934-7.133,15.934-15.934S245.68,108.349,236.88,108.349z" fill="#006DF0"/>' +
        '                        </g>' +
        '                    </g>' +
        '                    <g>' +
        '                        <g>' +
        '                            <path d="M332.481,172.083H154.556c-8.801,0-15.934,7.133-15.934,15.934s7.133,15.934,15.934,15.934h177.925    c8.801,0,15.934-7.133,15.934-15.934S341.282,172.083,332.481,172.083z" fill="#006DF0"/>' +
        '                        </g>' +
        '                    </g>' +
        '                    <g>' +
        '                        <g>' +
        '                            <path d="M332.481,235.817H154.556c-8.801,0-15.934,7.133-15.934,15.934c0,8.801,7.133,15.934,15.934,15.934h177.925    c8.801,0,15.934-7.128,15.934-15.934C348.415,242.95,341.282,235.817,332.481,235.817z" fill="#006DF0"/>' +
        '                        </g>' +
        '                    </g>' +
        '                    <g>' +
        '                        <g>' +
        '                            <path d="M332.481,299.552H154.556c-8.801,0-15.934,7.133-15.934,15.934s7.133,15.934,15.934,15.934h177.925    c8.801,0,15.934-7.133,15.934-15.934S341.282,299.552,332.481,299.552z" fill="#006DF0"/>' +
        '                        </g>' +
        '                    </g>' +
        '                </svg>' +
        '</div>' +
        '<div id="isReadyDiv" class="btn btn-maze">' +
        '   <i id="isReady" class="fa fa-play-circle"></i>' +
        '</div>' +
        '</div>');

    $('#isReadyDiv').click(function () {
        socket.emit("isReady");
        $('#isReady').replaceWith("" +
            "<p class='waiting'>Waiting for players..." +
            " <br/> Stay at your place !</p>")
    })

    $('#rules').click(function () {
        $('#app').append('' +
            '<div class="modal fade" id="myModal" role="dialog">' +
            '    <div class="modal-dialog">' +
            '    ' +
            '      <!-- Modal content-->' +
            '      <div class="modal-content">' +
            '        <div class="modal-header">' +
            '          <button type="button" class="close" data-dismiss="modal">&times;</button>' +
            '          <h4 class="modal-title">Rules</h4>' +
            '        </div>' +
            '        <div class="modal-body">' +
            '          <h3>The goal is to go from the <span class="color-green">green square</span> to the <span class="color-red">red square</span>. <br/> The <span class="color-winner">winner</span> is the one closest to the red square</h3>' +
            '       <br/>' +
            '          <p>You have to remembered the maze which is on the table<br/> you have few times to do this</p>' +
            '          <img class="modal-image" src="../../assets/maze/labyrinth.PNG"/>' +
            '          <p>Then it will disappear</p>' +
            '          <img class="modal-image" src="../../assets/maze/blured.PNG"/>' +
            '          <p>Give the right directions to get to the red square</p>' +
            '          <img  class="modal-image" src="../../assets/maze/arrows.PNG"/>' +
            '        </div>' +
            '        <div class="modal-footer">' +
            '          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
            '        </div>' +
            '      </div>' +
            '      ' +
            '    </div>' +
            '  </div>');

        $("#myModal").modal();

    })
}

function triggerWinners() {
    let greater = 0;
    for (let e of resultArray) {
        if (e.path.length > greater) {
            greater = e.path.length;
        }
    }

    let winners = [];

    // let labyrinth = $('#generateMaze').html();


    for (let winner of resultArray) {
        //let maze = cleanMaze(winner, labyrinth);

        if (winner.path.length === greater) {
            winners.push(winner.user);

            socket.emit("result", "Victory", {
                user: winner.user,
                maze: labyrinthSave
            });

            $.ajax({
                url: config.server + '/api/user/points',
                type: 'PUT',
                data: {
                    userId: winner.user._id,
                    points: 5
                }
            });


        } else {
            socket.emit("result", "Defeat", {
                user: winner.user,
                maze: labyrinthSave,
            });
        }
    }

}

function reset() {
    if (arrayReset.length === usersArray.length) {
        socket.removeAllListeners("isReady");
        socket.removeAllListeners("maze reset");
        new Home(gameId)
    }
}


function resolveGame() {
    socket.on("arrayToResolve", (array, user) => {

        for (let i = 0; i < arrayForResolving.length; i++) {
            if (user.user._id === arrayForResolving[i].user._id) {
                arrayForResolving.splice(i, 1);
            }
        }

        arrayForResolving.push({
            array: array.array,
            user: user.user
        });

        if (arrayForResolving.length === usersArray.length) {

            document.getElementById('generateMaze').classList.remove("blured");
            document.getElementById('progressBar').remove();


            for (let i = 0; i < arrayForResolving.length; i++) {
                var resolve = function () {
                    return function () {
                        solveInstructions(arrayForResolving[i].array, arrayForResolving[i].user, "generateMaze");
                    }
                };
                setTimeout(resolve(), arrayForResolving[i].array.length * 600);

            }
        }
    });
}

function initMobile() {

    isReady();

    socket.on('startLabyrinth', () => {

        $('#contentReady').remove();

        socket.on('result', (result, user) => {

            document.getElementById('maze').innerHTML = '' +
                '<p class="' + result + '">' + result + '</p>' +
                '<p  id="review" class="buttonNext">Review</p>' +
                '<table id="generateMazeMobile"></table>' +
                '<p id="nextGame" class="buttonNext">Next Game ></p>';
            let colorBackground = (result === 'Victory') ? 'darkgreen' : 'darkred';
            (result === 'Victory') ? $('#taDa')[0].play() : $('#boo')[0].play();

            $('#nextGame').click(function () {
                socket.emit('maze reset', user.user._id);
                $('#nextGame').empty();
                $('#nextGame').append("Waiting for your friends");
                $('#nextGame').css("width", '10em');
                $('#nextGame').css("border", 'none');

            });

            $("#generateMazeMobile").append(user.maze);
            solveInstructions(arraySaveDirectionForUsers, user.user, "generateMazeMobile");

            document.getElementById('maze').style.background = colorBackground;

            $('#review').click(function () {
                $("#generateMazeMobile").empty();
                $("#generateMazeMobile").append(user.maze);
                solveInstructions(arraySaveDirectionForUsers, user.user, "generateMazeMobile");
            });
        });

        $('#maze').remove();
        $('#app').append('' +
            '<audio  id = "step"> <source src="../../assets/sound/step.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>' +
            '<audio  id = "boo"> <source src="../../assets/sound/boo.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>' +
            '<audio  id = "taDa"> <source src="../../assets/sound/taDa.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>' +
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
            console.log('resolve', array);
            socket.emit('arrayToResolve', {
                array: array
            }, {
                user: currentUser
            });
            for (let i = 0; i < array.length; i++) {
                $('#array svg').last().remove();
            }
            arraySaveDirectionForUsers = array;
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
            socket.emit('arrayToResolve', {
                array: array
            });
            for (let i = 0; i < array.length; i++) {
                $('#array svg').last().remove();
            }
            arraySaveDirectionForUsers = array;
            array = new Array();
            document.getElementById('maze').innerHTML = '<p class="waiting">Time Up !</p>';
        })

    });

}

function initTable() {
    $('#app').append('' +
        '<div id="maze">' +
        '<audio  id = "start"> <source src="../../assets/sound/start.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>' +
        '<audio  id = "step"> <source src="../../assets/sound/step.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>' +
        '<div>' +
        '   <h2 id="startingInformation"><i class="fa fa-mobile-alt fa-spin"></i></h2>' +
        '</div id="mazeContainer"> ' +
        '   <div id="resultContainer"></div>' +
        '   <table id="generateMaze" class="test"/>' +
        '</div>');


    usersArrayReady = [];

    socket.on('isReady', (userId) => {

        for (let i = 0; i < usersArrayReady.length; i++) {
            if (userId === usersArrayReady[i]) {
                usersArrayReady.splice(i, 1);
            }
        }
        usersArrayReady.push(userId);

        if (usersArrayReady.length === usersArray.length) {

            socket.emit('startLabyrinth');

            resolveGame();


            $('#startingInformation').remove();

            make_maze();

            labyrinthSave = $('#generateMaze').html();

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
                $element.find('div').animate({
                    width: progressBarWidth
                }, 500);
                if (timeleft > 0) {
                    setTimeout(function () {
                        progress2(timeleft - 1, timetotal, $element);
                    }, 1000);
                } else {
                    if (usersArray.length !== resultArray.length)
                        socket.emit('timeUp');
                }

            };

            function progress(timeleft, timetotal, $element) {
                var progressBarWidth = timeleft * $element.width() / timetotal;
                $element.find('div').animate({
                    width: progressBarWidth
                }, 500);
                if (timeleft > 0) {
                    setTimeout(function () {
                        progress(timeleft - 1, timetotal, $element);
                    }, 1000);
                } else {
                    var genMaze = document.getElementById("generateMaze");
                    if (usersArray.length !== resultArray.length)
                        genMaze.className += " blured";
                    progress2(60, 60, $('#progressBar'));
                }
            };

            progress(15, 15, $('#progressBar'));
        }
    });


    socket.on('maze reset', (userId) => {

        for (let i = 0; i < arrayReset.length; i++) {
            if (userId === arrayReset[i]) {
                arrayReset.splice(i, 1);
            }
        }
        arrayReset.push(userId);
        reset();
    })


}

function getPlayers() {
    return $.get(config.server + '/api/user/' + gameId);
}

function initGame() {
    let mobile = getUrlParameter('view');
    if ((mobile === "mobile")) {
        pos = getUrlParameter('pos');
        $.get(config.server + '/api/user/' + gameId + '/' + pos).done(
            res => {
                isMobile = true;
                currentUser = res;
                initMobile();
            }
        )

    } else {
        getPlayers().done(res => {
            usersArray = res;
            console.log("users Array ", usersArray);

            initTable();
            socket.emit('mobile launch labyrinth');
        });
    }
}

export default function launchLabyrinth(gameIdParam) {
    $('#app').empty();
    $('#app').append('<link rel="stylesheet" href="/assets/css/labirynth.css">');
    $('#start').remove();

    socket = SocketManager.get();
    usersArray = [];
    gameId = 0;
    arrayForResolving = new Array();
    pos = '';
    currentUser = {};
    resultArray = new Array();
    arrayReset = new Array();
    labyrinthSave;
    arraySaveDirectionForUsers = new Array();
    isMobile = false;
    usersArrayReady = [];


    User.removeCurrentPlayer();

    gameId = gameIdParam;

    // setTimeout(function()
    // {
    //     //Get back to the board
    //     showBoardView(players);
    // }, 1500);

    initGame();


}