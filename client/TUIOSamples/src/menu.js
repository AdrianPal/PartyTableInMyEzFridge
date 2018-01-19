/**
 * @author Kevin Duglué
 * @author Rémy Kaloustian
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';
// Import ImageWidget
import ImageElementWidget from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/ImageElementWidget';
import VideoElementWidget from 'tuiomanager/widgets/ElementWidget/VideoElementWidget/VideoElementWidget';
// import LibraryBar from 'tuiomanager/widgets/Library/LibraryBar/LibraryBar';
import CircularMenu from 'tuiomanager/widgets/CircularMenu/CircularMenu';
import LibraryStack from 'tuiomanager/widgets/Library/LibraryStack/LibraryStack';
import MenuItem from 'tuiomanager/widgets/CircularMenu/MenuItem';
import { buildNoobWork } from './dev-test';

export default function buildMenu() {
  $('#app').append('<div id="startView"></div>');
  $('#startView').append('<h1> Party Table In my EZ Fridge </h1>');

  buildQRCodes();
 
}// buildMenu()

function buildQRCodes()
{
  $('#startView').append('<img src="../assets/qr.jpg" class="qrcode" id="qrcodeL"/>');
  $('#startView').append('<img src="../assets/qr.jpg" class="qrcode" id="qrcodeR"/>');
  $('#startView').append('<img src="../assets/qr.jpg" class="qrcode" id="qrcodeT"/>');
  $('#startView').append('<img src="../assets/qr.jpg" class="qrcode" id="qrcodeB"/>');

  $('#qrcodeR').css('top', ($(window).height() - $('#qrcodeR').height())/2 );
  $('#qrcodeL').css('top', ($(window).height() - $('#qrcodeL').height())/2 );
  $('#qrcodeT').css('left', ($(window).width() - $('#qrcodeT').width())/2 );
  $('#qrcodeB').css('left', ($(window).width() - $('#qrcodeB').width())/2 );
}
