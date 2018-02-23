/**
 * @author Christian Brel <ch.brel@gmail.com>
 */
 
 ///RRRRAAAAAAAAAAAAAAIIIIMIIIEE

 /* eslint-disable */

// Import JQuery
import $ from 'jquery/dist/jquery.min';

import TUIOWidget from '../../../core/TUIOWidget';
import { radToDeg } from '../../../core/helpers';
import Point from '../../../src/utils/Point';

/**
 * Main class to manage LibraryStack.
 *
 * Note:
 * It's dummy implementation juste to give an example
 * about how to use TUIOManager framework.
 *
 * @class BallContainer
 * @extends TUIOWidget
 */
class BallContainer extends TUIOWidget {
  /**
   * Constructor BallContainer
   *
   * @param {number} x - X position of the stack
   * @param {number} y - Y position of the stack
   * @param {number} size - Size of the stack
   * @param {string} stackTitle - Title of the stack (should be unique throughout the DOM like an id)
   * @param {string} color - Color in Hexadecimal of the border or background of the stack
   * @param {boolean} isFull - Define if the stack has border or a full background color
   * @param {String Array} allowcontentsArray - Array of allowed ElementWidget to fill the stack. Set an empty array to accept all kind of ElementWidget
   */
  constructor(x, y, size, stackTitle, color, isFull, allowcontentsArray, rotation, gameTime) {
    super(x, y, size, size);

    this._lastTouchesValues = {};
    this._lastTagsValues = {};
    this._stackList = [];
    this.zIndexElem = -20000000;
    this._domElem = $('<div>')
          .css('width', `${size}px`)
          .css('height', `${size}px`)
          .css('position', 'absolute')
          .css('left', `${x}px`)
          .css('top', `${y}px`)
          .css('z-index', -1);
          //before, there was stackTitle
    this.stackTitleTop = $('<div>').text('')
                        .css('margin-top', '-40px')
                        .css('text-align', 'center')
                        .css('width', `${size}`)
                        .css('max-width', `${size}`)
                        .css('white-space', 'nowrap')
                        .css('height', '40px')
                        .css('font-size', '100px');
    this.stackTitleBottom = $('<div>').text(stackTitle)
                        .css('position', 'absolute')
                        .css('bottom', 0)
                        .css('margin-bottom', '-60px')
                        .css('text-align', 'center')
                        .css('width', `${size}`)
                        .css('max-width', `${size}`)
                        .css('white-space', 'nowrap')
                        .css('transform', 'rotate(180deg)')
                        .css('height', '40px')
                        .css('font-size', '100px');

    this.stackDiv = $('<div class="library-stack"> </div>')
                        .css('width', `${size}px`)
                        .css('height', `${size}px`)
                        .css('position', 'absolute')
                        .css('z-index', -1)
                        .css('overflow', 'hidden');
    if (isFull) {
      this.stackDiv.css('background-color', color);
    } else {
      this.stackDiv.css('border', `solid 10px ${color}`);
    }
    this._domElem.append(this.stackTitleTop);
    this._domElem.append(this.stackDiv);
    this._domElem.append(this.stackTitleBottom);
    this.zIndex = -1;
    this.allowcontentsArray = allowcontentsArray;
    this.elementInfoArray = [];
    this.upperIndex = 0;
    this.canRemove = true;
    this._currentAngle = 0;
    this.showTag = '';
    this.scale = 1;
    // this.allTheStacks.push(this);

    this._ballsCount = 5;
    this._bonusCount = 0;
    this._ballsLost = 0;
    this._playerid = stackTitle;
	  this._gameTime = gameTime;


    //Rotating the element
    this._domElem.css({
      '-webkit-transform' : 'rotate('+rotation+'deg)',
         '-moz-transform' : 'rotate('+rotation+'deg)',  
          '-ms-transform' : 'rotate('+rotation+'deg)',  
           '-o-transform' : 'rotate('+rotation+'deg)',  
              'transform' : 'rotate('+rotation+'deg)'
    
        });
		

  this._domElem.append('<h3 class="ballsCount" id="'+this._playerid +'">'+ this._ballsCount +'</h3>');
	//this._domElem.append('<h3 class="ballsCount" id="'+this._playerid +'time">'+ this._gameTime/1000 +'</h3>');

  this._domElem.append('<p id="'+ this._playerid+'help" class="help">Drag the balls of your color here !</p>');

  this._domElem.append('<p id="'+ this._playerid+'malus" class="malus">Malus</p>');
  $('#'+this._playerid+'malus').css('margin-left', '130%');
  $('#'+this._playerid+'malus').css('font-size', '3rem');
  //console.log("VA NIKER T MORH "+ '#'+this._playerid+'malus' );
  
  //$('#'+this._playerid+'malus').hide();
  
  /*this._domElem.append('<div class="timeBar" id="'+ this._playerid + 'bar"></div>');
  $('#' + this._playerid + 'bar').css('width', this._domElem.width());
  $('#' + this._playerid + 'bar').css('margin-left', this._domElem.width()/2 + 30);
  
	*/
	
  }
  
  
  updateTime(time)
  {
    //this._gameTime = time;
    this._gameTime -= time;
   // $('#'+this._playerid + 'time').text(this._gameTime/1000);
    const sub = time/this._gameTime;
    const widthToDelete = $('#' + this._playerid + 'bar').width() * sub;
    const newWidth = $('#' + this._playerid + 'bar').width() - widthToDelete;
    //$('#' + this._playerid + 'bar').width(newWidth);

    //$('#' + this._playerid + 'bar').css('transform', 'scaleY('+sub +')');
    
  }

