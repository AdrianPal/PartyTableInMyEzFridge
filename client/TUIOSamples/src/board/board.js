/**
 * @author: Adrian PALUMBO  
 */

import User from '../user/user';
import Dice from './dice';
import PlayButton from './play.button';

// Games
import launchLabyrinth from '../games/labyrinth';
import launchBalls from '../games/balls';
import {
    Twister
} from '../games/twister/twister';
import launchPictionary from '../games/pictionary';

const config = require('../../config');

export default class Board {

    static get currentFolder() {
        return '/src/board';
    }

    static get numberOfTiles() {
        return 10;
    }

    constructor(_users, gameId) {
        this.app = $('#app');

        this.gameId = gameId;

        this.users = _users;

        this.currentPlayer = null;

        this.dice = null;

        this.createNewGame();
    }

    createNewGame() {
        const that = this;

        this.app.load(Board.currentFolder + '/board.view.html', function () {
            that.addTiles();

            setTimeout(function () {
                that.addPlayers();
            }, 500);
        });
    }

    addTiles() {
        for (let i = 0; i < Board.numberOfTiles; i++) {
            $('#board').append('<div class="boardTile"></div>');

            //Switching colors to distinguish the deifferent tiles
            if (i % 2 != 0)
                $('.boardTile').last().css('background-color', '#F44336');
            else
                $('.boardTile').last().css('background-color', '#F48FB1');
        }

        //Adding the arrival tile
        $('#board').append('<div class="boardTile" id="lastTile"></div>');
    }

    addPlayers() {
        //Adding the players to the board
        for (let index = 0; index < this.users.length; index++) {
            $('#boardContainer').append('<img width="50" class="playerBoardAvatar" id="player_' + this.users[index].pos + '" src="' + config.server + '/' + this.users[index].avatarPath + '">')
        }

        // Setting dimensions of the players
        $('.playerBoardAvatar')
            .height($('#board div').height() / 5)
            .width($('#board div').height() / 5)
            .css('margin-left', '1%');

        let startX = $('#board').offset().left;
        let startY = $('#board').offset().top + 10;

        let tileW = $('.boardTile:first').width();

        //Positioning the players 
        for (let i = 0; i < this.users.length; i++) {
            let tmp_startX = startX + this.users[i].position * tileW;

            let pos = this.users[i].pos;

            $('#player_' + pos).css('left', tmp_startX);
            $('#player_' + pos).css('top', startY);

            startY += ($('#player_' + pos).height() + 3);
        }

        this.selectPlayer();
    }

    selectPlayer() {
        this.currentPlayer = null;
        let prevLap = -1;

        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].lap < prevLap) {
                this.currentPlayer = this.users[i];
                break;
            }

            prevLap = this.users[i].lap;
        }

        // If everyone played
        if (this.currentPlayer === null)
            this.currentPlayer = this.users[0]; // The first player plays again

        User.updateCurrentPlayer(this.currentPlayer.pos);

        this.diceForCurrentPlayer();
    }

    diceForCurrentPlayer() {
        const $u = $('#' + this.currentPlayer.pos + 'User');
        const offset = $u.offset();

        let x, y, width = 100,
            height = 100;

        switch (this.currentPlayer.pos) {
            case 'bottom':
                x = offset.left + 35;
                y = offset.top - height * 1.5;
                break;

            case 'left':
                x = $u.width() + offset.left + width / 2;
                y = offset.top + 35;
                break;

            case 'top':
                x = offset.left + 35;
                y = offset.top + $u.height() + height / 2;
                break;

            case 'right':
                x = offset.left - width * 1.5;
                y = offset.top + 35;
                break;
        }

        this.dice = new Dice(this, x, y, width, height);
        this.dice.addTo($('#app').get(0));
    }

    currentPlayerWon() {
        const that = this;

        that.dice.deleteWidget();

        $.ajax({
            type: "GET",
            url: Board.currentFolder + '/curtain.view.html',
            success: function (text) {
                $('body').prepend(text).find('#curtainView').hide().fadeIn(350);
                $('#' + that.currentPlayer.pos + 'User').addClass('playerWon').appendTo("#winnerIs");

                setTimeout(function () {
                    $('#winnerIs').css('visibility', 'visible');

                    let $newGameBtn = $('#playAgain');
                    let $newGamePlayersBtn = $('#playAgainSamePlayers');

                    console.log($newGameBtn.width());

                    let newGame = new PlayButton(
                        $newGameBtn.offset().left,
                        $newGameBtn.offset().top,
                        $newGameBtn.outerWidth(),
                        $newGameBtn.outerHeight(),
                        "new",
                        that);
                    newGame.addTo($('body').get(0));

                    let newGamePlayers = new PlayButton(
                        $newGamePlayersBtn.offset().left,
                        $newGamePlayersBtn.offset().top,
                        $newGamePlayersBtn.outerWidth(),
                        $newGamePlayersBtn.outerHeight(),
                        "newWithPlayers",
                        that);
                    newGamePlayers.addTo($('body').get(0));

                    $('#checkBoxCurtain').prop('checked', false);
                }, 4000);
            }
        });
    }

    updatePlayerPosWithDiceVal(diceVal) {
        const that = this;

        const updatedPosition = this.currentPlayer.position + diceVal;

        if (updatedPosition >= Board.numberOfTiles) { // Won!
            return this.currentPlayerWon();
        }

        $.ajax({
                url: config.server + '/api/user',
                type: 'PUT',
                data: {
                    userId: this.currentPlayer._id,
                    position: updatedPosition,
                    lap: this.currentPlayer.lap + 1,
                }
            })
            .done(function (d) {
                let movement = $('.boardTile:first').width() * diceVal;

                $('#player_' + that.currentPlayer.pos).transition({
                    x: movement,
                    delay: 500
                }, 1000);

                setTimeout(function () {
                    that.dice.deleteWidget();

                    that.launchRandomGame();
                }, 2000);
            })
            .fail(function (e) {
                console.error('ERROR when updating position and lap');
                console.error(e);
            });
    }

    launchRandomGame() {
        let numberOfGames = 4;

        let gameName = null;

        let rand = Math.floor(Math.random() * numberOfGames) + 1;

        console.log('Rand: '+ rand);

        this.letsPlayView("Twister");
                new Twister(this.gameId);

        // switch (rand) {
        //     case 1:
        //         this.letsPlayView("Pictionary");
        //         launchPictionary(this.gameId);
        //         break;

        //     case 2:
        //         this.letsPlayView("Labyrinth");
        //         launchLabyrinth(this.gameId);
        //         break;

        //     case 3:
        //         this.letsPlayView("Balls");
        //         launchBalls(this.gameId);
        //         break;

        //     default:
        //         this.letsPlayView("Twister");
        //         new Twister(this.gameId);
        //         break;
        // }
    }

    letsPlayView(name) {
        $.ajax({
            type: "GET",
            url: Board.currentFolder + '/play.view.html',
            success: function (text) {
                $('body').prepend(text).find('#playingView').hide().fadeIn(350);

                $('#gameName').hide().html(name + '!');

                // Display name
                setTimeout(function () {
                    $('#gameName').slideDown(1000);
                }, 750);

                // Hide view
                setTimeout(function () {
                    $('#playingView').remove();
                }, 4000);
            }
        });
    }

    newGameClicked(type) {
        let url = 'http://' + config.ip + ':' + config.port;

        switch (type) {
            case "new":
                location.href = url;
                break;

            case "newWithPlayers":
                location.href = url + '/?players=' + this.gameId;
                break;
        }
    }
}