/**
 * @author: Adrian PALUMBO  
 */

const config = require('../../config');

export class Game {

    constructor(_gameId) {
        this.gameId = _gameId;
    }

    getPlayers() {
        return $.get(config.server + '/api/user/' + this.gameId);
    }
}