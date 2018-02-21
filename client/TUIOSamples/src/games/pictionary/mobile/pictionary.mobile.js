import MobileHandler from '../../../mobile/mobile.handler'
import SocketManager from '../../../../socket.manager'
import { toASCII } from 'punycode';


export default class PictionaryMobile extends MobileHandler {

    

    static get currentFolder() {
        return '/src/games/pictionary/mobile';
    }

    static get initialCountDownValue() {
        return 180;
    }

    constructor(gameId, pos, isChoosenMobile, word)  {
        super(gameId, pos);

        this.app = $('#app');
        this.context = null;
        this.canvas = null;
        this.opts = {
            line: {
                color: '#000',
                size: 1,
                cap: 'round',
                join: 'round',
                miterLimit: 10
            }
        };

        this.sketching = false;
        this.strokes = [];

        var that = this;
        $.ajax({
            type: "GET",
            url: PictionaryMobile.currentFolder + '/pictionary.mobile.view.html',
            success: function (picView) {
                if (isChoosenMobile) {
                    $('#page-content').css('height','100%');
                    $('#page-content').css('padding', '0');
                    that.updateTitle('Pictionary<div class="small">You are the drawer</div>');
                    that.updateContent(picView);
                    that.initChosenMobile(word);
                    that.initRules(isChoosenMobile);
                    that.initPalette();


                    let el = document.getElementById('canvasWrapper');

                    that.opts.aspectRatio = 1;
                    that.opts.width = el.clientWidth;
                    that.opts.height = that.opts.width * that.opts.aspectRatio;

                    that.canvas = document.createElement('canvas');

                    that.canvas.setAttribute('width', that.opts.width);
                    that.canvas.setAttribute('height', that.opts.height);
                    that.canvas.style.width = that.opts.width + 'px';
                    that.canvas.style.height = that.opts.height + 'px';

                    el.appendChild(that.canvas);
                    that.context = that.canvas.getContext('2d');

                    that.canvas.addEventListener('touchstart', function(e) {
                        that.startLine(e);
                    });

                    that.canvas.addEventListener('touchmove', function(e) {
                        that.drawLine(e);
                    });

                    that.canvas.addEventListener('touchend', function(e) {
                        that.endLine(e);
                    });
            
                } else {
                    that.updateTitle('Pictionary<div class="small">You are a finder !</div>');
                    that.updateContent(picView);
                    that.initRules(isChoosenMobile);
                    $('#toolbarFinder').css('display', 'flex');
                    $('#wordWrapper').hide();
                    $('#startPic').hide();
                    SocketManager.get().on('startPic', function () {
                        $('#responseWrapper').css('display', 'flex');
                    });
                    $('#sendResponse').on('click', function () {
                        var currentResponse = $('#response').val();

                        if (currentResponse !== "") {
                            that.getUserForCurrentGameAndPos()
                                .done(function (currentUser) {
                                    SocketManager.get().emit('proposeWord', currentResponse, currentUser);
                                    $('#response').val('');
                                })
                        }
                    });

                }
            }
        });
    }


    initChosenMobile(word){
        const that = this;
        $('#word').html(word);

        $('#startPic').on('click', function() {
            $('#pictionaryMobileContainer').show().css('display', 'flex');;
            SocketManager.get().emit('startPic');

            $('#wordPainting').html(word);
            $('#startPic').hide();
            that.initSocketPurposals();
            $('#page-title').hide();
            $('#wordWrapper').hide();

            $('#countdown').show();
            $('#current-progress').html(PictionaryMobile.initialCountDownValue);
            var countdownFunction = setInterval(function () {
                var countdownValue = parseInt($('#current-progress').text()) - 1;
                var currentProgress = countdownValue / PictionaryMobile.initialCountDownValue * 100;
                $('#current-progress').animate({
                    width: currentProgress + '%'
                }, 500);
                $('#current-progress').html(countdownValue);
                if(countdownValue == 0) {
                    $('#progress').hide();
                    $('#countdown-expired').show();
                    $('#pictionaryMobileContainer').hide();
                    SocketManager.get().emit('decreaseCountdown', 'EXPIRED');
                    clearInterval(countdownFunction);
                } else {
                    SocketManager.get().emit('decreaseCountdown', countdownValue - 1);
                }
            }, 1000);        });
    }

