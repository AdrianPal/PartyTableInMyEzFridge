/**
 * @author: Adrian PALUMBO  
 */

// import Login from './login/login'
// alert('l');
// import Unused from './unused';

import getUrlParameter from '../../tools';

import SocketManager from '../../socket.manager';

const config = require('../../config');

export default class MobileHandler {

    constructor(gameId, pos) {
        this.mainTag = '#app';

        this.app = $(this.mainTag);

        this.gameId = gameId;
        this.pos = pos;

        $('body').css('fontSize', '17px');
    }

    getUserForCurrentGameAndPos() {
        return $.get(config.server + '/api/user/' + this.gameId + '/' + this.pos);
    }
}