/**
 * @author: Thomas GILLOT
 */
import showBoardView from "../board";

export default function launchPictionary(players)
{
   $('#boardView').remove();
   $('#app').append('<br><br><h1>How about some PICTIONARY game !</h1>');

   players[1].score = 45;

   setTimeout(function()
    {
        //Get back to the board
        showBoardView(players);
    }, 1500);
}