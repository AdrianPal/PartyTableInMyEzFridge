import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';
import TUIOManager from 'tuiomanager/core/TUIOManager';


export default class Pastille extends ElementWidget {
    constructor(x, y, color, parent) {
        super(x, y, 100, 100, 0, 1);

        this.parent = parent;
        this.color = color;

        this._domElem = $('<div>');
        this._domElem.attr('class', 'not-visible pastille ' + this.color);
        this._domElem.attr('data-color', this.color);

        this._domElem.css('width', `${this.width}px`);
        this._domElem.css('height', `${this.height}px`);
        this._domElem.css('position', 'absolute');
        this._domElem.css('z-index', `${this.zIndex}`);
        this._domElem.css('left', `${x}px`);
        this._domElem.css('top', `${y}px`);

        this.canMove(false, false);
        this.canRotate(false, false);
        this.canZoom(false, false);
    }

    onTouchCreation(tuioTouch) {
        super.onTouchCreation(tuioTouch);

        if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
            this.parent.pastilleTouched(tuioTouch._id, this.color);
        }
    }

    onTagUpdate(tuioTag) {
        if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
            if (tuioTag.id === this.idTagMove) {
                console.log('----');
                console.log('tag');
                console.log('----');

                this.parent.pastilleTouched(tuioTag.id, this.color);

                const lastTagValue = this._lastTagsValues[tuioTag.id];
                const diffX = tuioTag.x - lastTagValue.x;
                const diffY = tuioTag.y - lastTagValue.y;

                const newX = this.internX + diffX;
                const newY = this.internY + diffY;


                this._lastTagsValues = {
                    ...this._lastTagsValues,
                    [tuioTag.id]: {
                        x: tuioTag.x,
                        y: tuioTag.y,
                    },
                };
            }
        }
    }

    /**
     * Call after a TUIOTag deletion.
     *
     * @method onTagDeletion
     * @param {number/string} tuioTagId - TUIOTag's id to delete.
     */
    onTagDeletion(tuioTagId) {
        if (typeof (this._tags[tuioTagId]) !== 'undefined') {
            console.log('----');
            console.log('untag');
            console.log('----');
            this.parent.pastilleUnTouched(tuioTagId, this.color);

            delete this._tags[tuioTagId];
        }
    }

    onTouchDeletion(tuioTouchId) {
        if (typeof (this._lastTouchesValues[tuioTouchId]) !== 'undefined') {
            this.parent.pastilleUnTouched(tuioTouchId, this.color);

            const lastTouchValue = this._lastTouchesValues[tuioTouchId];
            const x = lastTouchValue.x;
            const y = lastTouchValue.y;
            if (!this._isInStack) {
                Object.keys(TUIOManager.getInstance()._widgets).forEach((widgetId) => {
                    if (TUIOManager.getInstance()._widgets[widgetId].constructor.name === 'LibraryStack') {
                        if (this.isInBounds(TUIOManager.getInstance()._widgets[widgetId], x, y) && !TUIOManager.getInstance()._widgets[widgetId].isDisabled && TUIOManager.getInstance()._widgets[widgetId].isAllowedElement(this)) {
                            this._isInStack = true;
                            TUIOManager.getInstance()._widgets[widgetId].addElementWidget(this);
                            return;
                        }
                    }
                });
            }
        }
        ElementWidget.isAlreadyTouched = false;
        this.lastAngle = null;

    }
}