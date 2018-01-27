/**
 * @author: Adrian PALUMBO  
 */

import Pastille from '../games/twister/pastille';
import SocketManager from '../../socket.manager';

const config = require('../../config');

export default class Home {

    static get currentFolder() {
        return '/src/home';
    }

    constructor() {
        this.app = $('#app');
        this.totalWin = 0;
        
        this.gameId = null;

        this.createNewGame();
    }

    createNewGame() {
        let that = this;

        $.post(config.server + '/api/game')
            .done(function (d) {
                that.gameId = d.gameId;

                SocketManager.get().emit('new game', that.gameId);

                that.initGame();
            })
            .fail(function (e) {
                alert('Error');
                console.log(e);
            });
    }

    initGame() {
        const that = this;
        this.app.load(Home.currentFolder + '/home.view.html', function () {
            that.addElements();
        });
    }   

    addElements() {
        const that = this;

        $('.user').each(function () {
            let pos = $(this).data('pos'),
                link = 'http://' + config.ip + ':' + config.port + '/?view=mobile&pos=' + pos + '&gameId=' + that.gameId;
            $(this).find('.avatar').append('<a href="' + link + '" target="_blank"><div class="qrcodeUser" id="qrcode_' + pos + '"></div></a>');
            new QRCode('qrcode_' + $(this).data('pos'), link);
        });

        this.addSocketListener();
    }

    getAvatarNameBackground(hex){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.6)';
        }
        throw new Error('Bad Hex');
    }

    addSocketListener() {
        let that = this;
        
        SocketManager.get().on('refresh game', function (d) {
            console.log(d);

            d.game.forEach(function(e) {
                $('#'+ e.pos + 'User .name').html('<b>'+e.name+'</b>');
                $('#'+ e.pos + 'User .name').css('background-color', that.getAvatarNameBackground(e.color));
                $('#'+ e.pos + 'User .name').show();
                
                $('#'+ e.pos + 'User .avatar').css({ 'backgroundImage': 'url(' + config.server + '/' + e.avatarPath +')', 'borderColor': e.color });
                
                $('#qrcode_'+e.pos).hide();
            });
        });
    }
}