  setBallsCaptured()
  {
    $('#' + this._playerid).text(this._ballsCount);  
    console.log($('#' + this._playerid).text());  
  }

  addBall()
  {
    $('#picksound')[0].play();
    this._ballsCount++;
    //$('#' + this._playerid).text(this._ballsCount);
    this.setBallsCaptured();
  }

  addBalls(amount)
  {
      this._ballsCount+= amount;
      //$('#' + this._playerid).text(this._ballsCount); 
      this.setBallsCaptured();  
      if(amount>1)
      {
        this._bonusCount++;
      }   
  }

  removeBalls(amount)
  {
    this._ballsCount-= amount;
    if(this._ballsCount < 0)
    {
      this._ballsCount = 0;
    }
    else
    {
      this._ballsLost += amount;
      
      $('#'+this._playerid+'malus').show();
      $('#'+this._playerid+'malus').text('- '+ this._ballsLost);

      let self = this;
      setTimeout(function(){
        console.log("SUpposed to hide");
        $('#'+self._playerid+'malus').hide();
            
        }, 1500)
    }
    
    this.setBallsCaptured();
   // $('#' + this._playerid).text(this._ballsCount);
    
  }

  showOutcome(hasWon)
  {
    $('.container-avatar').remove();
    $('#'+this._playerid+'help').remove();
    this._domElem.append('<p class="stats">Balls captured : '+ this._ballsCount+'</p><br/>');
    this._domElem.append('<p class="stats">Balls lost : '+ this._ballsLost+'</p>');
    this._domElem.append('<p class="stats">Bonuses captured : '+ this._bonusCount+'</p>');
    
	  this._domElem.append('<img  id="'+this._playerid +'end"/>');
    
      if(hasWon)
      {
        $('#' + this._playerid + 'end').text("You win !");
        $('#' + this._playerid + 'end').attr("src", "/assets/win.png");
        
        $('#' + this._playerid + 'end').addClass("outcome haswon");
        
      }
      else
      {
        $('#' + this._playerid + 'end').text("You lose.");
        $('#' + this._playerid + 'end').attr("src", "/assets/lose.png");
        
        $('#' + this._playerid + 'end').addClass("outcome haslost");        
      }

     
  }

