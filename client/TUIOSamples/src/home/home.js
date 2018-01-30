/**
 * @author: Adrian PALUMBO  
 */

import Pastille from '../games/twister/pastille';
import SocketManager from '../../socket.manager';
import User from '../user/user';

// import launchBalls from '../games/balls';
import {
    Twister
} from '../games/twister/twister';
import launchLabyrinth from '../games/labyrinth';
import launchPictionary from '../games/pictionary';

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

            that.addGameListener();
        });
    }

    addGameListener() {
        let that = this;

        $('#pic').on('click', function () {
            launchPictionary(that.gameId);
        });
        $('#lab').on('click', function () {
            launchLabyrinth(that.gameId);
        });
        // $('#bal').on('cliqck', function() { launchBalls(that.gameId); });
        $('#twi').on('click', function () {
            new Twister(that.gameId);
        });
    }

    addElements() {
        let qrCodes = [{
                pos: 'bottom',
                qrCode: true
            },
            {
                pos: 'left',
                qrCode: true
            },
            {
                pos: 'top',
                qrCode: true
            },
            {
                pos: 'right',
                qrCode: true
            },
        ];

        this.userView = new User(qrCodes, this.gameId);

        this.addSocketListener();
    }

    addSocketListener() {
        let that = this;

        SocketManager.get().on('refresh game', function (d) {
            that.userView.updateElements(d.game);
        });
    }
}