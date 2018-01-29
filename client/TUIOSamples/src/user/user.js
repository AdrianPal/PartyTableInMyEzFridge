/**
 * @author: Adrian PALUMBO  
 */

import SocketManager from '../../socket.manager';

const config = require('../../config');

export default class User {

    static get currentFolder() {
        return '/src/user';
    }

    constructor(elements, gameId) {
        this.container = null;
        this.body = $('body');

        this.elements = elements;
        this.gameId = gameId;

        this.createView();
    }

    updateElements(newElements) {
        this.elements = newElements;

        this.constructElements();
    }

    createView() {
        const that = this;

        $.ajax({
            type: "GET",
            url: User.currentFolder + '/user.view.html',
            success: function (text) {
                that.body.prepend(text);

                that.constructElements();

                that.userView = $('#usersView');
            }
        });
    }

    constructElements() {
        const that = this;

        $.each(that.elements, function (index, value) {
            let pos = value.pos;

            if (value.qrCode)
                that.buildQRCode(pos);
            else
                that.buildUser(value);
        });
    }

    buildQRCode(pos) {
        let link = 'http://' + config.ip + ':' + config.port + '/?view=mobile&pos=' + pos + '&gameId=' + this.gameId;

        $('#' + pos + 'User').find('.avatar').append('<a href="' + link + '" target="_blank"><div class="qrcodeUser" id="qrcode_' + pos + '"></div></a>');
        new QRCode('qrcode_' + pos, link);
    }

    buildUser(user) {
        let that = this;

        console.log(user);

        user.forEach(function (e) {
            $('#' + e.pos + 'User .name').html('<b>' + e.name + '</b>');
            $('#' + e.pos + 'User .name').css('background-color', that.getAvatarNameBackground(e.color));
            $('#' + e.pos + 'User .name').show();

            let linkImage = config.server + '/' + e.avatarPath;

            $('#' + e.pos + 'User .avatar').css({
                'backgroundImage': 'url(' + config.server + '/' + e.avatarPath + ')',
                'borderColor': e.color
            });

            $('#qrcode_' + e.pos).hide();
        });
    }

    getAvatarNameBackground(hex) {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.6)';
        }
        throw new Error('Bad Hex');
    }

    removeView() {
        this.userView.remove();
    }
}