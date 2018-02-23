import User from '../../user/user'
import Home from '../../home/home'
import SocketManager from '../../../socket.manager';
import Anywhere from '../../tools/anywhere';
import PictionaryMobile from './mobile/pictionary.mobile';
const config = require('../../../config');

export default class Pictionary {

    static get getCurrentDirectory() {
        return 'src/games/pictionary/';
    }

    static get countDownTime() {
        return 90;
    }

    constructor(gameId)  {
        this.gameId = gameId;
        
        $('#start').hide();
        this.app = $('#app');
        this.initGame();
        this.isPainting = false;
        this.context = null;
        this.canvas = {
            top: null,
            left: null,
            bot: null,
            right: null
        }
        this.context = {
            top: null,
            left: null,
            bot: null,
            right: null
        }

        this.getPlayers()
            .done(function (d) {
                let POSITION = ["top", "bottom", "left", "right"];
                console.log(d);

                for (var players of d) {
                    var position = POSITION.indexOf(players.pos);
                    if(position > -1) {

                        POSITION.splice(position, 1);
                    }
                }
                for(var position of POSITION) {
                    var currentPosition = position.charAt(0).toUpperCase() + position.slice(1);
                    $('#pictionaryCanvas' + currentPosition).remove();
                    console.log('#pictionaryCanvas' + currentPosition);
                }
            })
            .fail(function (e) {
                alert("Can't get the players -- twister.");
                console.log(e);
            })
    }

    initGame() {
        const that = this;
        this.app.load(Pictionary.getCurrentDirectory + 'pictionary.view.html', function () {
            SocketManager.get().emit('mobile enter pictionary game');
            that.initCountdown();
        });
    }

    initCanvas() {

        this.canvas = {
            top: document.getElementById('pictionaryCanvasTop'),
            left: document.getElementById('pictionaryCanvasLeft'),
            bot: document.getElementById('pictionaryCanvasBottom'),
            right: document.getElementById('pictionaryCanvasRight')
        }

        if(this.canvas.top) {
            this.context.top = this.canvas.top.getContext('2d');
            this.canvas.top.setAttribute('width', 400);
            this.canvas.top.setAttribute('height', 400);

            this.canvas.top.style.width = 400 + 'px';
            this.canvas.top.style.height = 200 + 'px';

            if(this.width == undefined) {
                this.width = this.canvas.top.width;
                this.height = this.canvas.top.height;    
            }
        }
        
        if(this.canvas.left){
            this.context.left = this.canvas.left.getContext('2d');

            this.canvas.left.setAttribute('width', 400);
            this.canvas.left.setAttribute('height', 400);
            this.canvas.left.style.width = 400 + 'px';
            this.canvas.left.style.height = 200 + 'px';
            if(this.width == undefined) {
                this.width = this.canvas.left.width;
                this.height = this.canvas.left.height;    
            }

        }
        
        if(this.canvas.bot) {
            this.context.bot = this.canvas.bot.getContext('2d');

            this.canvas.bot.setAttribute('width', 400);
            this.canvas.bot.setAttribute('height', 400);
            this.canvas.bot.style.width = 400 + 'px';
            this.canvas.bot.style.height = 200 + 'px';
            if(this.width == undefined) {
                this.width = this.canvas.bot.width;
                this.height = this.canvas.bot.height;    
            }

        }
        
        if(this.canvas.right){
            this.context.right = this.canvas.right.getContext('2d');

            this.canvas.right.setAttribute('width', 400);
            this.canvas.right.setAttribute('height', 400);
            this.canvas.right.style.width = 400 + 'px';
            this.canvas.right.style.height = 200 + 'px';

            if(this.width == undefined) {
                this.width = this.canvas.right.width;
                this.height = this.canvas.right.height;    
            }

        }
        
        

        
    }

