import SocketManager from "../../socket.manager";
import PictureMobile from '../games/pictionary/mobile/pictionary.mobile'
import PictionaryMobile from "../games/pictionary/mobile/pictionary.mobile";
import MobileUnused from "./mobile.unused";
import TwisterRules from "./rules/twister/twister.rules";
import launchLabyrinth from "../games/labyrinth";
import EndView from "../mobile/end/endview.mobile";

const config = require('../../config');

let prefix = 'mobile';

function mobileEnterGame(gameId, pos) {
    SocketManager.get().emit(prefix + ' enter game', {
        gameId: gameId,
        pos: pos
    });
}

exports = module.exports = function (io, gameId, pos) {

    mobileEnterGame(gameId, pos);

    SocketManager.get().on(prefix + ' update new game id', (data) => {
        let url = 'http://' + config.ip + ':' + config.port;
        location.href = url + '/?view=mobile&pos=' + pos + '&gameId=' + data.gameId;
    });

    SocketManager.get().on(prefix + ' unuse', (result) => {
        new MobileUnused(gameId, pos);
    });

    SocketManager.get().on(prefix + ' test', (result) => {
        alert('MOBILE');
    });

    SocketManager.get().on(prefix + ' game pictionary', (isChoosenMobile, word) => {
        new PictionaryMobile(gameId, pos, isChoosenMobile, word);
    })

    SocketManager.get().on(prefix + ' game twister rules', (data) => {
        new TwisterRules(gameId, pos);
    })

    SocketManager.get().on(prefix + ' launch labyrinth', (data) => {
        launchLabyrinth(gameId);
    })

    SocketManager.get().on(prefix + ' game ended', (data) => {
        new EndView(gameId, pos);
    });


};