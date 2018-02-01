/**
 * @author: Adrian PALUMBO  
 */
import showBoardView from '../../board';
import {
    setTimeout
} from 'timers';
import Pastille from './pastille';
import ImageElementWidget from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/ImageElementWidget'
import User from '../../user/user';
import Home from '../../home/home';
import {
    Game
} from '../game';
import Anywhere from '../../board/anywhere';

export class Twister extends Game {

    static get currentFolder() {
        return '/src/games/twister';
    }
    static get pastillesPerLines() {
        return 8;
    }
    static get colors() {
        return ['red', 'blue', 'yellow', 'green'];
    }
    static randBetween(min, max) {
        return Math.floor((Math.random() * max) + min);
    }

    constructor(_gameId) {
        super(_gameId);

        User.remove();

        this.app = $('#app');
        this.totalWin = 0;

        this.teamOne = [];
        this.teamTwo = [];

        this.currentPlayers = null;

        this.fetchPlayersAndBuildTeam();

        this.newGame();

        this.initGame();
    }

    getCurrentPlayersName() {
        let players = "";

        this.currentPlayers.forEach(function (e) {
            players += e.name + ", ";
        });

        players = players.substring(0, players.length - 1);

        return players;
    }

    setTurn(id) {
        if (id == 1) {
            this.currentPlayers = this.teamOne;
        } else {
            this.currentPlayers = this.teamTwo;
        }

        let players = this.getCurrentPlayersName();

        $('body').append(`
            <div id="turnView">
                <h1>` + players + `</h1>
                <span>this is your turn!</span>
                <span class="clickAnywhere">Click anywhere to start the game.</span>
            </div>`);

        let anywhere = new Anywhere(this);
        anywhere.addTo($('body').get(0));
    }

    dismissTeamMessage(widget) {
        widget.deleteWidget();

        $('#turnView').remove();

        let players = this.getCurrentPlayersName();
        
        $('#currentTeam').html(players);
    }

    fetchPlayersAndBuildTeam() {
        const that = this;

        this.getPlayers()
            .done(function (d) {
                that.users = d;

                if (that.users.length > 2)
                    that.buildTeam();
                else {
                    that.teamOne.push(that.users[0]);
                    that.teamTwo.push(that.users[1]);

                    that.setTurn(1);
                }
            })
            .fail(function (e) {
                alert("Can't get the players -- twister.");
                console.log(e);
            })
    }

    buildTeam() {
        const that = this;

        $.ajax({
            type: "GET",
            url: Twister.currentFolder + '/team.view.html',
            success: function (text) {
                $('body').prepend(text).find('#team').hide().fadeIn(350);

                let team = [];
                let r = -1;

                do {
                    let r = Math.floor(Math.random() * that.users.length);

                    if (!team.includes(r))
                        team.push(r);
                } while (team.length !== 2); // we set 2 players inside the first team

                team.forEach(function (t) {
                    that.teamOne.push(that.users[t]);
                });

                that.users.forEach(function (e) {
                    if (!that.teamOne.includes(e))
                        that.teamTwo.push(e);
                });

                let i = 1;
                that.teamOne.forEach(function (e) {
                    $('#team1 .player' + (i++)).html(e.name);
                });

                i = 1;
                that.teamTwo.forEach(function (e) {
                    $('#team2 .player' + (i++)).html(e.name);
                });

                setTimeout(function () {
                    $('#team').remove();
                    that.setTurn(1);
                }, 8000);
            }
        });
    }

    initGame() {
        const that = this;
        this.app.load(Twister.currentFolder + '/main.view.html', function () {
            that.addGameElements();
        });
    }

    addGameElements() {
        this.getPastilles();

        this.getInstructions();

        this.getTotal();

        this.addListeners();
    }

    newGame() {
        this.pastilles = [];
        this.pastillesTouched = [];
        const colors = Twister.colors;

        for (let i = 0; i < colors.length; i++) {
            this.pastilles[colors[i]] = {
                toDo: Twister.randBetween(0, colors.length + 1),
                done: 0
            };
        }
    }

