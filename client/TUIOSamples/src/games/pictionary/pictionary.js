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
            bot: document.getElementById('pictionaryCanvasBot'),
            right: document.getElementById('pictionaryCanvasRight')
        }
        this.context = {
            top: this.canvas.top.getContext('2d'),
            left: this.canvas.left.getContext('2d'),
            bot: this.canvas.bot.getContext('2d'),
            right: this.canvas.right.getContext('2d')
        };

        this.canvas.top.setAttribute('width', 400);
        this.canvas.top.setAttribute('height', 400);
        this.canvas.top.style.width = 400 + 'px';
        this.canvas.top.style.height = 200 + 'px';

        this.canvas.left.setAttribute('width', 400);
        this.canvas.left.setAttribute('height', 400);
        this.canvas.left.style.width = 400 + 'px';
        this.canvas.left.style.height = 200 + 'px';

        this.canvas.bot.setAttribute('width', 400);
        this.canvas.bot.setAttribute('height', 400);
        this.canvas.bot.style.width = 400 + 'px';
        this.canvas.bot.style.height = 200 + 'px';

        this.canvas.right.setAttribute('width', 400);
        this.canvas.right.setAttribute('height', 400);
        this.canvas.right.style.width = 400 + 'px';
        this.canvas.right.style.height = 200 + 'px';
        

        this.width = this.canvas.top.width;
        this.height = this.canvas.top.width;
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

    goHome(widget) {
        widget.deleteWidget();

        new Home(this.gameId);
    }

    clearCanvas () {
        this.context.top.clearRect(0, 0, this.width, this.height);
        this.context.left.clearRect(0, 0, this.width, this.height);
        this.context.bot.clearRect(0, 0, this.width, this.height);
        this.context.right.clearRect(0, 0, this.width, this.height);
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
        this.context.top.beginPath();
        this.context.left.beginPath();
        this.context.bot.beginPath();
        this.context.right.beginPath();



        for (var j = 0; j < stroke.points.length - 1; j++) {
            var start = this.normalizePoint(stroke.points[j]);
            var end = this.normalizePoint(stroke.points[j + 1]);

            this.context.top.moveTo(start.x, start.y);
            this.context.top.lineTo(end.x, end.y);
            this.context.left.moveTo(start.x, start.y);
            this.context.left.lineTo(end.x, end.y);
            this.context.bot.moveTo(start.x, start.y);
            this.context.bot.lineTo(end.x, end.y);
            this.context.right.moveTo(start.x, start.y);
            this.context.right.lineTo(end.x, end.y);
        }
        this.context.top.closePath();
        this.context.left.closePath();
        this.context.bot.closePath();
        this.context.right.closePath();


        this.context.top.strokeStyle = stroke.color;
        this.context.top.lineWidth = this.normalizeLineSize(stroke.size);
        this.context.top.lineJoin = stroke.join;
        this.context.top.lineCap = stroke.cap;
        this.context.top.miterLimit = stroke.miterLimit;

        this.context.bot.strokeStyle = stroke.color;
        this.context.bot.lineWidth = this.normalizeLineSize(stroke.size);
        this.context.bot.lineJoin = stroke.join;
        this.context.bot.lineCap = stroke.cap;
        this.context.bot.miterLimit = stroke.miterLimit;

        this.context.left.strokeStyle = stroke.color;
        this.context.left.lineWidth = this.normalizeLineSize(stroke.size);
        this.context.left.lineJoin = stroke.join;
        this.context.left.lineCap = stroke.cap;
        this.context.left.miterLimit = stroke.miterLimit;

        this.context.right.strokeStyle = stroke.color;
        this.context.right.lineWidth = this.normalizeLineSize(stroke.size);
        this.context.right.lineJoin = stroke.join;
        this.context.right.lineCap = stroke.cap;
        this.context.right.miterLimit = stroke.miterLimit;


        this.context.top.stroke();
        this.context.left.stroke();
        this.context.bot.stroke();
        this.context.right.stroke();



    }




}