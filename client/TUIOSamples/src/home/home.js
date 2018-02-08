/**
 * @author: Adrian PALUMBO  
 */

import SocketManager from '../../socket.manager';
import User from '../user/user';

// import launchBalls from '../games/balls';
import Board from '../board/board';

import StartButton from './start.button';
import Pictionary from '../games/pictionary/pictionary';

const config = require('../../config');

export default class Home {

    static get currentFolder() {
        return '/src/home';
    }

    static get minimumRequiredUsers() {
        return 2;
    }

    constructor(_gameId, _copy) {
        console.log('----');
        console.log('Home constructor');
        console.log('GameId: '+ _gameId);
        console.log('----');

        this.app = $('#app');
        this.totalWin = 0;
        this.gameId = null;

        this.userView = null;

        if (_gameId !== undefined && _gameId !== null) {
            this.gameId = _gameId;

            if (_copy) { // NEW game from previous config
                this.initGameWithPlayersFromPreviousGame();
            } else { // Just display the board
                this.getUsersFromServerBeforeDisplayingBoard();
            }
        } else {
            this.createNewGame();
        }
    }
    
    getUsersFromServerBeforeDisplayingBoard() {
        const that = this;

        $.get(config.server + '/api/user/' + this.gameId)
            .done(function (d) {
                that.users = d;

                that.userView = new User(d, that.gameId);

                that.addBoard();
            })
            .fail(function (e) {
                alert('Error: can\'t get players.');
                console.log(e);
            });

    }

    createNewGame() {
        let that = this;

        $.post(config.server + '/api/game')
            .done(function (d) {
                that.gameId = d.gameId;

                console.log('----');
                console.log('GameId: '+ that.gameId);
                console.log('----');

                SocketManager.get().emit('new game', that.gameId);

                that.initGame();
            })
            .fail(function (e) {
                alert('Error');
                console.log(e);
            });
    }

    initGameWithPlayersFromPreviousGame() {
        const that = this;

        this.app.load(Home.currentFolder + '/home.view.html', function () {
            that.startGameListener(true);

            $.get(config.server + '/api/game/new/' + that.gameId)
                .done(function (d) {
                    that.users = d.users;

                    that.gameId = d.gameId;

                    this.userView = new User(d.users, that.gameId);

                    SocketManager.get().emit('update mobile game new id', {
                        gameId: that.gameId
                    });

                    that.toggleStartButtonAndCallBoard(true);
                })
                .fail(function (e) {
                    alert('Can\'t get the game players.');
                });
        });
    }

    initGame() {
        const that = this;
        this.app.load(Home.currentFolder + '/home.view.html', function () {
            that.addElements();

            that.startGameListener();
        });
    }

    startClicked(widget) {
        if (!this.users || this.users.length < Home.minimumRequiredUsers) {
            alert('You must have at least ' + Home.minimumRequiredUsers + ' players.');
            return;
        }

        if (widget !== null)
            widget.deleteWidget();
        else
            $('#start_tuio').remove();

        this.toggleStartButtonAndCallBoard();
    }

    startGameListener(withoutTuioButton) {
        const that = this;

        $('#start').appendTo('body');

        $('#start').css('display', 'block');

        $('#start').addClass('doNotUse');

        if (!withoutTuioButton) {
            let start = new StartButton($('#start'), this);
            start.addTo($('body').get(0));
        }

        $('#start').on('click', function () {
            that.startClicked(null);
        })
    }

    toggleStartButtonAndCallBoard(cancelAnimateFirstPart) {
        const that = this;
        let $start = $('#start');

        this.allowStartButton();

        if (cancelAnimateFirstPart) {
            $start.find('.greenCircle').css({
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                borderRadius: 0,
                fontSize: '200px',
            });

            $start.css({
                animation: 'inherit',
                transform: 'rotate(0deg)',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                margin: 0,
            });
        } else {
            $start.find('.greenCircle').animate({
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                borderRadius: 0,
                fontSize: '200px',
            }, 1000);

            $start.css({
                'animation': 'inherit',
                'transform': 'rotate(0deg)'
            }).animate({
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                margin: 0,
            }, 1000)
        }

        setTimeout(function () {
            $('#start .greenCircle .fa-paper-plane').animate({
                marginTop: '-150%',
                marginRight: '-150%'
            }, 2000);

            $('#start').delay(700).fadeOut(1000);

            that.addBoard();
        }, 1000);

        setTimeout(function () {
            $('#start').remove();
        }, 2000);
    }

    addBoard() {
        console.log('HOME: ADD BOARD');
        User.removeUnusedUsers();

        new Board(this.users, this.gameId);
    }

    addElements() {
        let qrCodes = [{
                pos: 'bottom',
                qrCode: true
            },
            {
                pos: 'left',
                qrCode: true
            },
            {
                pos: 'top',
                qrCode: true
            },
            {
                pos: 'right',
                qrCode: true
            },
        ];

        this.userView = new User(qrCodes, this.gameId);

        this.addSocketListener();
    }

    addSocketListener() {
        let that = this;

        SocketManager.get().on('refresh game', function (d) {
            that.users = d.game;

            if (that.users.length >= Home.minimumRequiredUsers)
                that.allowStartButton();

            that.userView.updateElements(d.game);
        });
    }

    allowStartButton() {
        $('#start').removeClass('doNotUse');
    }
}