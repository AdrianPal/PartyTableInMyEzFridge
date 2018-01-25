/**
 * @author: Rémy KALOUSTIAN
 */
import BallContainer from 'tuiomanager/widgets/Library/LibraryStack/BallContainer';

 import showBoardView from "../board";

 export default function launchBalls(players)
 {
    $('#boardView').remove();
    $('#app').append('<div id="ballsView"> </div>');
    $('#ballsView').append('<br><br><h1>You lucky dude launched the BALLS game !</h1>');
    addBallContainers(players);
   
    players[1].score = 45;
    setTimeout(function()
    {
        showBoardView(players);
    }, 150000000);
 }

 function addBallContainers(players)
 {
    for (let index = 0; index < players.length; index++) 
    {
        const ballContainerWidth = 200;
        const ballContainerHeight = 200;
        let x = 0;
        let y = 0;
        if(index == 0)
        {
             x = $(window).width()/ 2 - ballContainerWidth;
             y = 10;
            
        }

        else if(index == 1)
        {
             x = $(window).width()/ 2 - ballContainerWidth;
             y = $(window).height() - ballContainerHeight;
        }

        else if(index == 2)
        {
             x = 10;
             y = $(window).height()/ 2 - ballContainerHeight;
        }
        else if(index == 3)
        {
             x = $(window).width() - ballContainerWidth;
             y = $(window).height()/ 2 - ballContainerHeight;
        }    
        addBallContainer(x,y,ballContainerWidth,'#FF3366', players[index].name);    
    }
 }

 function addBallContainer(x, y, width, color, name)
 {
    const libstack = new BallContainer(x, y, width, name, color, false, []);
    libstack.addTo($('#ballsView').get(0));
 }