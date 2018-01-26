import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';

export default class Pastille extends ElementWidget {
    constructor(x, y, color, parent) {
        super(x, y, 100, 100, 0, 1);

        this.parent = parent;
        this.color = color;

        console.log(color);

        this._domElem = $('<div>');
        this._domElem.attr('class', 'not-visible pastille ' + this.color);
        this._domElem.attr('data-color', this.color);
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