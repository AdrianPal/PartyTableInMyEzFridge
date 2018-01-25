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

    const libstack = new BallContainer(600, 300, 300, 'ma stack', '#C9C9C9', false, []);
    libstack.addTo($('#ballsView').get(0));
    players[1].score = 45;
    setTimeout(function()
    {
        showBoardView(players);
    }, 1500);
 }