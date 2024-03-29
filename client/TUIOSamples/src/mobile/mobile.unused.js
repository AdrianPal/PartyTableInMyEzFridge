/**
 * @author: Adrian PALUMBO  
 */
import MobileHandler from './mobile.handler';
import MobileLogin from './login/mobile.login';
import getUrlParameter from '../../tools';
import SocketManager from '../../socket.manager';

const config = require('../../config');

import TwisterRules from './rules/twister/twister.rules';

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
        // alert('UNUSE VIEW');

        const that = this;

        let title = `
            Hello, <b>` + that.user.name + `</b>!<br>
            
            <div class="smallTitle small" style="color: ` + that.user.color + `">
                <b>` + that.user.points + ` points</b> 
                
                <div class="tangibleContainer">
                    <div class="tangible">` + that.user.tangible + `</div> tangible
                </div>
            </div>
        `;

        let content = `
        <link rel="stylesheet" href="/src/css/mobile/unused.css">

        <div class="alert alert-danger alert-dismissible" style="text-align: justify;" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            Please, <strong><u>DO NOT TURN OFF</u></strong> your phone. We need it to be always on.
            <br>
            You can also disable the automatic turn off feature of your phone in Settings.
        </div>
        
        <div class="alert alert-info" id="mobileQrCodeHelper">
            <div class="qrcodeHelper" style="background: ` + that.user.color + `;"><i class="fa fa-mobile-alt"></i></div>
            However, at any time, if you closed your phone, you can go back to this page by touching on the table the mobile button and scanning the QRcode.
        </div>

        Your phone is currently <b>not used</b> by any game.
        `;

        console.log(this.pageTitle().length);

        if (this.pageTitle().length !== 0) { // Page title+content are existing
            this.updateTitle(title);

            this.updateContent(content);
        } else { // Need to recreate the title+content
            $('#app').html(`
                <div class="page-header" id="` + MobileHandler.pageTitle + `">
                    <h1 class="center">` + title + `</h1>
                </div>

                <div class="col-xs-12 center" id="` + MobileHandler.pageContent + `">
                    ` + content + `
                </div>
            `);
        }
    }
}