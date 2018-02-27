/**
 * @author: Rémy KALOUSTIAN
 */
/* eslint-disable*/
import BallContainer from 'tuiomanager/widgets/Library/LibraryStack/BallContainer';
import Ball from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/Ball';
import ImageElementWidget from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/ImageElementWidget';
import BonusBall from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/BonusBall';
import User from "../user/user";
import Home from '../home/home'
import Anywhere from '../tools/anywhere';

const config = require('../../config');

//Settings
 let PLAYSOUND = true;
 let _colors ;
 let _containers ;
 let _players;
 let _isGameOver;
 let _ballsCount ;
 let _gameTime; //in milliseconds
 let _ballsLifespan ;
 let _bonusFrequency;
 let _winners ;
 let _gameID;
 let _endAnywhere;

 const BALLWIDTH = 75;
 const ballContainerWidth = 200;
 const ballContainerHeight = 200;

 //Used when a bonus is touched w/ tangible
 let _bonusHandler = {
     onBonusTouched: function(tag){
         for (let index = 0; index < _players.length; index++) {
            if(PLAYSOUND){$('#bonusgainsound')[0].play();}
             
             if(_players[index].tag == tag){                 
                _players[index].stack.addBalls(3);
             }
             else
             {
                 _players[index].stack.removeBalls(2);
             }
         }
     }
 };

 export default function launchBalls(gameId)
 {
    User.remove();
    initialize();
    _gameID = gameId;

    //getting the REAL players
    $.get(config.server + '/api/user/' + gameId)
    .done(function (d) {
    
    let players = d;

    //Basic view and sounds
    $('#app').append('<div id="ballsView"> '+
    '<audio  id = "picksound"> <source src="../../assets/sound/picksound.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
    '<audio  id = "gameoversound"> <source src="../../assets/sound/gameover.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
    '<audio  id = "bonusspawnsound"> <source src="../../assets/sound/bonusspawn.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
    '<audio  id = "bonusgainsound"> <source src="../../assets/sound/bonusgain.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
    '<audio  id = "ballsmusic"> <source src="../../assets/sound/shootingstars.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
    '</div>');

    getPlayers(players);

    if(PLAYSOUND){ $('#ballsmusic')[0].play();}
    $('#ballsmusic').prop("volume", 0.3);
    
    addBallContainers();
    addTimeBars();
    spawnBalls();
    spawnBonusBalls();
    setCountdown();
    triggerTime();

    })
    .fail(function (e) {
        alert('Error: can\'t get players.');
    });
 }

 function initialize()
 {
     _colors = [];
     _containers = [];
     _players = [];
     _isGameOver = false;
     _ballsCount = 0;
     _gameTime = 30000; //in milliseconds
     _ballsLifespan = 3500;
     _bonusFrequency = 5000;
     _winners = [];
     _gameID = '';
     _endAnywhere = {};
 }

 function addBallContainers()
 {
    for (let index = 0; index < _players.length; index++) 
    {        
        let x = 0;
        let y = 0;
        let rotation = 0;
        if(_players[index].position == 'top')//top container
        {
             x = $(window).width()/ 2 - ballContainerWidth/2;
             y = 1;
			 rotation = 180;            
        }

        else if(_players[index].position == 'bottom')//bottom container
        {
             x = $(window).width()/ 2 - ballContainerWidth/2;
             y = $(window).height() - ballContainerHeight;
        }

        else if(_players[index].position == 'left') //left container
        {
             x = 1;
             y = $(window).height()/ 2 - ballContainerHeight/2;
             rotation = 90;
        }
        else if(_players[index].position == 'right')//right container
        {
             x = $(window).width() - ballContainerWidth;
             y = $(window).height()/ 2 - ballContainerHeight/2;
             rotation = -90;
        }    
        addBallContainer(x,y,ballContainerWidth,_players[index].color, _players[index].name, rotation, index);    
    }
 }

 function addBallContainer(x, y, width, color, name, rotation, index)
 {
    const container = new BallContainer(x, y, width, name, color, false, ['Ball'],rotation, _gameTime);
   
    container.addTo($('#ballsView').get(0));
    _players[index].stack = container;
    _containers.push(container);
    _players[index].stack.showImg(config.server + '/' +_players[index].img);
 }

 function addTimeBars()
 {
     for (let index = 0; index < _players.length; index++)
     {
         $('#ballsView').append('<p><progress class="timeBar" id="'+_players[index].name +'bar" value="100" max="100"></progress></p>');
         $('.timeBar').width(ballContainerWidth);

         if(_players[index].position == 'top')
         {
            $('#' + _players[index].name + 'bar').css('left', _players[index].stack.x - ballContainerWidth +72);
            $('#' + _players[index].name + 'bar').css('top', _players[index].stack.y + 70);
            $('#' + _players[index].name + 'bar').css('transform', 'rotate(90deg)');
        }
         else if(_players[index].position == 'bottom')
         {
            $('#' + _players[index].name + 'bar').css('left', _players[index].stack.x + 130);
            $('#' + _players[index].name + 'bar').css('top', _players[index].stack.y+75);
            $('#' + _players[index].name + 'bar').css('transform', 'rotate(-90deg)');
         }
         else if(_players[index].position == 'left')
         {
            $('#' + _players[index].name + 'bar').css('top', _players[index].stack.y + ballContainerWidth+3);           
            $('#' + _players[index].name + 'bar').css('left', _players[index].stack.x);
         }
         else if(_players[index].position == 'right')
         {
            $('#' + _players[index].name + 'bar').css('left', _players[index].stack.x);
            $('#' + _players[index].name + 'bar').css('top', _players[index].stack.y-55);           
            $('#' + _players[index].name + 'bar').css('transform', 'rotate(180deg)');
         }         
     }
 }

 function spawnBalls()
 {
    window.setInterval(function()
    {
        if(!_isGameOver && _ballsCount < 10)
        {        
            const width = $(window).width();
            const height = $(window).height();          
            const coords = getSpawnCoords();
            const spawnX = coords.x;
            const spawnY = coords.y;
			const index = Math.floor(Math.random() * (_players.length));
            const color = _players[index].color;
			const tag = _players[index].tag;

            const mahball = new Ball(spawnX, spawnY, BALLWIDTH, BALLWIDTH, 0, 1, '../../assets/ballt.png', color, _players[index].name);
            mahball.canRotate(false, false);
            mahball.canMove(true, true);
            mahball.canZoom(false, false);
            mahball.canDelete(false, false);        
            mahball.setTagMove(tag);
            mahball.addTo($('#ballsView').get(0));

			_ballsCount++;

            setTimeout( function()
            { 
                mahball.destroy();
                _ballsCount--;              
            }  , _ballsLifespan );                
        }//if
    }, 100);     //setIntervall()   
 }//spawnBalls()

 function spawnBonusBalls()
 {
    window.setInterval(function()
    {
        if(!_isGameOver)
        {        
            const width = $(window).width();
            const height = $(window).height();            
            const coords = getSpawnCoords();
            const spawnX = coords.x;
            const spawnY = coords.y;
			const index = Math.floor(Math.random() * (_players.length));
            const color = _players[index].color;
            const tag = _players[index].tag;
            const mahball = new BonusBall(spawnX, spawnY, BALLWIDTH, BALLWIDTH, 0, 1, '../../assets/bonusicon.png', color, _players[index].name, _bonusHandler);

            mahball.canRotate(false, false);
            mahball.canMove(true, true);
            mahball.canZoom(false, false);
            mahball.canDelete(false, false);        
            mahball.setTagMove(tag);
            mahball.addTo($('#ballsView').get(0));

            if(PLAYSOUND) {   $('#bonusspawnsound')[0].play();}

			_ballsCount++;

            setTimeout( function()
            { 
                mahball.destroy();
                _ballsCount--;
            }  , _ballsLifespan );            
        }//if
    }, _bonusFrequency);     //setIntervall()   
 }

 function getSpawnCoords()
 {
    const width = $(window).width();
    const height = $(window).height();
    let areCoordsRight = false;
    let x = 0;
    let y = 0;

    while(!areCoordsRight)
    {        
        x = Math.random() * ((width - BALLWIDTH)   - 0) + 0;
        y = Math.random() * ((height- BALLWIDTH) - 0) + 0;
        areCoordsRight = true;

        for (let index = 0; index < _containers.length; index++) 
        {
            if(!_containers[index].areCoordsRight(x, y, BALLWIDTH, ballContainerWidth))
            {
                areCoordsRight = false;
            }        
        }        
    }  
     return {x:x, y:y};
 }

