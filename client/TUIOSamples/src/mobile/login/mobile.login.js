/**
 * @author: Adrian PALUMBO  
 */
import MobileHandler from '../mobile.handler';
import MobileUnused from '../mobile.unused';
import getUrlParameter from '../../../tools';
import SocketManager from '../../../socket.manager';

const config = require('../../../config');

export default class MobileLogin extends MobileHandler {

    static get currentFolder() {
        return '/src/mobile/login';
    }

    constructor(gameId, pos) {
        super(gameId, pos);

        this.checkIfCurrentPosExistsOrNot();
    }

    checkIfCurrentPosExistsOrNot() {
        const that = this;

        this.getUserForCurrentGameAndPos()
            .done(function (d) {
                // The user exists for the current pos and game
                return that.loadUnusedView(d)
            })
            .fail(function (e) {
                // New user for game and pos
                that.createNewLoginView();
            });
    }

    loadUnusedView(user) {
        return new MobileUnused(this.gameId, this.pos, user);
    }

    createNewLoginView() {
        const that = this;

        this.app.load(MobileLogin.currentFolder + '/user.view.html', function () {
            that.createLogin();
        });
    }

    createLogin() {
        const that = this;

        $('#gameId').val(that.gameId);
        
        $('#newUser').on('click', function (e) {
            e.preventDefault();

            $.ajax({
                    // Your server script to process the upload
                    url: config.server + '/api/game/user/' + that.pos,
                    type: 'POST',

                    // Form data
                    data: new FormData($('#loginUserForm').get(0)),

                    // Tell jQuery not to process data or worry about content-type
                    // You *must* include these options!
                    cache: false,
                    contentType: false,
                    processData: false,

                    // Custom XMLHttpRequest
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();
                        console.log('upload');
                        return myXhr;
                    },
                })
                .done(function (d) {
                    SocketManager.get().emit('mobile trigger', {
                        pos: 'bottom'
                    });

                    return that.loadUnusedView(d);
                })
                .fail(function (e) {
                    alert('Error: ' + e.responseText);
                    console.log(e);
                });;

            // $.post(config.server + '/api/game/user', {
            //         name: $('#name').val(),
            //         pos: that.pos,
            //         gameId: that.gameId
            //     })
            //     .done(function (d) {
            //         SocketManager.get().emit('mobile trigger', {
            //             pos: 'bottom'
            //         });

            //         return that.loadUnusedView(d);
            //     })
            //     .fail(function (e) {
            //         alert('Error.');
            //         console.log(e);
            //     });
        });
    }
}