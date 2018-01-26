import ImageElementWidget from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/ImageElementWidget'

export default class Pastille extends ImageElementWidget {
    constructor(x, y, width, height, initialRotation, initialScale, src) {
        super(x, y, width, height, initialRotation, initialScale, src);
    }

    onTouchCreation(tuioTouch) {
        super.onTouchCreation(tuioTouch);
        alert('lol');
        
    }
}