import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';
import TUIOManager from 'tuiomanager/core/TUIOManager';


export default class StartButton extends ElementWidget {
    constructor($element, _parent) {
        super($element.offset().left, $element.offset().top, $element.width(), $element.height(), 0, 1);

        this._domElem = $('<div>');
        this._domElem.attr('class', 'rotating doNotUse');
        this._domElem.attr('id', 'start_tuio');
        this._domElem.css('width', `${this.width}px`);
        this._domElem.css('height', `${this.height}px`);
        this._domElem.css('position', 'absolute');
        this._domElem.css('z-index', `${this.zIndex}`);
        this._domElem.css('left', `${this.x}px`);
        this._domElem.css('top', `${this.y}px`);
        
        this.parent = _parent;

        this.canMove(false, false);
        this.canRotate(false, false);
        this.canZoom(false, false);

        console.log('add');
    }

    onTouchCreation(tuioTouch) {
        super.onTouchCreation(tuioTouch);

        if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
            this.parent.startClicked(this);
        }
    }
}