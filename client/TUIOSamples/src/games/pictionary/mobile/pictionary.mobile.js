import MobileHandler from '../../../mobile/mobile.handler'
import SocketManager from '../../../../socket.manager'


export default class PictionaryMobile extends MobileHandler {



    static get currentFolder() {
        return '/src/games/pictionary/mobile';
    }

    constructor(gameId, pos, isChoosenMobile, word) {
        super(gameId, pos);

        this.app = $('#app');
        this.context = null;
    
        var that = this;
        this.app.load(PictionaryMobile.currentFolder + '/pictionary.mobile.view.html', function () {
            if(isChoosenMobile){
                that.initChosenMobile(word);
                that.canvas = document.getElementById('pictionaryCanvas');
                that.canvas.height = document.body.clientHeight * 0.50;
                that.canvas.width = document.body.clientWidth * 0.90;
             

                that.width = that.canvas.height;
                that.height = that.canvas.width;  
        
                that.context = document.getElementById('pictionaryCanvas').getContext('2d');
                that.pointsEast = new Array();
                that.pointsNorth = new Array();
                that.pointsDrag = new Array();


                that.isPainting = false;

                that.isPaletteOpened = false;
                that.drawSize = 5;
                that.color = '#000000';
                that.startEventType = 'touchstart';
                that.moveEventType = 'touchmove';
                that.endEventType   = 'touchend';
                $('#instructionsField').append('Try to guess the word below by drawing it in the box below ! Accept or decline your opponent\'s purposes');        
            } else {
                $('#wordWrapper').hide();
                $('#startPic').hide();
                $('#instructionsField').append('Find the word drawn on the table and send your response with the field below !');
                SocketManager.get().on('startPic', function(){
                    $('#responseWrapper').css('display','flex');
                });


                $('#sendResponse').on('click', function() {
                    var currentResponse = $('#response').val();

                    if(currentResponse !== ""){
                        that.getUserForCurrentGameAndPos()
                            .done(function (currentUser) {
                                SocketManager.get().emit('proposeWord',currentResponse, currentUser);      
                                $('#response').val('');          
                        })
                    }
                });

            }

        });    
    }   


    initChosenMobile(word) {
        const that = this;
        $('#word').append(word);
        $('#startPic').on('click',function(){
            $('#pictionaryMobileContainer').show().css('display', 'flex');;
            SocketManager.get().emit('startPic');
            that.initCanvasEvent();
            that.initSocketPurposals();
            $('#startPic').hide();
            $('#countdown').show();
            $('#countdown').html("<span>90</span>");
            setInterval(function() {
                var countdownValue = parseInt($('#countdown').text());
                if(countdownValue == 0) {
                    $('#countdown').html('EXPIRED');
                    SocketManager.get().emit('decreaseCountdown','EXPIRED');
                } else {
                    $('#countdown').html(countdownValue - 1);
                    SocketManager.get().emit('decreaseCountdown',countdownValue - 1);
                }
            }, 1000)
        });

        
    }   

    initSocketPurposals(){
        SocketManager.get().on('proposal', function(response, user) {
            $('#proposalPerson').html(user.name);
            $('#proposal').html(response);
            $('#modalProposal').modal();

            $('#validateProposal').on('click', function(){
                SocketManager.get().emit('endGame', user);
            });
        })
    }


    initCanvasEvent() {
        const that = this;
        $("#pictionaryCanvas").bind(that.startEventType,function(e){
            that.isPainting = true;
            that.addPoint((e.pageX - this.offsetLeft) / that.width, (e.pageY - this.offsetTop) /that.height);
            that.refreshCanvas();
            SocketManager.get().emit('isDrawing', that.pointsEast,that.pointsNorth,that.pointsDrag, that.color, that.drawSize);
        });
    
        $("#pictionaryCanvas").bind(that.moveEventType,function(e){
            if(that.isPainting) {
                that.addPoint((e.pageX - this.offsetLeft) / that.width, (e.pageY - this.offsetTop) / that.height, true);
                that.refreshCanvas();    
                SocketManager.get().emit('isDrawing', that.pointsEast,that.pointsNorth,that.pointsDrag);
            }
        });
    
        $("#pictionaryCanvas").bind(that.endEventType,function(e){
            that.isPainting = false;
            that.pointsEast = new Array();
            that.pointsNorth = new Array();
            that.pointsDrag = new Array();
        });


        $('input[name="size"]').change(function() {
            that.drawSize = $(this).val();
        });
    
        $("#colorpicker").spectrum({
            color: that.color,
            showPaletteOnly: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'more',
            togglePaletteLessText: 'less',
            palette: [
                ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
                ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
                ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
                ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
            ]   
        });
    
        $("#colorpicker").change(function() {
            that.color = $(this).val();
        })
    
        $('#openPalette').bind('click', function() {
            that.isPaletteOpened = !that.isPaletteOpened;
            if(that.isPaletteOpened) {
                $('#palette-tool').css('display','inline-block');
                $('#chev').removeClass('fa-caret-right').addClass('fa-caret-left')
            }else {
                $('#palette-tool').css('display','none');
                $('#chev').removeClass('fa-caret-left').addClass('fa-caret-right')
            }
        });
    
        $('#clear').bind('click', function() {
            that.clear();
            SocketManager().get().emit('clearCanvas');
        });
    }


    addPoint(east, north, drag) {
        this.pointsEast.push(east);
        this.pointsNorth.push(north);
        this.pointsDrag.push(drag);
    }
    
     refreshCanvas() {
        this.context.strokeStyle = this.color;
        this.context.lineJoin = "round";
        this.context.lineWidth = this.drawSize;
    
        for(var i = 0; i < this.pointsEast.length; i++) {
            this.context.beginPath();
            if(this.pointsDrag[i] && i){
                this.context.moveTo(this.pointsEast[i-1] * this.width, this.pointsNorth[i-1] * this.height);
            }else{
                this.context.moveTo((this.pointsEast[i] * this.width) - 1, this.pointsNorth[i] * this.height);
            }
            this.context.lineTo(this.pointsEast[i] * this.width, this.pointsNorth[i] * this.height);
            this.context.closePath();
            this.context.stroke();   
        }
    }

    changeSize(radio) {
        drawSize = radio.value;
    }
    
    clear(){
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    }
}