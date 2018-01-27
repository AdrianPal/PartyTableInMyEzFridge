/**
 * @author: Rémy KALOUSTIAN
 */
import BallContainer from 'tuiomanager/widgets/Library/LibraryStack/BallContainer';
import Ball from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/Ball';

//import SocketManager from "../../socket.manager";


 import showBoardView from "../board";
 //var socket = SocketManager.get();

 let _colors = [];
 let _tags = [];
 let _containers = [];
 let _players = [];
 let _isGameOver = false;

 export default function launchBalls(players)
 {
    $('#boardView').remove();
    $('#app').append('<div id="ballsView"> <button id="tt">TT</button></div>');
    getPlayers(players);
    getTags();
    addBallContainers(players);
    spawnBalls();
    setCountdown();

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
             rotation = -90;
        }
        else if(index == 3)//right container
        {
             x = $(window).width() - ballContainerWidth;
             y = $(window).height()/ 2 - ballContainerHeight/2;
             rotation = 90;
        }    
        addBallContainer(x,y,ballContainerWidth,_players[index].color, players[index].name, rotation,_players[index].name, index);    
    }
 }

 function addBallContainer(x, y, width, color, name, rotation,playerid, index)
 {
    const container = new BallContainer(x, y, width, name, color, false, [],rotation,'player'+playerid);
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
        if(!_isGameOver)
        {

        
            const width = $(window).width();
            const height = $(window).height();
            const spawnX = Math.random() * (width - 0) + 0;
            const spawnY = Math.random() * (height - 0) + 0;
            const color = _players[Math.floor(Math.random() * (_players.length))].color;
            const mahball = new Ball(spawnX, spawnY, 50, 50, 0, 1, '../../assets/ballt.png', color);
            mahball.canRotate(false, false);
            mahball.canMove(true, false);
            mahball.canZoom(false, false);
            mahball.canDelete(false, false);        
            const tag = _tags[Math.floor(Math.random() * (_tags.length) )];
            mahball.setTagMove(tag);
            mahball.addTo($('#ballsView').get(0));

                setTimeout( function(){ 
                    mahball.destroy();
                }  , 5000 );
                //socket.emit("balls",{stringO: 'Sendin dem balls'});
                //console.log(socket);
        }//if
    }, 1000);     //setIntervall()   
 }//spawnBalls()

 function setCountdown()
 {
    setTimeout( function()
    { 
        _isGameOver = true;
        displayGameOver();
        showWinner();
    }  , 4000 ); 
}

 function getPlayers(players)
 {
    for (let index = 0; index < players.length; index++) 
    {
        _players.push(
        {
                name:players[index].name,
                color: players[index].color                 
        }
    );
        
    }
 }

 function displayGameOver()
 {
    console.log("Game over");
 }

 function showWinner()
 {
    let winner  =_players[0];
    for (let index = 1; index < _players.length; index++) 
    {
        if(_players[index].stack._ballsCount > winner.stack._ballsCount)
        {
            winner = _players[index];
        }        
    }

    console.log("Winner is " + winner.name + " with " + winner.stack._ballsCount);
 }

 function getTags()
 {

    //!!!! THSI SHOULD BE DONE IN MENU.JS
    //Get the tags from the server, but for right now
    _tags.push('AA');
    _tags.push('BB');
    _tags.push('CC');
    _tags.push('DD');
 }