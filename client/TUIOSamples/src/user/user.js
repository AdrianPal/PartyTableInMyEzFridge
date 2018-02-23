/**
 * @author: Adrian PALUMBO  
 */

import SocketManager from '../../socket.manager';
import QrcodeHelper from './qrcode.helper';

const config = require('../../config');

export default class User {

    static get currentFolder() {
        return '/src/user';
    }

    static get userTag() {
        return '#usersView';
    }

    constructor(elements, gameId) {
        this.container = null;
        this.body = $('body');

        console.log('---user:');
        console.log(elements);
        console.log('---');

        this.elements = elements;
        this.gameId = gameId;

        this.userView = $(User.userTag);

        this.createView();
    }

    updateElements(newElements) {
        this.elements = newElements;

        this.constructElements();
    }

    createView() {
        const that = this;

        if (this.userView.length !== 0) {
            that.constructElements();
            return;
        }

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

        console.log('---');
        console.log('creating users');
        console.log('---');

        $.each(that.elements, function (index, value) {
            let pos = value.pos;

            if (value.qrCode)
                that.buildQRCode(pos);
            else
                that.buildUser(value);
        });
    }

    buildQRCode(pos) {
        if ($('#qrcode_' + pos).length !== 0) {
            $('#qrcode_' + pos).show();
            return;
        }

        let link = 'http://' + config.ip + ':' + config.port + '/?view=mobile&pos=' + pos + '&gameId=' + this.gameId;

        $('#' + pos + 'User').find('.avatar').append('<a class="qrCodeLink" id="qrcode_' + pos + '" href="' + link + '" target="_blank" ><div id="qrcode_' + pos + '_tag" class="qrcodeUser"></div></a>');
        new QRCode('qrcode_' + pos + '_tag', link);
    }

    buildUser(e) {
        console.log('--- build user:');
        console.log(e);
        console.log('---');
        $('#' + e.pos + 'User').addClass('userAdded');
        $('#' + e.pos + 'User .name').html('<b>' + e.name + '</b>').css('display', 'block');
        $('#' + e.pos + 'User .name').css('background-color', this.getAvatarNameBackground(e.color));
        $('#' + e.pos + 'User .name').show();

        let linkImage = config.server + '/' + e.avatarPath;

        $('#' + e.pos + 'User .avatar').css({
            'backgroundImage': 'url(' + config.server + '/' + e.avatarPath + ')',
            'borderColor': e.color
        });

        $('#qrcode_' + e.pos).hide();

        const that = this;

        setTimeout(function () {
            that.addQrCodeLink(e);
            that.addTangibleDisplay(e);
            that.addScoreCounter(e);
        }, 500);
    }

    toggleQRcodeForMobile(pos, forceHide = false) {
        const $q = $('#qrcode_' + pos);

        if (forceHide || $q.is(':visible'))
            $q.hide();
        else
            this.buildQRCode(pos);
    }

    addQrCodeLink(user) {
        if ($('#qrCodeHelper_' + user.pos).length !== 0) { // Already exists
            if ($('#qrCodeHelper_' + user.pos).hasClass('active')) {
                $('#qrcode_' + user.pos).show();
            }

            return;
        }

        let $u = $('#' + user.pos + 'User');

        let top;
        let left;
        let classForQR = '';

        const padding = 100;

        switch (user.pos) {
            case 'top':
                top = $u.offset().top + ($u.width() - 70) / 2;
                left = $u.offset().left + $u.width() + padding / 3;
                classForQR += 'upsideDown';
                break;

            case 'left':
                top = $u.offset().top - padding;
                left = $u.offset().left + ($u.width() - 70) / 2;;
                classForQR += 'turn-left';
                break;

            case 'right':
                top = $u.offset().top + $u.width() + padding / 3;
                left = $u.offset().left + ($u.width() - 70) / 2;;
                classForQR += 'turn-right';
                break;

            default:
                top = $u.offset().top + ($u.width() - 70) / 2;
                left = $u.offset().left - padding;
                break;
        }

        let qrhelper = new QrcodeHelper(this, left, top, classForQR, user.pos, user.color);
        qrhelper.addTo($('#usersView').get(0));
    }

    addTangibleDisplay(user) {
        if ($('#tangibleDisplay_' + user.pos).length !== 0) // Already exists
            return;

        let $u = $('#' + user.pos + 'User');

        let top;
        let left;
        let classForQR = '';

        const padding = 100;

        switch (user.pos) {
            case 'top':
                top = $u.offset().top + ($u.width() - 70) / 2;
                left = $u.offset().left - 70 - padding / 3;
                classForQR += 'upsideDown';
                break;

            case 'left':
                top = $u.offset().top + $u.width() + padding / 3;
                left = $u.offset().left + ($u.width() - 70) / 2;;
                classForQR += 'turn-left';
                break;

            case 'right':
                top = $u.offset().top - padding;
                left = $u.offset().left + ($u.width() - 70) / 2;;
                classForQR += 'turn-right';
                break;

            default:
                top = $u.offset().top + ($u.width() - 70) / 2;
                left = $u.offset().left + $u.width() + padding / 3;
                break;
        }

        $('#usersView').append(`
            <div class="tangibleDisplay ` + classForQR + `" id="tangibleDisplay_` + user.pos + `" style="border-color: ` + user.color + `; color: ` + user.color + `; top: ` + top + `px; left: ` + left + `px;">` + user.tangible + `</div>
        `);
    }

    addScoreCounter(user) {
        let id = 'scorePointsDisplay_' + user.pos;

        if ($('#' + id).length !== 0) // Already exists
            return;

        let $u = $('#' + user.pos + 'User');

        let top;
        let left;
        let classForQR = '';

        const padding = 100;

        switch (user.pos) {
            case 'top':
                top = $u.offset().top + ($u.width() - 70) / 2 - 30;
                left = $u.offset().left - 70 - padding / 3 - 80;
                classForQR += 'upsideDown';
                break;

            case 'left':
                top = $u.offset().top + $u.width() + padding / 2 + 45;
                left = $u.offset().left + ($u.width() - 70) / 2 - 95;
                classForQR += 'turn-left';
                break;

            case 'right':
                top = $u.offset().top - padding + 5 - 25;
                left = $u.offset().left + ($u.width() - 70) / 2 + 15;
                classForQR += 'turn-right';
                break;

            default:
                top = $u.offset().top + ($u.width() - 70) + 25;
                left = $u.offset().left + $u.width() + padding / 3;
                break;
        }

        $('#usersView').append(`
            <div class="scorePointsDisplay ` + classForQR + `" id="` + id + `" style="border-color: ` + user.color + `; color: ` + user.color + `; top: ` + top + `px; left: ` + left + `px;">` + user.points + ` points</div>
        `);
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

        console.log('bad hexa');
    }

    removeView() {
        User.remove();
    }

    static remove() {
        console.log('--- USER remove ---');
        $(User.userTag).remove();
    }

    static removeUnusedUsers() {
        $('.user:not(.userAdded)').remove();
    }

    static removeCurrentPlayer() {
        $('.currentPlayer').removeClass('currentPlayer');
    }

    static updateCurrentPlayer(pos) {
        $('.currentPlayer').removeClass('currentPlayer');
        $('#' + pos + 'User').addClass('currentPlayer');
    }
}