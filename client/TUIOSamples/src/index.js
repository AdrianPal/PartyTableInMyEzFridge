/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';

// Import TUIOManager
import TUIOManager from 'tuiomanager/core/TUIOManager';

// import buildMenu from './menu';

import Home from './home/home';

import getUrlParameter from '../tools';

import MobileLogin from './mobile/login/mobile.login';

const SocketMobile = require('./mobile/socket.mobile');

/** TUIOManager starter **/
const tuioManager = new TUIOManager();
tuioManager.start();

/** App Code **/

$(window).ready(() => {
  if (getUrlParameter('view') === 'mobile' &&
    getUrlParameter('gameId') != undefined && getUrlParameter('gameId') != null &&
    getUrlParameter('pos') != undefined && getUrlParameter('pos') != null) {

    let gameId = getUrlParameter('gameId'),
      pos = getUrlParameter('pos');

    new MobileLogin(gameId, pos);

    SocketMobile(io, gameId, pos);
  } else {
    let copyGameId = getUrlParameter('players');
    new Home(copyGameId, true);
  }
});