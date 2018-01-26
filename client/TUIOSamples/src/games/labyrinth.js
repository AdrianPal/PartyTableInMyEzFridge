/**
 * @author: Arnaud ZAGO
 *
 */
import showBoardView from "../board";


var socket = io.connect('http://192.168.43.180:4000');

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

function drawElem(elem){
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


function solveInstructions(array) {
    let start = gid('generateMaze').kid(1).kid(1);
    let end = gid('generateMaze').lastChild.previousSibling
        .lastChild.previousSibling;

    let currentPos = start;
    currentPos.cls('v');
    let res = '';
    for (let i = 0; i < array.length; i++) {
        let dir = array[i];
        console.log(currentPos);

        if(currentPos.className.match('end')) {
            socket.emit("result",'Victory');
            res = 'victory';
            break;
        }
        else if (currentPos.className.match(dir)) {
            currentPos = currentPos.neighbors[convertDir(dir)];
            currentPos.cls('v');
        }
        else {
            socket.emit("result", "Defeat");
            res = 'defeat';
            break;
        }
    }
    if(res === ''){
        socket.emit("result", "Defeat");
    }


}

function initMobile() {
    socket.emit('mazeConnection');
    let res = '';
    socket.on('result', (result) => {
       $('#modal').modal();
       $('#maze').append(
           '<div class="modal fade" id="modal" role="dialog">'+
           '<div class="modal-dialog">'+
           '<div class="modal-content">' +
           '        <div class="modal-header">' +
           '          <button type="button" class="close" data-dismiss="modal">&times;</button>' +
           '          <h4 class="modal-title">'+result+'</h4>' +
           '        </div>' +
           '        <div class="modal-body">' +
           '          <p>Jouer à ce jeu rend chauve</p>' +
           '        </div>' +
           '        <div class="modal-footer">' +
           '          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
           '        </div>' +
           '      </div>' +
           '    </div>' +
           '</div>')
    });

    $('#app').append('' +
        '<div id="maze">' +
            '<div id="contentErase">' +
                '<div id="erase" class="btn btn-secondary btn-maze"><i class="fa fa-arrow-left" aria-hidden="true"></i>Suppr</div>'+
            '</div>'+
            '<div id="row-up">' +
            '   <div id="up" class="btn btn-secondary btn-maze"><i class="fa fa-chevron-up" aria-hidden="true"></i></div>' +
            '</div>' +
            '<div class="row-bottom">' +
                '   <div id="left" class="btn btn-secondary btn-maze"><i class="fa fa-chevron-left" aria-hidden="true"></i></div>' +
                '   <div id="down" class="btn btn-secondary btn-maze"><i class="fa fa-chevron-down" aria-hidden="true"></i></div>' +
                '   <div id="right" class="btn btn-secondary btn-maze"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>' +
            '</div>' +
            '<p id="array"></p>'+
            '<div class="send-container">' +
                '<div class="btn btn-danger btn-maze">'+
        '           <i class="fa fa-paper-plane-o" id="send" aria-hidden="true"></i>' +
                '</div>'+
        '   </div>'+
        '</>');

    let array = [];

    $('#send').click(function () {
        socket.emit('arrayToResolve', {array:array});
        for(let i =0; i<array.length;i++){
            $('#array i:last-child').remove();
        }
        array = [];

    });

    $('#up').click(function () {
        array.push('n');
        drawElem('<i class="fa fa-chevron-up" aria-hidden="true">');
    });

    $('#down').click(function () {
        array.push('s');
        drawElem('<i class="fa fa-chevron-down" aria-hidden="true">');

    });
    $('#left').click(function () {
        array.push('w');
        drawElem('<i class="fa fa-chevron-left" aria-hidden="true">');

    });
    $('#right').click(function () {
        array.push('e');
        drawElem('<i class="fa fa-chevron-right" aria-hidden="true">');

    });

    $('#erase').click(function () {
       array.pop();
       $('#array i:last-child').remove();
    });

    let height = $(window).width(); // New width
    $('#maze').height(height);
}

function initTable() {
    $('#app').append('' +
        '<div id="maze">' +
        '<div>' +
        '   <p id="makeMaze" class="btn btn-maze">Ready !</p>' +
        '</div> ' +
        '   <table id="generateMaze"/>' +
        '</div>');

    $('#makeMaze').click(function () {
        make_maze();
    });

    socket.on("arrayToResolve", (array) => {
        solveInstructions(array.array);
    });

    socket.on("mazeConnection", () => {
        console.log("newPlayer");
    })
}

function initGame() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        initMobile();
    } else {
        initTable();
    }

}

export default function launchLabyrinth(players) {
    $('#boardView').remove();

    // setTimeout(function()
    // {
    //     //Get back to the board
    //     showBoardView(players);
    // }, 1500);

    initGame();


}