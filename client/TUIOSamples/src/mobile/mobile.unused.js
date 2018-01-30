/**
 * @author: Adrian PALUMBO  
 */
import MobileHandler from './mobile.handler';
import MobileLogin from './login/mobile.login';
import getUrlParameter from '../../tools';
import SocketManager from '../../socket.manager';

const config = require('../../config');

export default class MobileUnused {

    constructor(gameId, pos, user) {
        this.user = user;
        this.gameId = gameId;
        this.pos = pos;

        console.log(this.user);

        if (this.user !== undefined && this.user !== null) {
            this.updateView();
        } else {
            this.updateViewAndRetrieveUser();
        }
    }

    updateViewAndRetrieveUser() {
        $.get(config.server + '/api/user/' + this.gameId + '/' + this.pos)
            .done(function (d) {
                // The user exists for the current pos and game
                return that.loadUnusedView()
            })
            .fail(function (e) {
                // New user for game and pos
                that.createNewLoginView();
            });
    }

    updateView() {
        const that = this;

        $('#app').html(`
            <div class="page-header">
                <h1 class="center">Hello, <b>` + that.user.name + `</b>!</h1>
            </div>

            <div class="row">
                <div class="col-xs-12 center">
                    Your phone is currently <b>not used</b> by the game.<br>
                    But don't worry, some games will use it soon! :-)
                </div>
            </div>
        `);
    }
}