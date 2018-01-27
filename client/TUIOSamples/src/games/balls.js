/**
 * @author: Rémy KALOUSTIAN
 */
import BallContainer from 'tuiomanager/widgets/Library/LibraryStack/BallContainer';
import Ball from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/Ball';

import SocketManager from "../../socket.manager";


 import showBoardView from "../board";
 var socket = SocketManager.get();

 export default function launchBalls(players)
 {

    

    $('#boardView').remove();
    $('#app').append('<div id="ballsView"> </div>');
    //$('#ballsView').append('<br><br><h1>You lucky dude launched the BALLS game !</h1>');
    addBallContainers(players);
   
    players[1].score = 45;

   spawnBalls();

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
        }
        else if(index == 3)//right container
        {
             x = $(window).width() - ballContainerWidth;
             y = $(window).height()/ 2 - ballContainerHeight/2;
        }    
        addBallContainer(x,y,ballContainerWidth,'#FF3366', players[index].name);    
    }
 }

 function addBallContainer(x, y, width, color, name)
 {
    const libstack = new BallContainer(x, y, width, name, color, false, []);
    libstack.addTo($('#ballsView').get(0));
 }

 function spawnBalls()
 {
    window.setInterval(function()
    {
        const width = $(window).width();
        const height = $(window).height();
        const spawnX = Math.random() * (width - 0) + 0;
        const spawnY = Math.random() * (height - 0) + 0;
        const mahball = new Ball(spawnX, spawnY, 50, 50, 0, 1, '../../assets/joy.png');
        mahball.addTo($('#ballsView').get(0));

        socket.emit("balls",{stringO: 'Sendin dem balls'});
        console.log(socket);
    }, 1000);
 }