    getPastilles() {
        const colors = Twister.colors;

        let content = '';

        for (let i = 0; i < colors.length; i++) {
            content += '<div id="rowOf' + colors[i] + 'Color" class="row rowOfPastilles">';

            for (let j = 0; j < Twister.pastillesPerLines; j++) {
                content += '<div class="pastille toRemove ' + colors[i] + '" data-color="' + colors[i] + '"></div>';
            }

            content += '</div>';
        }

        $('#pastilles').html(content);

        const that = this;

        setTimeout(function () {
            $('.pastille.toRemove').each(function () {
                const color = $(this).data('color');
                const l = new Pastille($(this).position().left, $(this).position().top, color, that);
                l.setTagMove(4);
                l.addTo($('#rowOf' + color + 'Color').get(0));
            });

            $('.pastille.toRemove').hide();
            $('#loading').hide();
        }, 750);
    }

    getInstructions() {
        const colors = Twister.colors;

        let content = '<div id="currentTeam"></div><table>';

        for (let i = 0; i < colors.length; i++) {
            const nbre = this.pastilles[colors[i]].toDo;

            content += `
                <tr id="` + colors[i] + `Instructions">
                    <td><div class="pastille ` + colors[i] + `"></div></td>
                    <td>&nbsp;<span class="nbreOfPastilleDone ` + ((nbre === 0) ? 'green' : '') + `">x <span class="nbre">` + nbre + `</span> <span class="check">` + ((nbre === 0) ? '<i class="fa fa-check"></i>' : '') + `</span></span></td>
                </tr>`;
        }

        content += '</table>';

        $('#instructions').html(content);
    }

    getTotal() {
        $('#instructions').append(`<div id="total"><i class="fa fa-trophy"></i> <span class="totalNumber">` + this.totalWin + `</span></div>`);
    }

    updateTotal() {
        ++this.totalWin;

        $('#instructions').append('<div id="win"><i class="fa fa-check"></i></div>');

        let that = this;

        setTimeout(function () {
            that.newGame();

            that.getInstructions();

            that.getTotal();
        }, 800);
    }

    pastilleTouched(tuioTouchId, color) {
        const index = this.pastillesTouched.indexOf(tuioTouchId);

        if (index < 0) {
            this.pastillesTouched.push(tuioTouchId);

            this.pastilles[color].done += 1;

            this.checkForTotal(color);
        }
    }

    pastilleUnTouched(tuioTouchId, color) {
        const index = this.pastillesTouched.indexOf(tuioTouchId);

        if (index >= 0) {
            this.pastillesTouched.splice(index, 1);

            this.pastilles[color].done -= 1;

            this.checkForTotal(color);
        }
    }

    addListeners() {
        let that = this;

        $('#pastilles .pastille')
            .on('mousedown', function () {
                const color = $(this).data('color');

                that.pastilles[color].done += 1;

                that.checkForTotal(color);
            })
            .on('mouseup', function () {
                // const color = $(this).data('color');

                // that.pastilles[color].done -= 1;

                // that.checkForTotal(color);
            });
    }

    checkForTotal(color) {
        if (this.pastilles[color].done >= this.pastilles[color].toDo) {
            $('#' + color + 'Instructions .nbreOfPastilleDone').addClass('green');
            $('#' + color + 'Instructions .nbreOfPastilleDone .check').html('<i class="fa fa-check"></i>');

            let allDone = true;
            const colors = Twister.colors;

            for (let i = 0; i < colors.length && allDone; i++) {
                if (this.pastilles[colors[i]].toDo > this.pastilles[colors[i]].done)
                    allDone = false;
            }

            if (allDone)
                this.updateTotal();
        } else {
            $('#' + color + 'Instructions .nbreOfPastilleDone').removeClass('green');
            $('#' + color + 'Instructions .nbreOfPastilleDone .check').html('');
        }

    }
}