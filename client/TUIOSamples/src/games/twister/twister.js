/**
 * @author: Adrian PALUMBO  
 */
import showBoardView from '../../board';
import { setTimeout } from 'timers';
import Pastille from './pastille';
import ImageElementWidget from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/ImageElementWidget'

export class Twister {

    static get currentFolder() { return '/src/games/twister'; }
    static get pastillesPerLines() { return 8; }
    static get colors() { return ['red', 'blue', 'yellow', 'green']; }
    static randBetween(min, max) { return Math.floor((Math.random() * max) + min); }

    constructor() {
        this.app = $('#app');
        this.totalWin = 0;

        this.newGame();

        this.initGame();
    }

    initGame() {
        const that = this;
        this.app.load(Twister.currentFolder + '/main.view.html', function() {
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
        const colors = Twister.colors;

        for (let i = 0; i < colors.length; i++) {
            this.pastilles[colors[i]] = { toDo: Twister.randBetween(0, colors.length + 1), done: 0 };
        }
    }

    getPastilles() {
        const colors = Twister.colors;

        let content = '';

        for (let i = 0; i < colors.length; i++) {
            content += '<div id="rowOf' + colors[i] + 'Color" class="row rowOfPastilles">';

            for (let j = 0; j < Twister.pastillesPerLines; j++) {
                content += '<div data-color="'+ colors[i] +'" class="pastille '+ colors[i] +'"></div>';
            }

            // alert(content);

            content += '</div>';
        }

        // const l = new Pastille(100, 100, 100, 100, 0, 1, 'https://cdn.pixabay.com/photo/2013/04/06/11/50/image-editing-101040_1280.jpg');
        // l.addTo($('#pastilles').get(0));

        $('#pastilles').html(content);

        setTimeout(function() {
            $('.pastille').each(function() {
                const color = $(this).data('color');
                const l = new Pastille($(this).position().left, $(this).position().top, color);
                l.addTo($('#rowOf' + color + 'Color').get(0));
            });
        }, 1000);
    }
    

    getInstructions() {
        const colors = Twister.colors;

        let content = '<table>';

        for (let i = 0; i < colors.length; i++) {
            const nbre = this.pastilles[colors[i]].toDo;

            content += `
                <tr id="`+ colors[i] +`Instructions">
                    <td><div class="pastille `+ colors[i] +`"></div></td>
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

        setTimeout(function() {
            that.newGame();

            that.getInstructions();

            that.getTotal();
        }, 800);
    }

    addListeners() {
        let that = this;
        
        $('#pastilles .pastille')
            .on('mousedown', function() {
                const color = $(this).data('color');

                that.pastilles[color].done += 1;

                console.log(that.pastilles[color]);

                that.checkForTotal(color);
            })
            .on('mouseup', function() {
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
