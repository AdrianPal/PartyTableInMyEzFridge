/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */
//RRAIAIIMEEM

// Import JQuery
import $ from 'jquery/dist/jquery.min';
import ElementWidget from '../ElementWidget';
import TUIOManager from '../../../core/TUIOManager';


 /**
  * Main class to manage ImageElementWidget.
  *
  * @class Ball
  * @extends ElementWidget
  */
class Ball extends ElementWidget {
  /**
  * Ball constructor.
  *
  * @constructor
  * @param {number} x - ImageElementWidget's upperleft coin abscissa.
  * @param {number} y - ImageElementWidget's upperleft coin ordinate.
  * @param {number} width - ImageElementWidget's width.
  * @param {number} height - ImageElementWidget's height.
  * @param {number} initialRotation - Initial rotation. Set to 0 of no rotation
  * @param {number} initialScale - Initial scale. Set to 1 of no rescale
  * @param {string} src - Source of the image
  */
  constructor(x, y, width, height, initialRotation, initialScale, src, color) {
    super(x, y, width, height, initialRotation, initialScale);
    this.src = src;
    this._domElem = $('<img class="ball">');
    this._domElem.attr('src', src);
    this._domElem.css('width', `${this.width}px`);
    this._domElem.css('height', `${this.height}px`);
    this._domElem.css('position', 'absolute');
    this._domElem.css('z-index', `${this.zIndex}`);
    this._domElem.css('left', `${x}px`);
    this._domElem.css('top', `${y}px`);
    this._domElem.css('transform', `rotate(${initialRotation}deg)`);
    this._domElem.css('transform-origin', `scale(${initialScale})`);
    this.hasDuplicate = false;

    //console.log("In Ball, the color is  " + color);
    this._domElem.css('background-color', color);
	
	this._isTouched = false;

    
  
  } // constructor
  
   /**
   * Call after a TUIOTouch creation.
   *
   * @method onTouchCreation
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchCreation(tuioTouch) {
    if (!this._isInStack) {
      super.onTouchCreation(tuioTouch);
      
    }
  }
  
  
  /**
   * Call after a TUIOTag creation.
   *
   * @method onTagCreation
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagCreation(tuioTag) {
    if (!this._isInStack) {
      super.onTagCreation(tuioTag);
	  this._isTouched = true;
	  
	}
  }


  /**
   * Call after a TUIOTag update.
   *
   * @method onTagUpdate
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagUpdate(tuioTag) {
    super.onTagUpdate(tuioTag);
	this._isTouched = true;
    if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
      if (tuioTag.id === this.tagDuplicate && !this.hasDuplicate) {
        const clone = new ImageElementWidget(this.x + 10, this.y + 10, this.width, this.height, this._currentAngle, 1, this.src, this.tagMove, this.tagDelete, this.tagZoom, this.tagDuplicate);
        TUIOManager.getInstance().addWidget(clone);
        this._domElem.parent().append(clone.domElem);
        this.hasDuplicate = true;
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
    super.onTagDeletion(tuioTagId);
    if (typeof (this._lastTagsValues[tuioTagId]) !== 'undefined') {
      if (tuioTagId === this.tagDuplicate) {
        this.hasDuplicate = false;
      }
    }
  }

  destroy()
  {
	this._domElem.remove();
    this.deleteWidget();
	
  }



/**
   * Call after a TUIOTouch update.
   *
   * @method onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchUpdate(tuioTouch) {
    super.onTouchUpdate(tuioTouch);
    this._domElem.addClass('ballTouched'); 
  
  }
    



} // class ImageElementWidget

export default Ball;
