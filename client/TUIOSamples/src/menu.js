/**
 * @author Kevin Duglué
 * @author Rémy Kaloustian
 */

// Import JQuery
//import $ from 'jquery/dist/jquery.min';
//import transition from 'jquery.transit';

// Import ImageWidget
import ImageElementWidget from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/ImageElementWidget';
import VideoElementWidget from 'tuiomanager/widgets/ElementWidget/VideoElementWidget/VideoElementWidget';
// import LibraryBar from 'tuiomanager/widgets/Library/LibraryBar/LibraryBar';
import CircularMenu from 'tuiomanager/widgets/CircularMenu/CircularMenu';
import LibraryStack from 'tuiomanager/widgets/Library/LibraryStack/LibraryStack';
import MenuItem from 'tuiomanager/widgets/CircularMenu/MenuItem';



//fonction appelée dans index.js, le script de base de la page
export default function buildMenu() 
{
  $('#app').append('<div id="startView"></div>'); //On ajoute la vue de départ
  
  //Ajout du html qui était précédemment dans index.html
  $('#startView').append('<h1 id="title"> Party Table In my EZ Fridge </h1>'+
  ' <div id="main">'+
  '   <button class="btn btn-primary" id="newGame">New game</button>'+

  '   <button class="btn btn-success d-none" id="addUser">Add participant</button>'+

  '   <div id="users"></div>'+
  ' </div>'
);

  //THIS IS A TEST BUTTON, just used to test animations and functions
  $('#app').append('<button id="trigger">Trigger me</button>');  
  $('#trigger').click(function()
  {
    showBoardView();
  });
 
}// buildMenu()

function showBoardView(players)
{
  $('#startView').remove();
  $('#app').append('<div id="boardView"> <h1>Let\'s play !</h1>'+
    '<div id="board"></div>'+
  
  '</div>');
  
  for (let index = 0; index < 10; index++) {
  
   $('#board').append('<div class="boardTile"></div>');
   if(index%2 != 0)
   {
    $('.boardTile').last().css('background-color', '#F44336');

   }
   else 
   {
    $('.boardTile').last().css('background-color', '#F48FB1');

   }
    
  }
}