function setCountdown()
{
    setTimeout( function()
    { 
        _isGameOver = true;
        displayGameOver();
        showWinner();
        backToBoard();
    }  , _gameTime ); 
}

function triggerTime()
{	  
    const partToRemove = $('#' + _players[0].name + 'bar').val()/(_gameTime/1000);
	window.setInterval( function()
	{ 
        const frameTime = 1000
		if(_gameTime>0)
		{
			_gameTime  -=  frameTime;		
		
            for (let index = 0; index < _containers.length; index++) 
            {
                _containers[index].updateTime(frameTime);
            }
		
            for (let index = 0; index < _players.length; index++)
            {

                const sub = 100 * (frameTime/_gameTime)
                $('#' + _players[index].name + 'bar').val($('#' + _players[index].name + 'bar').val() - partToRemove);
            }
		}		
	}  , 1000 );	
}

 function getPlayers(players)
 {
    for (let index = 0; index < players.length; index++) 
    {
        _players.push(
        {
            id:players[index]._id,
            name:players[index].name,
            color: players[index].color,
            position:players[index].pos,
            tag: players[index].tangible,//to get later through API
            score:0, //to get later through API
            img:players[index].avatarPath
        }        
    );        
    }
 }

 function displayGameOver()
 {
    $('#ballsmusic')[0].pause();
    if(PLAYSOUND){$('#gameoversound')[0].play();}     
 }

 function showWinner()
 {
    let winner  = 0;
    //finding the winner
    for (let index = 1; index < _players.length; index++) 
    {
        if(_players[index].stack._ballsCount > _players[winner].stack._ballsCount)
        {
            winner = index;
        }        
    }

    //Display "you win" , "you lose"
    for (let index = 0; index < _players.length; index++) 
    {
        if(index === winner )
        {
            _players[index].stack.showOutcome(true);
        }    
        else
        {
            _players[index].stack.showOutcome(false);
        }    
    }
    updateScores(winner);
 }

 function updateScores(winner)
 {
    $.ajax({
        url: config.server + '/api/user/points',
        type: 'PUT',
        data: {
            userId: _players[winner].id,
            points: 5
        }
    });     
 }

 function clickAnywhere()
 {
     console.log("Clicked the anywhere");
     _endAnywhere.deleteWidget();
    $('#ballsView').remove();
    new Home(_gameID);
 }

 function backToBoard()
 {
     setTimeout(() => {
     $('#ballsView').append('<h1 id="touch1">Touch anywhere to go back to the menu</h1>');
         
        _endAnywhere = new Anywhere(this, clickAnywhere);
     }, 4000);    
 }
 