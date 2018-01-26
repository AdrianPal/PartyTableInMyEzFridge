import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';

export default class Pastille extends ElementWidget {
    constructor(color, parent) {
        super(0, 0, 100, 100, 0, 1);

        this.parent = parent;
        this.color = color;

        console.log(color);

        this._domElem = $('<div>');
        this._domElem.attr('class', 'pastille ' + this.color);
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