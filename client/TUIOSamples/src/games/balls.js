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

const config = require('../../config');

//import SocketManager from "../../socket.manager";


// import showBoardView from "../board";
 //var socket = SocketManager.get();

 let _colors = [];
 let _tags = ['03', '6D', '6C', 'B3'];
 let _containers = [];
 let _players = [];
 let _isGameOver = false;
 let _ballsCount = 0;
 let _gameTime = 3000; //in milliseconds
 let _ballsLifespan = 3500;
 let _bonusFrequency = 5000;
 let _winners = [];
 let _gameID = '';
 let _bonusHandler = {
     onBonusTouched: function(tag){
         console.log("Bonus Touched w/ tag "+ tag);
         for (let index = 0; index < _players.length; index++) {
            $('#bonusgainsound')[0].play();
             
             if(_players[index].tag == tag){                 
                _players[index].stack.addBalls(10);
             }
             else
             {
                 _players[index].stack.removeBalls(5);
             }
         }
     }
 };

 const BALLWIDTH = 75;
 const ballContainerWidth = 200;
 const ballContainerHeight = 200;

 export default function launchBalls(gameId)
 {
    User.remove();
    _gameID = gameId;

    //Just for tests
    let players = [
        {name:'Papalumbo', avatar:'1', score:0, x:0, y:0, played:false, color:'#088a00'},
        {name:'RHRHRRH', avatar:'2', score:0, x:0, y:0, played:false, color:'#0050ef'},
        {name:'Zagogogadget', avatar:'3', score:0, x:0, y:0, played:false, color:'#d80073'},
        {name:'Kastoulian', avatar:'4', score:0, x:0, y:0, played:false, color:'#fa6800'}
      ]

      //getting the REAL players
      $.get(config.server + '/api/user/' + gameId)
      .done(function (d) {
        console.log("PLayers : ");
        console.log(d);
        players = d;

        console.log("Launched balls");
        User.remove();

        $('#app').append('<div id="ballsView"> '+
        '<audio  id = "picksound"> <source src="../../assets/sound/picksound.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
        '<audio  id = "gameoversound"> <source src="../../assets/sound/gameover.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
        '<audio  id = "bonusspawnsound"> <source src="../../assets/sound/bonusspawn.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
        '<audio  id = "bonusgainsound"> <source src="../../assets/sound/bonusgain.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
        
        '</div>');

        $('#ballsView').append('<button id="tt">TT</button>');
        getPlayers(players);
    
        addBallContainers();
        addTimeBars();
        spawnBalls();
        spawnBonusBalls();
        setCountdown();
        triggerTime();

      })
      .fail(function (e) {
          alert('Error: can\'t get players.');
          console.log(e);
      });


    

   //test for adding balls count
   $('#tt').on('click', function()
    {
        //console.log("hey hey");
        /*for (let index = 0; index < _containers.length; index++) 
        {
            const mahball = new Ball(0, 0, 50, 50, 0, 1, '../../assets/ballt.png', _players[Math.floor(Math.random() * (_players.length))].color);
            _containers[index].addElementWidget(mahball);   
        }*/

        /*const mahball = new Ball(0, 0, 50, 50, 0, 1, '../../assets/ballt.png', '#FF6633', _players[2].name);
        _containers[0].addElementWidget(mahball);   */
        _bonusHandler.onBonusTouched(_tags[0]);        
    })

    /*setTimeout(function()
    {
        showBoardView(players);
    }, 150000000);*/
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
    //container.canRotate(false, false);
    //container.canMove(false, false);
    //container.canZoom(false, false);
   // container.canDelete(false, false);
    container.addTo($('#ballsView').get(0));
    _players[index].stack = container;
    //Just for the tests
    _containers.push(container);
    

/*
    --------    TESTS   - -----

    const mahball = new Ball(0, 0, 50, 50, 0, 1, '../../assets/ballt.png', '#FF3366');
    container.addElementWidget(mahball);
    */
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
            //const spawnX = Math.random() * ((width - BALLWIDTH)   - 0) + 0;
            //const spawnY = Math.random() * ((height- BALLWIDTH) - 0) + 0;
            const coords = getSpawnCoords();
            const spawnX = coords.x;
            const spawnY = coords.y;
			const index = Math.floor(Math.random() * (_players.length));
            const color = _players[index].color;
			const tag = _players[index].tag;

            const mahball = new Ball(spawnX, spawnY, BALLWIDTH, BALLWIDTH, 0, 1, '../../assets/ballt.png', color, _players[index].name);
			//const mahball = new ImageElementWidget(spawnX, spawnY, 50, 50, 0, 1, '../../assets/ballt.png');

            mahball.canRotate(false, false);
            mahball.canMove(true, true);
            mahball.canZoom(false, false);
            mahball.canDelete(false, false);        
			
            mahball.setTagMove(tag);
            mahball.addTo($('#ballsView').get(0));
			_ballsCount++;

                setTimeout( function()
				{ 
					//if(!mahball._isTouched)
					//{
						  mahball.destroy();
						_ballsCount--;
					//}
                  
                }  , _ballsLifespan );
                //socket.emit("balls",{stringO: 'Sendin dem balls'});
                //console.log(socket);
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
            //const spawnX = Math.random() * ((width - BALLWIDTH)   - 0) + 0;
            //const spawnY = Math.random() * ((height- BALLWIDTH) - 0) + 0;
            const coords = getSpawnCoords();
            const spawnX = coords.x;
            const spawnY = coords.y;
			const index = Math.floor(Math.random() * (_players.length));
            const color = _players[index].color;
			const tag = _players[index].tag;

            const mahball = new BonusBall(spawnX, spawnY, BALLWIDTH, BALLWIDTH, 0, 1, '../../assets/joy.png', color, _players[index].name, _bonusHandler);
			//const mahball = new ImageElementWidget(spawnX, spawnY, 50, 50, 0, 1, '../../assets/ballt.png');

            mahball.canRotate(false, false);
            mahball.canMove(true, true);
            mahball.canZoom(false, false);
            mahball.canDelete(false, false);        
			
            mahball.setTagMove(tag);
            mahball.addTo($('#ballsView').get(0));
            $('#bonusspawnsound')[0].play();
			_ballsCount++;

                setTimeout( function()
				{ 
					//if(!mahball._isTouched)
					//{
						  mahball.destroy();
						_ballsCount--;
					//}
                  
                }  , _ballsLifespan );
                //socket.emit("balls",{stringO: 'Sendin dem balls'});
                //console.log(socket);
        }//if
    }, _bonusFrequency);     //setIntervall()   
 }

 function getSpawnCoords()
 {
     let inc = 0;
    const width = $(window).width();
    const height = $(window).height();
    let areCoordsRight = false;
    let x = 0;
    let y = 0;
    while(!areCoordsRight)
    {
        ++inc;
        if(inc > 1000)
        {
            //break;
        }
        x = Math.random() * ((width - BALLWIDTH)   - 0) + 0;
        y = Math.random() * ((height- BALLWIDTH) - 0) + 0;
        //console.log("Generated "+ x + " and " + y);
        areCoordsRight = true;
        for (let index = 0; index < _containers.length; index++) 
        {
            if(!_containers[index].areCoordsRight(x, y, BALLWIDTH, ballContainerWidth))
            {
                areCoordsRight = false;
            }        
        }        
    }  
    //console.log("Coords right:  "+ x + " and " + y);
    

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
    //console.log("Part to remove is " + partToRemove);
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
                //console.log("HHHHAIIIT" + ('#' + _players[index].name + 'bar').css('height'));

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
            tag: _tags[index],//to get later through API
            score:0 //to get later through API
        }
    );
        
    }
    console.log(_players);
 }

 function displayGameOver()
 {
    $('#gameoversound')[0].play();
     
    //console.log("Game over");
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
    console.log("In showWinner()");
    console.log("_players = "+ _players);
    console.log("winner = " +winner);
    console.log("_players[winner] = ");
    console.log(_players[winner]);

    updateScores(winner);
    //console.log("Winner is " + winner.name + " with " + winner.stack._ballsCount);
 }

 function updateScores(winner)
 {
    
    console.log("In updateScores()");
    console.log("_players = "+ _players);
    console.log("winner = " +winner);
    console.log("_players[winner] = ");
    console.log(_players[winner]);   
    $.ajax({
        url: config.server + '/api/user/points',
        type: 'PUT',
        data: {
            userId: _players[winner].id,
            points: 5
        }
    });     
 }


 function backToBoard()
 {
     setTimeout(() => {
        console.log("Back to menu");
        new Home(_gameID);
     }, 4000);     
 }
 