import User from '../../user/user'
import Home from '../../home/home'
import SocketManager from '../../../socket.manager';
import Anywhere from '../../tools/anywhere';

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

        this.pointsEast = new Array();
        this.pointsNorth = new Array();
        this.pointsDrag = new Array();
        this.isPainting = false;
        this.context = null;
    }

    initGame() {
        const that = this;
        this.app.load(Pictionary.getCurrentDirectory + 'pictionary.view.html', function () {
            SocketManager.get().emit('mobile enter pictionary game');
            that.initCountdown();
        });
    }

    initCanvas() {
        var canvas = document.getElementById('pictionaryCanvas');
        canvas.width = document.body.clientWidth * 0.75;
        canvas.height = document.body.clientHeight * 0.50;
        this.context = canvas.getContext('2d');

        this.width = canvas.width;
        this.height = canvas.height;
    }

    initDrawingSocketBinding() {
        SocketManager.get().on('isDrawing', (east, north, drag, distantColor, size) => {
            this.refreshCanvasOnSocket(east, north, drag, distantColor, size);
        });
    }
    initCountdown() {
        var countdown = $('#countdown');
        countdown.html(Pictionary.countDownTime);
        const that = this;
        that.initDrawingSocketBinding();
        SocketManager.get().on('decreaseCountdown', function (value, gameId) {
            if (that.context == null) {
                that.initCanvas();
            }
            $('#pictionaryCanvas').show();
            $('#instructions').hide();

            if (value == 'EXPIRED') {
                $('#pictionaryContainer').hide();
                $('#lostWrapper').show().css('display', 'flex');
                User.remove();
                let anywhere = new Anywhere(that, that.goHome);
                anywhere.addTo($('body').get(0));
            } else {
                countdown.html(value);
            }
        });

        SocketManager.get().on('pictionaryEnd', function (posDrawer, winner, gameId)  {
            $.get(config.server + '/api/user/' + gameId + '/' + posDrawer)
                .done(function (user) {
                    console.log(user);
                    $('#pictionaryContainer').hide();
                    $('#winnerWrapper').show().css('display', 'flex');
                    $('#winnerName').html(winner.name);
                    $('#drawerName').html(user.name);
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


    addPoint(east, north, drag) {
        this.pointsEast.push(east);
        this.pointsNorth.push(north);
        this.pointsDrag.push(drag);
    }

    refreshCanvasOnSocket(east, north, drag, distantColor, size) {
        this.context.strokeStyle = distantColor;
        this.context.lineJoin = 'round';
        this.context.lineWidth = size;

        for (var i = 0; i < east.length; i++) {
            this.context.beginPath();
            if (drag[i] && i) {
                this.context.moveTo(east[i - 1] * this.width, north[i - 1] * this.height);
            } else {
                this.context.moveTo((east[i] * this.width) - 1, north[i] * this.height);
            }
            this.context.lineTo(east[i] * this.width, north[i] * this.height);
            this.context.closePath();
            this.context.stroke();
        }
    }




}