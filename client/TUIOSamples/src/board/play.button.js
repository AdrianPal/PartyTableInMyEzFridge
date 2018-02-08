import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';
import TUIOManager from 'tuiomanager/core/TUIOManager';


export default class PlayButton extends ElementWidget {
    constructor(x, y, width, height, type, parent, optionalClass = '') {
        super(x, y, width, height, 0, 1);

        this.parent = parent;
        this.type = type;

        this._domElem = $('<div>');
        this._domElem.attr('class', 'playButton ' + this.type + ' ' + optionalClass);
        this._domElem.attr('data-color', this.color);

        this._domElem.css('width', `${this.width+1}px`);
        this._domElem.css('height', `${this.height+1}px`);
        this._domElem.css('position', 'absolute');
        this._domElem.css('z-index', `1`);
        this._domElem.css('left', `${x}px`);
        this._domElem.css('top', `${y}px`);

        this.getType();

        this.canMove(false, false);
        this.canRotate(false, false);
        this.canZoom(false, false);
    }

    getType() {
        switch (this.type) {
            case "new":
                this._domElem.html('<i class="fa fa-play-circle"></i> Play again');
                break;

            case "newWithPlayers":
                this._domElem.html('<i class="fa fa-users"></i><div class="text"><span>Play again</span><span class="small">with same players</span></div>');
                break;
        }
    }

    onTouchCreation(tuioTouch) {
        super.onTouchCreation(tuioTouch);

        if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
            this.parent.newGameClicked(this.type);
        }
    }
}