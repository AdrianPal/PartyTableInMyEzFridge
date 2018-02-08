/**
 * @author: Adrian PALUMBO  
 */
import MobileHandler from './mobile.handler';
import MobileLogin from './login/mobile.login';
import getUrlParameter from '../../tools';
import SocketManager from '../../socket.manager';

const config = require('../../config');

export default class MobileUnused extends MobileHandler {

    constructor(gameId, pos, user) {
        super(gameId, pos);

        this.user = user;

        if (this.user !== undefined && this.user !== null) {
            this.updateView();
        } else {
            this.updateViewAndRetrieveUser();
        }
    }

    updateViewAndRetrieveUser() {
        const that = this;

        $.get(config.server + '/api/user/' + this.gameId + '/' + this.pos)
            .done(function (d) {
                console.log(d);
                that.user = d;

                // The user exists for the current pos and game
                return that.updateView();
            })
            .fail(function (e) {
                // New user for game and pos
                that.createNewLoginView();
            });
    }

    updateView() {
        const that = this;

        let title = `Hello, <b>` + that.user.name + `</b>!`;

        let content = `Your phone is currently <b>not used</b> by the game.<br>
        But don't worry, some games will use it soon! :-)`;

        console.log(this.pageTitle().length);

        if (this.pageTitle().length !== 0) { // Page title+content are existing
            this.updateTitle(title);

            this.updateContent(content);
        } else { // Need to recreate the title+content
            $('#app').html(`
                <div class="page-header" id="` + MobileHandler.pageTitle + `">
                    <h1 class="center">` + title + `</h1>
                </div>

                <div class="row">
                    <div class="col-xs-12 center" id="` + MobileHandler.pageContent + `">
                        ` + content + `
                    </div>
                </div>
            `);
        }
    }
}