/**
 * @author: Rémy KALOUSTIAN
 */

 import showBoardView from "../board";

 export default function launchBalls(players)
 {
    $('#boardView').remove();
    $('#app').append('<br><br><h1>You lucky dude launched the BALLS game !</h1>');

    players[1].score = 45;
    setTimeout(function()
    {
        showBoardView(players);
    }, 1500);
 }