/**
 * @author: Adrian PALUMBO  
 */
import MobileHandler from '../mobile.handler';

const config = require('../../../config');

export default class EndView extends MobileHandler {

    static get currentFolder() {
        return '/src/mobile/end';
    }

    constructor(gameId, pos, user) {
        super(gameId, pos);

        this.users = null;

        this.currentUser = null;

        this.updateViewAndRetrieveAllUsers();
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    updateViewAndRetrieveAllUsers() {
        const that = this;

        $.get(config.server + '/api/user/' + this.gameId)
            .done(function (d) {
                that.users = d;

                for (let i = 0; i < that.users.length; i++) {
                    if (that.pos === that.users[i].pos) {
                        that.currentUser = that.users[i];
                    }
                }

                that.users.sort(function (a, b) {
                    return b.points - a.points;
                });

                // The user exists for the current pos and game
                return that.updateView();
            });
    }

    updateView() {
        const that = this;

        let t = '';

        if (this.currentUser === this.users[0]) {
            t = 'You win!';
        } else {
            t = 'You loose';
        }

        this.updateTitle(`
            Game ended
        
            <div class="smallTitle small" style="color: ` + that.currentUser.color + `">
                ` + t + `
            </div>
        `);

        $.ajax({
            type: "GET",
            url: EndView.currentFolder + '/endview.view.html',
            success: function (text) {
                that.updateContent(text);

                setTimeout(function () {
                    for (let i = 0; i < that.users.length; i++) {
                        $('#endViewContainer').append(`
                            <div class="one">
                                <img style="border-color: ` + that.users[i].color + `" src="` + config.server + '/' + that.users[i].avatarPath + `" />
                                <div class="rightPanel">
                                    <b>` + that.users[i].name + `</b>
                                    ` + that.users[i].points + ` points
                                </div>
                            </div>`);
                    }
                }, 500);
            }
        });
    }
}