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

 export default function launchBalls(players)
 {

    

    $('#boardView').remove();
    $('#app').append('<div id="ballsView"> </div>');
    //$('#ballsView').append('<br><br><h1>You lucky dude launched the BALLS game !</h1>');
    getColors();
    getTags();
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
        addBallContainer(x,y,ballContainerWidth,_colors[index], players[index].name, rotation);    
    }
 }

 function addBallContainer(x, y, width, color, name, rotation)
 {
    const container = new BallContainer(x, y, width, name, color, false, [],rotation);
    //container.canRotate(false, false);
    //container.canMove(false, false);
    //container.canZoom(false, false);
   // container.canDelete(false, false);
    container.addTo($('#ballsView').get(0));
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
    }, 1000);
 }

 function getColors()
 {
    //Get colors from the server, but for right now

    _colors.push('#088a00');
    _colors.push('#0050ef');
    _colors.push('#d80073');
    _colors.push('#fa6800');
    
 }

 function getTags()
 {
    //Get the tags from the server, but for right now
    _tags.push('AA');
    _tags.push('BB');
    _tags.push('CC');
    _tags.push('DD');
    console.log(_tags);
 }