    initDrawingSocketBinding() {
        var that = this;
        SocketManager.get().on('isDrawing', (strokes, distantColor, size) => {
            that.redraw(strokes);
        });
    }
    initCountdown() {
        var countdown = $('#countdown');
        const that = this; 
        that.initDrawingSocketBinding();
        SocketManager.get().on('decreaseCountdown', function (value, gameId) {
            $('#drawingZone').show();
            if (that.context.top == null) {
                that.initCanvas();
            }
            $('#pictionaryCanvas').show();
            $('#header').hide();
            $('#countdown').show();
            $('#instructions').hide();

            if (value == 'EXPIRED') {
                $('#pictionaryContainer').hide();
                $('#lostWrapper').show().css('display', 'flex');
                User.remove();
                let anywhere = new Anywhere(that, that.goHome);
                anywhere.addTo($('body').get(0));
            } else {
                var countdownValue = value;
                var currentProgress = countdownValue / PictionaryMobile.initialCountDownValue * 100;
                $('#current-progress').animate({
                    width: currentProgress + '%'
                }, 500);
           }
        });

        SocketManager.get().on('proposal', function (response, user, drawerName)  {
            $('#proPic').css({
                'backgroundImage': 'url(' + config.server + '/' + user.avatarPath + ')',
                'borderColor': user.color
            });
            $('#propWord').html(response);
            $('#prop').css('display','flex');
        });

        SocketManager.get().on('decline', function() {
            $('#prop').hide();
        })

        SocketManager.get().on('pictionaryEnd', function (posDrawer, winner, gameId)  {
            $.get(config.server + '/api/user/' + gameId + '/' + posDrawer)
                .done(function (user) {
                    $('#modalProposal').modal('hide');
                    $('#pictionaryContainer').hide();
                    $('#winnerWrapper').show().css('display', 'flex');
                    $('#drawerPic').css({
                        'backgroundImage': 'url(' + config.server + '/' + user.avatarPath + ')',
                        'borderColor': user.color
                    });

                    $('#finderPic').css({
                        'backgroundImage': 'url(' + config.server + '/' + winner.avatarPath + ')',
                        'borderColor': winner.color
                    });

                    $.ajax({
                        url: config.server + '/api/user/points',
                        type: 'PUT',
                        data: {
                            userId: user._id,
                            points: 2
                        }
                    });

                    $.ajax({
                        url: config.server + '/api/user/points',
                        type: 'PUT',
                        data: {
                            userId: winner._id,
                            points: 1
                        }
                    });
                    
                    User.remove();

                    let anywhere = new Anywhere(that, that.goHome);
                    anywhere.addTo($('body').get(0));
                });

        });
    }

    resetSocket() {
        SocketManager.get().removeAllListeners('decreaseCountdown');
        SocketManager.get().removeAllListeners('proposal');
        SocketManager.get().removeAllListeners('decline');
        SocketManager.get().removeAllListeners('pictionaryEnd');
        SocketManager.get().removeAllListeners('isDrawing');
        




    }
    goHome(widget) {
        widget.deleteWidget();

        new Home(this.gameId);
    }

    clearCanvas () {
        for(var pos in this.context){
            if(this.context[pos]){
                this.context[pos].clearRect(0, 0, this.width, this.height);
            }
        }
   }

    redraw(strokes) {

        this.clearCanvas();

        for (var i = 0; i < strokes.length; i++) {
            this.drawStroke(strokes[i]);
        }

    }

    normalizePoint (point) {
        return {
            x: point.x * this.width,
            y: point.y * this.height
        };
    }


    normalizeLineSize (size) {
        return size * this.width;
    }

    drawStroke (stroke) {
        for (var pos in this.context) {
            if(this.context[pos]) {
                this.context[pos].beginPath()
            }
        } 

        for (var j = 0; j < stroke.points.length - 1; j++) {
            var start = this.normalizePoint(stroke.points[j]);
            var end = this.normalizePoint(stroke.points[j + 1]);

            for (var pos in this.context) {
                if(this.context[pos]){
                    this.context[pos].moveTo(start.x, start.y);
                    this.context[pos].lineTo(end.x, end.y);    
                }
            }
        }

        for (var pos in this.context) {
            if(this.context[pos]){
                this.context[pos].closePath();
                this.context[pos].strokeStyle = stroke.color;
                this.context[pos].lineWidth = this.normalizeLineSize(stroke.size);
                this.context[pos].lineJoin = stroke.join;
                this.context[pos].lineCap = stroke.cap;
                this.context[pos].miterLimit = stroke.miterLimit;
                this.context[pos].stroke();
            }
        }
    }

    getPlayers() {
        return $.get(config.server + '/api/user/' + this.gameId);
    }



}