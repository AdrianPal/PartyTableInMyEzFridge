/**
 * @author: Adrian PALUMBO  
 */
import {
    setTimeout
} from 'timers';
import Pastille from './pastille';
import User from '../../user/user';
import Home from '../../home/home';
import {
    Game
} from '../game';
import Anywhere from '../../tools/anywhere';

import SocketManager from '../../../socket.manager';

const config = require('../../../config');

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
    static get gameDuration() {
        return 30;
        // return 1;
    }
    static get fingersNumber() {
        return 9;
        // return 1;
    }

    static get defaultVolume() {
        return '0.1';
    }

    constructor(_gameId) {
        super(_gameId);

        SocketManager.get().emit('mobile twister rules');

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

    getPlayersName(p) {
        let players = "";

        p.forEach(function (e) {
            players += e.name + ", ";
        });

        players = players.substring(0, players.length - 2);

        return players;
    }

    setTurn(id) {
        if (id == 1) {
            this.currentPlayers = this.teamOne;
        } else {
            this.currentPlayers = this.teamTwo;
        }

        this.newGame();

        this.addGameElements();

        let content = `
        <div id="turnView">
            <div class="center">
                <div class="clickAnywhere">Click anywhere to start the game.</div>
                <div class="clickAnywhere">You can read the rules at anytime on your phone.</div>
            </div>

            <span>It's your turn!</span>
            
            <div class="playersContainer">`;

        for (let i = 0; i < this.currentPlayers.length; i++) {
            let u = this.currentPlayers[i];
            content += `
                <div class="player" style="display: flex; background-image: url('` + config.server + '/' + u.avatarPath + `'); border-color: ` + u.color + `;">
                    <div class="name" style="background-color: ` + this.getAvatarNameBackground(u.color) + `"><b>` + u.name + `</b></div>
                </div>
            `;
        }

        content += `
            </div>

            <span class="upsideDown">It's your turn!</span>

            <div class="upsideDown center">
                <div class="clickAnywhere">Click anywhere to start the game.</div>
                <div class="clickAnywhere">You can read the rules at anytime on your phone.</div>
            </div>

                
        </div>`;

        $('body #app').append(content);

        const that = this;

        setTimeout(function () {
            let anywhere = new Anywhere(that, that.dismissTeamMessageAndStart);
            anywhere.addTo($('body').get(0));
        }, 1500);
    }

    playMusicSound() {
        let s = '';
        
        if (this.currentPlayers === this.teamOne) {
            s = '1';
        } else {
            s = '2';
        }
            
        $('#musicSound' + s).prop('volume', '0.1');
        $('#musicSound' + s).get(0).play();
    }

    dismissTeamMessageAndStart(widget) {
        widget.deleteWidget();

        this.playMusicSound();

        $('#loading').show();

        const that = this;

        setTimeout(function () {
            $('#loading').hide();

            $('#turnView').remove();

            let players = that.getPlayersName(that.currentPlayers);

            $('.currentTeam').html(players);

            that.setProgressBar(Twister.gameDuration, Twister.gameDuration, that.createProgressBar());
        }, 3750);
    }

    createProgressBar() {
        $('.instructions').prepend('<div class="countDown"><div class="bar"></div></div>');
        return $('.countDown');
    }

    setProgressBar(timeleft, timetotal, $element) {
        let progressBarWidth = timeleft / timetotal * 100;
        const that = this;

        $element.find('div').animate({
            width: progressBarWidth + '%'
        }, 500);

        if (timeleft > 0) {
            setTimeout(function () {
                that.setProgressBar(timeleft - 1, timetotal, $element);
            }, 1000);

            if (timeleft == 2) {
                this.decreaseMusicVolume();
            }
        } else {
            this.endOfCurrentTurn();
        }
    }

    decreaseMusicVolume() {
        let s = '';
        
        if (this.currentPlayers === this.teamOne) {
            s = '1';
        } else {
            s = '2';
        }
            
        $('#musicSound' + s).animate({
            volume: 0
        }, 1750);
    }

    endOfCurrentTurn() {
        this.currentPlayers['points'] = this.totalWin;

        if (this.currentPlayers == this.teamOne) { // Call team two
            this.teamOne = this.currentPlayers;

            this.totalWin = 0;

            this.setTurn(2);
        } else {
            this.teamTwo = this.currentPlayers;

            this.endThisGame();
        }
    }

    endThisGame() {
        let players;
        let winPoints, losePoints;
        let content = '';
        let equal = false;

        if (this.teamOne.points > this.teamTwo.points) {
            players = this.teamOne;
            winPoints = this.teamOne.points;
            losePoints = this.teamTwo.points;
        } else if (this.teamOne.points === this.teamTwo.points) { // Equal
            equal = true;
            winPoints = this.teamOne.points;
            losePoints = this.teamTwo.points;
            players = this.teamOne.concat(this.teamTwo);
        } else {
            players = this.teamTwo;
            winPoints = this.teamTwo.points;
            losePoints = this.teamOne.points;
        }

        if (!equal) {
            $('#clapSound').prop('volume', '0.3');
            $('#clapSound').get(0).play();
        }

        for (let i = 0; i < players.length; i++) {
            let u = players[i];

            content += `
                <div class="player" style="display: flex; border-width: 10px; background-image: url('` + config.server + '/' + u.avatarPath + `'); border-color: ` + u.color + `;">
                    <div class="name" style="background-color: ` + this.getAvatarNameBackground(u.color) + `"><b>` + u.name + `</b></div>
                </div>
            `;

            $.ajax({
                url: config.server + '/api/user/points',
                type: 'PUT',
                data: {
                    userId: u._id,
                    points: 5
                }
            });
        }

        let smileyText;

        if (equal) {
            smileyText = `
                <i class="fa fa-meh" style="font-size: 100px; color: gold;"></i>
                <span class="small">equality, with ` + winPoints + ` ; nobody wins</span>
            `;
        } else {
            smileyText = `
                <i class="fa fa-trophy" style="font-size: 100px; color: gold;"></i>
                <span class="small">with ` + winPoints + ` against ` + losePoints + `</span>
            `;
        }

        $('body #app').append(`
            <div id="turnView">
                <span class="clickAnywhere">Click anywhere to come back to the board.</span>

                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    ` + smileyText + `
                </div>
                        
                <div class="playersContainer">` + content + `</div>
                
                <div class="upsideDown" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    ` + smileyText + `
                </div>
                <span class="clickAnywhere upsideDown">Click anywhere to come back to the board.</span>
            </div>
        `);

        const that = this;

        setTimeout(function () {
            let anywhere = new Anywhere(that, that.updatePointsAndGoBackToBoard);
            anywhere.addTo($('body').get(0));
        }, 1500);
    }

    updatePointsAndGoBackToBoard(widget) {
        widget.deleteWidget();

        console.log('TWISTER -> HOME');

        return new Home(this.gameId);
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

    hideTeamAndSetTurn(widget) {
        widget.deleteWidget();

        $('#team').remove();

        this.setTurn(1);
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
                    let k = i++;

                    $('#team1 .player' + k).css({
                        'backgroundImage': 'url(' + config.server + '/' + e.avatarPath + ')',
                        'borderColor': e.color,
                        'display': 'flex'
                    });

                    $('#team1 .player' + k + ' .name').html('<b>' + e.name + '</b>');
                    $('#team1 .player' + k + ' .name').css('background-color', that.getAvatarNameBackground(e.color));
                });

                i = 1;
                that.teamTwo.forEach(function (e) {
                    let k = i++;

                    $('#team2 .player' + k).css({
                        'backgroundImage': 'url(' + config.server + '/' + e.avatarPath + ')',
                        'borderColor': e.color,
                        'display': 'flex'
                    }).show(500);

                    $('#team2 .player' + k + ' .name').html('<b>' + e.name + '</b>');
                    $('#team2 .player' + k + ' .name').css('background-color', that.getAvatarNameBackground(e.color));
                });

                setTimeout(function () {
                    let anywhere = new Anywhere(that, that.hideTeamAndSetTurn);
                    anywhere.addTo($('body').get(0));
                }, 1500);
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
        console.log('ADDING ELEMENTS');

        this.getPastilles();

        console.log('GET PASTILLEs');

        this.getInstructions();

        console.log('INSTRUCTIONS');

        this.getTotal();

        console.log('TOTAL');

        console.log('----');
    }

    newGame() {
        this.pastilles = [];
        this.pastillesTouched = [];
        const colors = Twister.colors;

        let nbrePastilles = 0;

        let maxPastilles = Twister.colors.length * Twister.colors.length;

        if (this.currentPlayers !== null)
            maxPastilles = Twister.fingersNumber * this.currentPlayers.length;

        for (let i = 0; i < colors.length; i++) {
            // console.log('--- rand:');
            let p = Twister.randBetween(0, maxPastilles / (Twister.colors.length / 2));
            // console.log('Between: 0, '+maxPastilles / (Twister.colors.length - 1)+' ===> '+p);
            // console.log('---');            

            if (nbrePastilles + p > maxPastilles) {
                nbrePastilles = maxPastilles;
                p = maxPastilles - nbrePastilles;
            } else {
                nbrePastilles += p;
            }

            if (i === Twister.colors.length - 1 && nbrePastilles === 0) { // Last color
                p = nbrePastilles = maxPastilles;
            }

            this.pastilles[colors[i]] = {
                toDo: p,
                // toDo: Twister.randBetween(0, 2),
                done: 0
            };
        }
    }

    getTangiblesOfCurrentTeam() {
        if (this.currentPlayers === null)
            return [];

        let tangibles = [];

        for (let i = 0; i < this.currentPlayers.length; i++) {
            tangibles.push(this.currentPlayers[i].tangible);
        }

        return tangibles;

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
                const color = $(this).data('color'),
                    posi = $(this).position();

                const l = new Pastille(posi.left, posi.top, color, that, that.getTangiblesOfCurrentTeam());
                l.addTo($('#rowOf' + color + 'Color').get(0));
            });

            $('.pastille.toRemove').remove();
            $('#loading').hide();
        }, 750);
    }

    getInstructions(doNotCreateTable) {
        const colors = Twister.colors;

        let content = '<div class="currentTeam"></div><table>';

        if (doNotCreateTable) {
            content = '';
        }

        for (let i = 0; i < colors.length; i++) {
            const nbre = this.pastilles[colors[i]].toDo;

            content += `
                <tr class="` + colors[i] + `Instructions">
                    <td><div class="pastille ` + colors[i] + `"></div></td>
                    <td>&nbsp;<span class="nbreOfPastilleDone ` + ((nbre === 0) ? 'green' : '') + `">x <span class="nbre">` + nbre + `</span> <span class="check">` + ((nbre === 0) ? '<i class="fa fa-check"></i>' : '') + `</span></span></td>
                </tr>`;
        }

        if (!doNotCreateTable) {
            content += '</table>';

            $('.instructions').html(content);
        } else {
            $('.instructions table').html(content);
        }

        // Will be updated
        $('.total').remove();
        // Need to hide it
        $('.instructions .win').remove();
    }

    getTotal() {
        $('.instructions').append(`<div class="total"><i class="fa fa-trophy"></i> <span class="totalNumber">` + this.totalWin + `</span></div>`);
    }

    playYeahSound() {
        $('#musicSound').prop('volume', Twister.defaultVolume / 2);
        $('#yeahSound').get(0).play();

        setTimeout(function () {
            $('#musicSound').prop('volume', Twister.defaultVolume);
        }, 1000);
    }

    updateTotal() {
        ++this.totalWin;

        this.playYeahSound();

        $('.instructions').append('<div class="win"><i class="fa fa-check"></i></div>');

        let that = this;

        setTimeout(function () {
            that.newGame();

            that.getInstructions(true); // Do not create table

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

    checkForTotal(color) {
        if (this.pastilles[color].done >= this.pastilles[color].toDo) {
            $('.' + color + 'Instructions .nbreOfPastilleDone').addClass('green');
            $('.' + color + 'Instructions .nbreOfPastilleDone .check').html('<i class="fa fa-check"></i>');

            let allDone = true;
            const colors = Twister.colors;

            for (let i = 0; i < colors.length && allDone; i++) {
                if (this.pastilles[colors[i]].toDo > this.pastilles[colors[i]].done)
                    allDone = false;
            }

            if (allDone)
                this.updateTotal();
        } else {
            $('.' + color + 'Instructions .nbreOfPastilleDone').removeClass('green');
            $('.' + color + 'Instructions .nbreOfPastilleDone .check').html('');
        }

    }
}