  areCoordsRight(x, y, ballwidth, containerWidth) 
  {
      if(x+ballwidth < this.x || x> this.x+ containerWidth) 
       
        {
          return true;          
        }
        else if(y+ballwidth < this.y || y> this.y+containerWidth)
        {
          return false;
        }
        else
        {
          return false;
        }       
  }

  showImg(path)
  {
    console.log(path);
    this._domElem.append('<img src="'+ path +'" class="container-avatar"/>');
  }  

  /**
   * LibraryStack's domElem.
   *
   * @returns {JQuery Object} ImageWidget's domElem.
   */
  get domElem() { return this._domElem; }


  /**
   * Check if LibraryStack is touched.
   *
   * @method isTouched
   * @param {number} x - Point's abscissa to test.
   * @param {number} y - Point's ordinate to test.
   */
  isTouched(x, y) {
    //this._domElem.css('transform', `rotate(360deg) scale(${this.scale})`);
    const nx = this._domElem[0].getBoundingClientRect().left;
    const ny = this._domElem[0].getBoundingClientRect().top;
    const width = this._domElem.width();
    const height = this._domElem.height();
    const ox = (nx + (width / 2));
    const oy = (ny + (height / 2));
    const p = new Point(x, y);
   // p.rotate((360 - this._currentAngle), ox, oy);
    //this._domElem.css('transform', `rotate(${this._currentAngle}deg) scale(${this.scale})`);
    return (p.x >= nx && p.x <= nx + width && p.y >= ny && p.y <= ny + height) && !this.isDisabled;
    // return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) && !this.isDisabled;
  }

  /**
   * Call after a TUIOTouch creation.
   *
   * @method onTouchCreation
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchCreation(tuioTouch) {
	  
    super.onTouchCreation(tuioTouch);
    if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
      this._lastTouchesValues = {
        ...this._lastTouchesValues,
        [tuioTouch.id]: {
          x: tuioTouch.x,
          y: tuioTouch.y,
        },
      };
      if (this._lastTouchesValues.scale == null) {
        this._lastTouchesValues.scale = 1;
      }

      this.touchedTimestamp = Date.now();
      //this.touchedInitX = tuioTouch.x;
      //this.touchedInitY = tuioTouch.y;
    }
  }

  /**
   * Set the size of the Stack title to fit correctly
   *
   * @method onTouchCreation
   * @param {DOM} element - DOM Elem of the titles
   */
  resizeFont(element) {
    while (element.scrollWidth > element.offsetWidth || element.scrollHeight > element.offsetHeight) {
      const newSize = parseFloat($(element).css('font-size').slice(0, -2)) * 0.95;
      $(element).css('font-size', `${newSize}px`);
    }
  }

  /**
   * Call to add the stack to a DOM
   * @param {DOM} parent - DOMElem to put the libraryStack
   */
  addTo(parent) {
    super.addTo(parent);
    this.resizeFont(this.stackTitleTop.get(0));
    this.resizeFont(this.stackTitleBottom.get(0));
  }

