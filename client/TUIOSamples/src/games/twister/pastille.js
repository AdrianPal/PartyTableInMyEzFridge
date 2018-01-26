import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';

export default class Pastille extends ElementWidget {
    constructor(x, y, color) {
        super(x, y, 100, 100, 0, 1);

        this._domElem = $('<div>');
        this._domElem.attr('class', 'pastille ' + color);
        this._domElem.attr('data-color', color);
    }

    onTouchCreation(tuioTouch) {
        super.onTouchCreation(tuioTouch);
        alert('lol');

    }
}