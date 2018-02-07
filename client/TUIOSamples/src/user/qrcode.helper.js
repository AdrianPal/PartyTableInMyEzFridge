import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';
import SocketManager from '../../socket.manager';

export default class QrcodeHelper extends ElementWidget {
    constructor(parent, x, y, extraClass, pos, backgroundColor) {
        super(x, y, 70, 70, 1, 1);

        this._domElem = $('<div>');
        this._domElem.addClass('qrCodeHelper '+ extraClass);
        this._domElem.attr('id', 'qrCodeHelper_' + pos);
        this._domElem.css({
            backgroundColor: backgroundColor,
            top: y,
            left: x,
        });
        this._domElem.html('<i class="fa fa-mobile-alt"></i>');

        this.parent = parent;
        this.pos = pos;

        this.isActive = false;

        this.canMove(false, false);
        this.canRotate(false, false);
        this.canZoom(false, false);

        this.listenSocketHideQrCode();
    }

    listenSocketHideQrCode() {
        const that = this;
        
        SocketManager.get().on('hide QRCode', (data) => {
            that.updateActive(false);
            that.parent.toggleQRcodeForMobile(that.pos);
        });
    }

    onTouchCreation(tuioTouch) {
        super.onTouchCreation(tuioTouch);

        if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
            this.isActive = !this.isActive;

            this.updateElementDisplay();

            this.parent.toggleQRcodeForMobile(this.pos);
        }
    }

    updateElementDisplay() {
        if (this.isActive) { // Need to add shadow
            this._domElem.addClass('active');
        } else { // Remove shadow
            this._domElem.removeClass('active');
        }
    }

    updateActive(_new) {
        this.isActive = _new;

        this.updateElementDisplay();
    }

    deleteWidget() {
        super.deleteWidget();

        this._domElem.remove();
    }
}