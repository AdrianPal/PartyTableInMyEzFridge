import User from '../../user/user'
import SocketManager from '../../../socket.manager';


export default class Pictionary {
    
    static get getCurrentDirectory(){
        return 'src/games/pictionary/';
    }

    constructor(gameId) {
        this.app = $('#app');


        this.initGame();        
    }

    initGame() {
        const that = this;
        this.app.load(Pictionary.getCurrentDirectory + 'pictionary.view.html', function(){
            that.initCanvas();
            SocketManager.get().emit('mobile enter pictionary game');
        });
    }

    initCanvas(){
        var canvas = document.getElementById('pictionaryCanvas');
        canvas.width = document.body.clientWidth * 0.75;
        canvas.height = document.body.clientHeight * 0.50;
        this.context = canvas.getContext('2d');
    }

}