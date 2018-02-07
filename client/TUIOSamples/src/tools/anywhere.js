import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';
import TUIOManager from 'tuiomanager/core/TUIOManager';


export default class Anywhere extends ElementWidget {
    constructor(_parent, _callBack, _optionalParams) {
        super(0, 0, 1920, 1080, 0, 1);

        this.callBack = _callBack;
        this.parent = _parent;
        this.optionalParams = _optionalParams;
		
		this._domElem = $('<div>');
        this._domElem.css({
            position: 'absolute',
            top: this._y,
            left: this._x,
			width: this._width,
			height: this._height
        });

        this.canMove(false, false);
        this.canRotate(false, false);
        this.canZoom(false, false);
    }

    onTouchCreation(tuioTouch) {
        super.onTouchCreation(tuioTouch);

        if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
            alert('anywhere touched');
			this.callBack.call(this.parent, this, this.optionalParams);
        }
    }
}