  /**
   * Call after a TUIOTouch update.
   *
   * @method onTouchUpdate
   * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
   */
  onTouchUpdate(tuioTouch) {
    if (typeof (this._lastTouchesValues[tuioTouch.id]) !== 'undefined') {
      const touchesWidgets = [];
      const currentTouches = this.touches;
      Object.keys(this.touches).forEach((key) => {
        touchesWidgets.push(currentTouches[key]);
      });
      const updateTouch = Date.now();
      if (touchesWidgets.length === 1) {
        const deltaX = Math.abs(tuioTouch.x - this.touchedInitX);
        const deltaY = Math.abs(tuioTouch.y - this.touchedInitY);
        if (((updateTouch - this.touchedTimestamp) / 1000 > 0.5) && deltaX < 10 && deltaY < 10) {
          if (this.canRemove) {
            const removedElem = this.removeElementWidget(tuioTouch);
            super.onTouchDeletion(tuioTouch.id);
            removedElem.onTouchCreation(tuioTouch);
            this.canRemove = false;
          }
        } else {
          const lastTouchValue = this._lastTouchesValues[tuioTouch.id];
          const diffX = tuioTouch.x - lastTouchValue.x;
          const diffY = tuioTouch.y - lastTouchValue.y;

          const newX = this._x + diffX;
          const newY = this._y + diffY;

          for (let i = 0; i < this._stackList.length; i += 1) {
            this._stackList[i].internX = newX;
            this._stackList[i].internY = newY;
          }

          //this.moveTo(newX, newY);
          this._lastTouchesValues = {
            ...this._lastTouchesValues,
            [tuioTouch.id]: {
              x: tuioTouch.x,
              y: tuioTouch.y,
            },
          };
        }
      } else if (touchesWidgets.length === 2) {
        const touch1 = new Point(touchesWidgets[0].x, touchesWidgets[0].y);
        const touch2 = new Point(touchesWidgets[1].x, touchesWidgets[1].y);
        let newscale = this._lastTouchesValues.scale;
        // Resize d'une image
        // if (this.canZoomTactile) {
          const c = touch1.distanceTo(touch2);
          if (c > this._lastTouchesValues.pinchDistance) {
            newscale = this._lastTouchesValues.scale * 1.018; // new scale is 1.5 times the old scale
            this._lastTouchesValues.scale = newscale; //  We save the scale
          } else if (c < this._lastTouchesValues.pinchDistance) {
            newscale = this._lastTouchesValues.scale * 0.985; // new scale is 1.5 times the old scale
            this._lastTouchesValues.scale = newscale; //  We save the scale
          }
          //this.scale = newscale;
          this._lastTouchesValues.pinchDistance = c;
        //}

        // Rotation d'une image
        //if (this.canRotateTactile) {
          /*if (!this.lastAngle) {
            this.lastAngle = touch1.angleWith(touch2);
          } else {
            if (this.lastAngle < touch1.angleWith(touch2)) {
              this._currentAngle += touch1.angleWith(touch2) - this.lastAngle;
            } else {
              this._currentAngle -= this.lastAngle - touch1.angleWith(touch2);
            }
            this._currentAngle = this._currentAngle % 360;
            this.lastAngle = touch1.angleWith(touch2);
          }*/
        //}
        //this._domElem.css('transform', `rotate(360deg) scale(${this.scale})`);
        //this._domElem.css('transform', `rotate(${this._currentAngle}deg) scale(${this.scale})`);
        // this._x = this._domElem.position().left;
        // this._y = this._domElem.position().top;
      }
    }
  }

  /**
   * Call after a TUIOTouch deletion.
   *
   * @method onTouchDeletion
   * @param {number/string} tuioTouchId - TUIOTouch's id to delete.
   */
  onTouchDeletion(tuioTouchId) {
    super.onTouchDeletion(tuioTouchId);
    if (typeof (this._lastTouchesValues[tuioTouchId]) !== 'undefined') {
      const endTouch = Date.now();
      const delta = endTouch - this.touchedTimestamp;
      if (delta / 1000 <= 0.5) {
        if (this._stackList.length > 0) {
          this.browseStack();
        }
      }
      this.canRemove = true;
      this.lastAngle = null;
    }
  }

