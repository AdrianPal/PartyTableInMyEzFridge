import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';

export default class Pastille extends ElementWidget {
    constructor(color, parent) {
        super(0, 0, 100, 100, 0, 1);

        this.parent = parent;

        this._domElem = $('<div>');
        this._domElem.attr('class', 'pastille ' + color);
        this._domElem.attr('data-color', color);
    }

    onTouchCreation(tuioTouch) {
        super.onTouchCreation(tuioTouch);
        this.parent.pastilleTouched(tuioTouch);
    }
}