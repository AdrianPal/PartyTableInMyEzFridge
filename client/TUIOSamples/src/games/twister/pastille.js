import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';
import ImageElementWidget from '../../../../TUIOManager/widgets/ElementWidget/ImageElementWidget/ImageElementWidget';

export default class Pastille extends ImageElementWidget {
    constructor(x, y, color, parent) {
        super(x, y, 100, 100, 0, 1);

        this.parent = parent;
        this.color = color;

        console.log(color);

        this._domElem = $('<div>');
        this._domElem.attr('class', 'not-visible pastille ' + this.color);
        this._domElem.attr('data-color', this.color);
        
        this._domElem.css('width', `${this.width}px`);
        this._domElem.css('height', `${this.height}px`);
        this._domElem.css('position', 'absolute');
        this._domElem.css('z-index', `${this.zIndex}`);
        this._domElem.css('left', `${x}px`);
        this._domElem.css('top', `${y}px`);
    }

    onTouchCreation(tuioTouch) {
        super.onTouchCreation(tuioTouch);

        this.parent.pastilleTouched(tuioTouch._id, this.color);
    }

    onTouchDeletion(tuioTouchId) {
        super.onTouchDeletion(tuioTouchId);

        this.parent.pastilleUnTouched(tuioTouchId, this.color);
    }
}