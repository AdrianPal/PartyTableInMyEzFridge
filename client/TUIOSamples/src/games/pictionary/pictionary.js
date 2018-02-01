import User from '../../user/user'
import SocketManager from '../../../socket.manager';


export default class Pictionary {

    

    
    static get getCurrentDirectory(){
        return 'src/games/pictionary/';
    }

    static get countDownTime() {
        return 90;
    }

    constructor(gameId) {
        this.app = $('#app');
        this.initGame();        

        this.pointsEast = new Array();
        this.pointsNorth = new Array();
        this.pointsDrag = new Array();
        this.isPainting = false;

    }

    initGame() {
        const that = this;
        this.app.load(Pictionary.getCurrentDirectory + 'pictionary.view.html', function(){
            SocketManager.get().emit('mobile enter pictionary game');
            that.initCountdown()
        });
    }

    initCanvas(){
        var canvas = document.getElementById('pictionaryCanvas');
        canvas.width = document.body.clientWidth * 0.75;
        canvas.height = document.body.clientHeight * 0.50;
        this.context = canvas.getContext('2d');

        this.width = that.canvas.height
        this.height = that.canvas.height  

    }

    initDrawingSocketBinding(){
        SocketManager.get().on('isDrawing', (east, north, drag, distantColor, size) => {
            refreshCanvasOnSocket(east,north,drag, distantColor, size);
        });
    }
    initCountdown() {
        var countdown = $('#countdown');
        countdown.html(Pictionary.countDownTime);
        const that = this;
        SocketManager.get().on('decreaseCountdown', function(value) {
            that.initDrawingSocketBinding();
            $('#pictionaryCanvas').show();
            $('#instructions').hide();
            countdown.html(value);
        });
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
    
        for(var i = 0; i < east.length; i++) {
            this.context.beginPath();
            if(drag[i] && i){
                this.context.moveTo(east[i-1] * this.width, north[i-1] * this.height);
            }else{
                this.context.moveTo((east[i] * this.width) - 1, north[i] * this.height);
            }
            this.context.lineTo(east[i] * this.width, north[i] * this.height);
            this.context.closePath();
            this.context.stroke();   
        }
    }

    
    

}