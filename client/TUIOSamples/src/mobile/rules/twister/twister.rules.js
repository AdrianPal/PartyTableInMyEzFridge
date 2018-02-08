/**
 * @author: Adrian PALUMBO  
 */
import MobileHandler from '../../mobile.handler';

const config = require('../../../../config');

export default class TwisterRules extends MobileHandler {

    static get currentFolder() {
        return '/src/mobile/rules/twister';
    }

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

        this.updateTitle('Twister\'s rules');

        $.ajax({
            type: "GET",
            url: TwisterRules.currentFolder + '/twister.rules.view.html',
            success: function (text) {
                that.updateContent(text);
            }
        });
    }
}