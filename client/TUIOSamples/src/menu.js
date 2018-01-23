/**
 * @author Kevin Duglué
 * @author Rémy Kaloustian
 */

 /*eslint-disable */

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

import showBoardView from './board';

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
    //Testing players addition
    const players = [
      {name:'Papalumbo', avatar:'1', score:0},
      {name:'RHRHRRH', avatar:'2', score:0},
      {name:'Zagogogadget', avatar:'3', score:0},
      {name:'Kastoulian', avatar:'4', score:0}
    ]
    showBoardView(players);
  });
 
}// buildMenu()



 /*eslint-enable */