    initSocketPurposals() {
        SocketManager.get().on('proposal', function (response, user)  {
            $('#proposalPerson').html(user.name);
            $('#proposal').html(response);
            $('#modalProposal').modal();

            $('#validateProposal').on('click', function () {
                SocketManager.get().emit('endGame', user);
            });

            $('#refuseProposal').on('click',function() {
                SocketManager.get().emit('decline');
            })
        })
    }

    initPalette() {
        const that = this;
        var content = document.getElementById('palette-tool');
        $('#paletteTrigger').popover({
            title: 'Palette',
            placement: 'top',
            html: true,
            content: content
        })
        $('#linkPaletteTrigger').on('click',function() {
            if($('#linkPaletteTrigger').hasClass("opened")){
                $('#linkPaletteTrigger').removeClass("opened");
                $('#paletteTrigger').popover('hide');
            } else {
                $('#linkPaletteTrigger').addClass("opened");
                $('#paletteTrigger').popover('show');
            }

        });

        $('input[name="size"]').change(function () {
            that.opts.line.size = $(this).val();
        });

        $("#colorpicker").spectrum({
            color: that.opts.line.color,
            showPaletteOnly: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'more',
            togglePaletteLessText: 'less',
            palette: [
                ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ]
        });

        $("#colorpicker").change(function ()  {
            that.opts.line.color = $(this).val();
        });

        $('#clear').bind('click', function () {
            that.resetCanvas();
        });

    }

    initRules(isChoosenMobile){
        let rules = "";
        if(isChoosenMobile) {
            $('#rulesTrigger').attr('data-content','<div>Try to guess the word below by drawing it in the box below !</div>')           
        } else {
            $('#rulesTriggerFinder').attr('data-content','<div>Find the word drawn on the table and send your response with the field below !</div>')           
        }
    }

    getPointRelativeToCanvas (point) {
        return {
            x: point.x / this.canvas.width,
            y: point.y / this.canvas.height
        };
    }

    getCursorRelativeToCanvas (e) {
        var cur = {};

        cur.x = e.touches[0].pageX //- canvas.offsetLeft;
        cur.y = e.touches[0].pageY //- canvas.offsetTop;
                    
        return this.getPointRelativeToCanvas(cur);
    }

    getLineSizeRelativeToCanvas (size) {
        return size / this.canvas.width;
    }


    redraw () {
        this.clearCanvas();
        SocketManager.get().emit('isDrawing', this.strokes, 'black', 5);
        for (var i = 0; i < this.strokes.length; i++) {
            this.drawStroke(this.strokes[i]);
        }
    }


    startLine (e) {
        e.preventDefault();

        this.sketching = true;
        this.undos = [];        
        var cursor = this.getCursorRelativeToCanvas(e);
        this.strokes.push({
            points: [cursor],
            color: this.opts.line.color,
            size: this.getLineSizeRelativeToCanvas(this.opts.line.size),
            cap: this.opts.line.cap,
            join: this.opts.line.join,
            miterLimit: this.opts.line.miterLimit
        });
    }


    clearCanvas () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resetCanvas() {
        this.strokes = [];
        this.redraw();
        SocketManager.get().emit('clearCanvas');
    }

    drawLine (e) {
        if (!this.sketching) {
            return;
        }

        e.preventDefault();

        var cursor = this.getCursorRelativeToCanvas(e);
        this.strokes[this.strokes.length - 1].points.push({
            x: cursor.x,
            y: cursor.y
        });

        this.redraw();
    }

    endLine (e) {
        if (!this.sketching) {
            return;
        }

        e.preventDefault();

        this.sketching = false;
    }

    normalizePoint (point) {
        return {
            x: point.x * this.canvas.width,
            y: point.y * this.canvas.height
        };
    }


    normalizeLineSize (size) {
        return size * this.canvas.width;
    }

    drawStroke (stroke) {
        this.context.beginPath();
        for (var j = 0; j < stroke.points.length - 1; j++) {
            var start = this.normalizePoint(stroke.points[j]);
            var end = this.normalizePoint(stroke.points[j + 1]);

            this.context.moveTo(start.x, start.y);
            this.context.lineTo(end.x, end.y);
        }
        this.context.closePath();

        this.context.strokeStyle = stroke.color;
        this.context.lineWidth = this.normalizeLineSize(stroke.size);
        this.context.lineJoin = stroke.join;
        this.context.lineCap = stroke.cap;
        this.context.miterLimit = stroke.miterLimit;

        this.context.stroke();
    }
}