  /**
   * Call after a TUIOTag creation.
   *
   * @method onTagCreation
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagCreation(tuioTag) {
    if (tuioTag.id === this.showTag) {
      this._tags = {
        ...this._tags,
        [tuioTag.id]: tuioTag,
      };
      this._tags[tuioTag.id].addWidget(this);

      this._lastTagsValues = {
        ...this._lastTagsValues,
        [tuioTag.id]: {
          x: tuioTag.x,
          y: tuioTag.y,
        },
      };
      if (this.tangibleMode === 0) { // TOP
        this._x = tuioTag.x - (this.width / 2);
        this._y = tuioTag.y + 80;
      } else if (this.tangibleMode === 1) { // LEFT
        this._x = tuioTag.x + 80;
        this._y = tuioTag.y - (this.height / 2);
      } else if (this.tangibleMode === 2) { // RIGHT
        this._x = tuioTag.x - (this.width - 80);
        this._y = tuioTag.y - (this.height / 2);
      } else if (this.tangibleMode === 3) { // BOTTOM
        this._x = tuioTag.x - (this.width / 2);
        this._y = tuioTag.y - (this.height - 80);
      } else { // AUTO
        this._x = tuioTag.x;
        this._y = tuioTag.y;
      }
      this.moveTo(this.x, this.y, radToDeg(tuioTag.angle));
      this.show();
    }
  }

  /**
   * Call after a TUIOTag update.
   *
   * @method onTagUpdate
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagUpdate(tuioTag) {
    if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
      const lastTagValue = this._lastTagsValues[tuioTag.id];
      const diffX = tuioTag.x - lastTagValue.x;
      const diffY = tuioTag.y - lastTagValue.y;

      const newX = this.x + diffX;
      const newY = this.y + diffY;

      this.moveTo(newX, newY, radToDeg(tuioTag.angle));
      this._lastTagsValues = {
        ...this._lastTagsValues,
        [tuioTag.id]: {
          x: tuioTag.x,
          y: tuioTag.y,
        },
      };
    }
  }

   /**
   * Call after a TUIOTag deletion.
   *
   * @method onTagUpdate
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagDeletion(tuioTagid) {
    if (typeof (this._lastTagsValues[tuioTagid]) !== 'undefined') {
      super.onTagDeletion(tuioTagid);
      this.hide();
      this.isDisabled = true;
    }
  }

  /**
   * Move ImageWidget.
   *
   * @method moveTo
   * @param {string/number} x - New ImageWidget's abscissa.
   * @param {string/number} y - New ImageWidget's ordinate.
   * @param {number} angle - New ImageWidget's angle.
   */
  moveTo(x, y, angle = null) {
    this._x = x;
    this._y = y;
    this._domElem.css('left', `${x}px`);
    this._domElem.css('top', `${y}px`);
    if (angle !== null) {
      this._domElem.css('transform', `rotate(${angle}deg) scale(${this.scale})`);
    }
  }

  /**
   * Check if the elementwidget is allowed to be placed in this LibraryStack
   * @param {ElementWidget} elementWidget - Elementwidget to add
   */
  isAllowedElement(elementWidget) {
    return (this.allowcontentsArray.indexOf(elementWidget.constructor.name) !== -1 || this.allowcontentsArray.length === 0);
  }

  /**
   * Add an ElementWidget to this LibraryStack
   * @param {ElementWidget} elementWidget  - Elementwidget to add
   */
  addElementWidget(elementWidget) {
    let elementToAdd;
    if(elementWidget._playerid == this._playerid)
    {    
		this._isInStack= true;
      if (this.isAllowedElement(elementWidget)) {
        elementToAdd = elementWidget;
        elementToAdd._domElem.css('transform', 'rotate(360deg)');
        const elemWidth = elementToAdd._domElem.width();
        const elemHeight = elementToAdd._domElem.height();
        this.elementInfoArray.push(
          {
            x: elementToAdd.x,
            y: elementToAdd.y,
            width: elemWidth,
            height: elemHeight,
            angle: elementToAdd._currentAngle,
            scale: elementToAdd.scale,
            zIndex: elementToAdd.zIndex,
          },
        );
        elementToAdd._x = this._x;
        elementToAdd._y = this._y;
        this.zIndexElem += 1;
        elementToAdd.zIndex = this.zIndexElem;

        elementToAdd._isInStack = true;
        elementToAdd.disable(true);
        
        let newWidth;
        let newHeight;
        
        if (elemWidth > elemHeight) {
          newWidth = this.width - 50;
          newHeight = (elemHeight * newWidth) / elemWidth;
        } else {
          newHeight = this.width - 50;
          newWidth = (elemWidth * newHeight) / elemHeight;
        }

        const newLeft = (this.width / 2) - (newWidth / 2);
        const newTop = (this.height / 2) - (newHeight / 2);
        elementToAdd._domElem.addClass('stack-element')
                              .css('left', newLeft)
                              .css('top', newTop)
                              .css('overflow', 'hidden')
                              .css('width', newWidth)
                              .css('height', newHeight);
        const angle = this._stackList.length * 10;
        elementToAdd._currentAngle = angle;
        elementToAdd.scale = 1;
        elementToAdd._domElem.css('transform', `rotate(${angle}deg)`)
                            .appendTo(this.stackDiv);

        this._stackList.push(elementToAdd);
      }

      elementToAdd._domElem.css('transform', 'scale(0.4)');

      this.addBall();
    }
  }

