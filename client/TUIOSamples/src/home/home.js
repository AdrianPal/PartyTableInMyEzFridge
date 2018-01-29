/**
 * @author: Adrian PALUMBO  
 */

import Pastille from '../games/twister/pastille';
import SocketManager from '../../socket.manager';
import User from '../user/user';

const config = require('../../config');

export default class Home {

    static get currentFolder() {
        return '/src/home';
    }

    constructor() {
        this.app = $('#app');
        this.totalWin = 0;

        this.gameId = null;

        this.userView = null;

        this.createNewGame();
    }

    createNewGame() {
        let that = this;

        $.post(config.server + '/api/game')
            .done(function (d) {
                that.gameId = d.gameId;

                SocketManager.get().emit('new game', that.gameId);

                that.initGame();
            })
            .fail(function (e) {
                alert('Error');
                console.log(e);
            });
    }

    initGame() {
        const that = this;
        this.app.load(Home.currentFolder + '/home.view.html', function () {
            that.addElements();
        });
    }

    addElements() {
        let qrCodes = [
            { pos: 'bottom', qrCode: true },
            { pos: 'left', qrCode: true },
            { pos: 'top', qrCode: true },
            { pos: 'right', qrCode: true },
        ];
        
        this.userView = new User(qrCodes, this.gameId);

        this.addSocketListener();
    }

    addSocketListener() {
        let that = this;

        SocketManager.get().on('refresh game', function (d) {
            let users = d.game;
            
            if (d.game.length === 1)
                users = [d.game];

            that.userView.updateElements(users);
        });
    }
}