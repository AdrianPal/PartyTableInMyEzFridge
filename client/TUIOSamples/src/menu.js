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

export default function buildMenu() {
  $('#app').append('<div id="startView"></div>');
  
  $('#startView').append('<h1 id="title"> Party Table In my EZ Fridge </h1>');

  //THIS IS A TEST BUTTON, just used to test animations and functions
  $('#startView').append('<button id="trigger">Trigger me</button>');  
  $('#trigger').click(function(){
    hideQRCode($('#qrcodeR'));
  });
  buildQRCodes();
 
}// buildMenu()



function buildQRCodes()
{

  $('#title').css('marginTop', ($(window).height() - $('#title').height())/2);

  $('#startView').append('<img src="../assets/qr.jpg" class="qrcode" id="qrcodeL"/>');
  $('#startView').append('<img src="../assets/qr.jpg" class="qrcode" id="qrcodeR"/>');
  $('#startView').append('<img src="../assets/qr.jpg" class="qrcode" id="qrcodeT"/>');
  $('#startView').append('<img src="../assets/qr.jpg" class="qrcode" id="qrcodeB"/>');

  $('#qrcodeR').css('top', ($(window).height() - $('#qrcodeR').height())/2 );
  $('#qrcodeL').css('top', ($(window).height() - $('#qrcodeL').height())/2 );
  $('#qrcodeT').css('left', ($(window).width() - $('#qrcodeT').width())/2 );
  $('#qrcodeB').css('left', ($(window).width() - $('#qrcodeB').width())/2 );
  
}

function hideQRCode(qrcode)
{
  qrcode.transition({ scale: 0, duration:'600' });
}


///Have to replace this shyte
var rot = 360;

setInterval(function(){ 
  $('#title').transition({ rotate: rot+'deg', duration:'10000' }, 'snap'); 
  rot +=360;  
  console.log("rotated"); 
}, 10000);
