import ImageElementWidget from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/ImageElementWidget';
import TUIOManager from 'tuiomanager/core/TUIOManager';
import { setTimeout } from 'timers';


export default class Dice extends ImageElementWidget {
    constructor(parent, x, y, width, height) {
        super(x, y, width, height, 1, 1, '/assets/dice/1.png');

        this.parent = parent;

        this.diceInterval = null;

        this.diceClicked = false;

        this.canMove(false, false);
        this.canRotate(false, false);
        this.canZoom(false, false);
    }

    onTouchCreation(tuioTouch) {
        super.onTouchCreation(tuioTouch);

        if (!this.diceClicked && this.isTouched(tuioTouch.x, tuioTouch.y)) {
            this.diceClicked = true;
            this.randomDiceForSeconds(1500);
        }
    }

    getRandomDiceFace(script = false) {
        // DEMO SCRIPT
        if (script)
            return 6;
        // -------------

        return Math.floor(Math.random() * 6) + 1;
        // return Math.floor(Math.random() * 20) + 19;
    }

    randomDiceForSeconds(sec) {
        const that = this;

        this._domElem.addClass('diceClicked');

        this.diceInterval = setInterval(function() {
            that._domElem.attr('src', '/assets/dice/'+ that.getRandomDiceFace() + '.png');
        }, 100);

        setTimeout(function() {
            that.setFinalDice();
        }, sec);
    }

    setFinalDice() {
        // DEMO SCRIPT
        const diceVal = this.getRandomDiceFace(true);
        // -------
        
        // const diceVal = this.getRandomDiceFace();

        this._domElem.removeClass('diceClicked');
        clearInterval(this.diceInterval);

        this._domElem.attr('src', '/assets/dice/'+ diceVal + '.png');

        this.parent.updatePlayerPosWithDiceVal(diceVal);
    }

    deleteWidget() {
        super.deleteWidget();

        this._domElem.remove();
    }
}