  /**
   * Remove the top ElementWidget of this LibraryStack
   * @param {TUIOTouch} tuioTouch - TUIOTouch Instance
   */
  removeElementWidget(tuioTouch) {
    const upperIndex = this.getUpperIndex();

    const elementToRemove = this._stackList[upperIndex];
    const elemenToRemoveInfos = this.elementInfoArray[upperIndex];

    elementToRemove.disable(false);
    elementToRemove._width = elemenToRemoveInfos.width;
    elementToRemove._height = elemenToRemoveInfos.height;
    elementToRemove._currentAngle = elemenToRemoveInfos.angle;
    elementToRemove.scale = elemenToRemoveInfos.scale;
    elementToRemove.zIndex = elemenToRemoveInfos.zIndex;
    elementToRemove._domElem.css('z-index', elemenToRemoveInfos.zIndex)
                            .css('top', tuioTouch.y - elementToRemove.height/2)
                            .css('left', tuioTouch.x - elementToRemove.width/2)
                            .css('width', elemenToRemoveInfos.width)
                            .css('height', elemenToRemoveInfos.height)
                            .css('transform', `rotate(${elemenToRemoveInfos.angle}deg) scale(${elemenToRemoveInfos.scale})`)
                            .removeClass('stack-element')
                            .appendTo(this._domElem.parent().parent());
    elementToRemove._isInStack = false;
    this._stackList.splice(upperIndex, 1);
    this.elementInfoArray.splice(upperIndex, 1);
    return elementToRemove;
  }

  isInBounds(element) {
    if (element.x >= this.x && element.x <= (this.x + this.width) && element.y >= this.y && element.y <= (this.y + this.height)) {
      return true;
    }
    return false;
  }// isInBounds()

  /**
   * Browse the LibraryStack by changing tkhe z-index of all the ElementWidget
   */
  browseStack() {
    this.upperIndex = (this.upperIndex + 1) % this._stackList.length;
    const zIndexBottom = this._stackList[this._stackList.length - 1].zIndex;
    for (let i = this._stackList.length - 1; i > 0; i -= 1) {
      this._stackList[i].zIndex = this._stackList[i - 1].zIndex;
      this._stackList[i]._domElem.css('z-index', this._stackList[i].zIndex);
    }
    this._stackList[0].zIndex = zIndexBottom;
    this._stackList[0]._domElem.css('z-index', this._stackList[0].zIndex);
  }

  /**
   * Get the z-index of the upper ElementWidget
   */
  getUpperIndex() {
    let maxZindex = -20000000;
    let index = 0;
    for (let i = 0; i < this._stackList.length; i += 1) {
      if (this._stackList[i].zIndex > maxZindex) {
        maxZindex = this._stackList[i].zIndex;
        index = i;
      }
    }
    return index;
  }

  /**
   * Hide the LibraryStack
   */
  hide() {
    this._domElem.hide();
    this.isDisabled = true;
  }

  /**
   * Show the LibraryStack
   */
  show() {
    this._domElem.show();
    this.isDisabled = false;
  }

  /**
   * Set tangible LibraryStack
   * @param {string} tag - Tag ID
   * @param {number} mode - Position mode 
   */
  setTangible(tag, mode) {
    this.showTag = tag;
    this.tangibleMode = mode;
    this.hide();
  }

}// class LibraryStack

export default BallContainer;
