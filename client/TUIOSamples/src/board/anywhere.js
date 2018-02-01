import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';
import TUIOManager from 'tuiomanager/core/TUIOManager';


export default class Anywhere extends ElementWidget {
    constructor(parent) {
        super(0, 0, 1920, 1080, 0, 1);

        this.parent = parent;

        this.canMove(false, false);
        this.canRotate(false, false);
        this.canZoom(false, false);
    }

    onTouchCreation(tuioTouch) {
        this.parent.dismissTeamMessage(this);
    }
}