/**
 * @author: Rémy KALOUSTIAN
 */
/* eslint-disable*/
import BallContainer from 'tuiomanager/widgets/Library/LibraryStack/BallContainer';
import Ball from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/Ball';
import ImageElementWidget from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/ImageElementWidget';


//import SocketManager from "../../socket.manager";


 import showBoardView from "../board";
 //var socket = SocketManager.get();

 let _colors = [];
 let _tags = [];
 let _containers = [];
 let _players = [];
 let _isGameOver = false;
 let _ballsCount = 0;
 let _gameTime = 30000; //in milliseconds

 const BALLWIDTH = 75;

 export default function launchBalls(players)
 {
    $('#boardView').remove();
    $('#app').append('<div id="ballsView"> <button id="tt">TT</button>'+
    '<audio  id = "picksound"> <source src="../../assets/sound/picksound.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
    '<audio  id = "gameoversound"> <source src="../../assets/sound/gameover.mp3" type="audio/mpeg">Your browser does not support the audio element. </audio>'+
    
    '</div>');
	  getTags();
    getPlayers(players);
  
    addBallContainers(players);
    spawnBalls();
    setCountdown();
	triggerTime();

   //test for adding balls count
   $('#tt').on('click', function()
    {
        console.log("hey hey");
        /*for (let index = 0; index < _containers.length; index++) 
        {
            const mahball = new Ball(0, 0, 50, 50, 0, 1, '../../assets/ballt.png', _players[Math.floor(Math.random() * (_players.length))].color);
            _containers[index].addElementWidget(mahball);   
        }*/

        const mahball = new Ball(0, 0, 50, 50, 0, 1, '../../assets/ballt.png', '#FF6633');
        _containers[3].addElementWidget(mahball);   
        
    })

    /*setTimeout(function()
    {
        showBoardView(players);
    }, 150000000);*/
 }

 function addBallContainers(players)
 {
    for (let index = 0; index < players.length; index++) 
    {
        const ballContainerWidth = 200;
        const ballContainerHeight = 200;
        let x = 0;
        let y = 0;
        let rotation = 0;
        if(index == 0)//top container
        {
             x = $(window).width()/ 2 - ballContainerWidth/2;
             y = 1;
			 rotation = 180;
            
        }

        else if(index == 1)//bottom container
        {
             x = $(window).width()/ 2 - ballContainerWidth/2;
             y = $(window).height() - ballContainerHeight;
        }

        else if(index == 2) //left container
        {
             x = 1;
             y = $(window).height()/ 2 - ballContainerHeight/2;
             rotation = 90;
        }
        else if(index == 3)//right container
        {
             x = $(window).width() - ballContainerWidth;
             y = $(window).height()/ 2 - ballContainerHeight/2;
             rotation = -90;
        }    
        addBallContainer(x,y,ballContainerWidth,_players[index].color, players[index].name, rotation, index);    
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

 function spawnBalls()
 {
    window.setInterval(function()
    {
        if(!_isGameOver && _ballsCount < 10)
        {

        
            const width = $(window).width();
            const height = $(window).height();
            const spawnX = Math.random() * ((width - BALLWIDTH)   - 0) + 0;
            const spawnY = Math.random() * ((height- BALLWIDTH) - 0) + 0;
			const index = Math.floor(Math.random() * (_players.length));
            const color = _players[index].color;
			const tag = _players[index].tag;

            const mahball = new Ball(spawnX, spawnY, BALLWIDTH, BALLWIDTH, 0, 1, '../../assets/ballt.png', color);
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
                  
                }  , 2300 );
                //socket.emit("balls",{stringO: 'Sendin dem balls'});
                //console.log(socket);
        }//if
    }, 100);     //setIntervall()   
 }//spawnBalls()

 function setCountdown()
 {
    setTimeout( function()
    { 
        _isGameOver = true;
        displayGameOver();
        showWinner();
    }  , _gameTime ); 
}

function triggerTime()
{
	  
	window.setInterval( function()
	{ 
		if(_gameTime>0)
		{
			_gameTime  -=  1000;
		
		
		for (let index = 0; index < _containers.length; index++) 
		{
			_containers[index].updateTime(_gameTime);
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
                name:players[index].name,
                color: players[index].color,
				tag: _tags[index]
        }
    );
        
    }
 }

 function displayGameOver()
 {
    $('#gameoversound')[0].play();
     
    console.log("Game over");
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



    console.log("Winner is " + winner.name + " with " + winner.stack._ballsCount);
 }

 function getTags()
 {

    //!!!! THIS SHOULD BE DONE IN MENU.JS
    //Get the tags from the server, but for right now
    _tags.push('10');
    _tags.push('7');
    _tags.push('7');
    _tags.push('7');
 }