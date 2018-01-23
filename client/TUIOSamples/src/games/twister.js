/**
 * @author: Adrian PALUMBO  
 */
import showBoardView from "../board";

export default function launchTwister(players)
{
   $('#boardView').remove();
   $('#app').append('<br><br><h1>Damn mah man, you in for the TWISTER game !</h1>');

   players[1].score = 45;

   setTimeout(function()
    {
        //Get back to the board
        showBoardView(players);
    }, 1500);
}