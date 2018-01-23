/**
 * @author: Arnaud ZAGO
 * 
 */
import showBoardView from "../board";

export default function launchLabyrinth(players)
{
   $('#boardView').remove();
   $('#app').append('<br><br><h1>Don\'t get lost in the LABYRINTH !</h1>');
   players[1].score = 45;

   setTimeout(function()
    {
        //Get back to the board
        showBoardView(players);
    }, 1500);
}