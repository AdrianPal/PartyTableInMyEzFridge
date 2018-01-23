/**
 * @author Rémy KALOUSTIAN * 
 * Contains the actions related to the board view
 */

import launchBalls from './games/balls';
import launchTwister from './games/twister';
import launchLabyrinth from './games/labyrinth';
import launchPictionary from './games/pictionary';


 /*eslint-disable */

let _players = []; 
let _currentPlayer;

let _games = [
    {launch:function(){
        launchPictionary(_players);
    }},
    {launch:function(){
        launchTwister(_players);
    }},
    {launch:function(){
        launchLabyrinth(_players);
    }},
    {launch:function(){
        launchBalls(_players);
    }},
];

//Called when switching from home to board OOOOR when finishing a game and going back to board view
export default function showBoardView(players)
{
    _players = players;
    _currentPlayer = null;
    $('#app').empty();//Cleaning the screen
    //Displaying the basic html for the board view
    $('#app').append('<div id="boardView"> <h1>Let\'s play !</h1>'+
    '<div id="board"></div>'+
    '<div id="dice"><p></p><br><p id="diceResult"></p><br><button>Roll the dice</button></div>'+
    '</div>');

    //Stylish entry animation of the board
    $('#boardView').css('margin-left', $(window).width());
    $('#boardView').transition({x:-$(window).width()});

    initializeDice();
    addTiles(10);
    addPlayers();
    determineCurrentPlayer();
    turnPlayer();
}


function initializeDice()
{
    //Putting the dice at the center
    $('#dice').css('margin-left', ($(window).width() - $('#dice').width())/2);
    $('#dice button').prop('disable', false);
    $('#dice button').on('click', rollDice);
}//initializeDice

function addTiles(numberOfTiles)
{
    for (let index = 0; index < numberOfTiles; index++) 
    {
        $('#board').append('<div class="boardTile"></div>');
        //Switching colors to distinguish the deifferent tiles
        if(index % 2 != 0)
        {
            $('.boardTile').last().css('background-color', '#F44336');
        }
        else 
        {
            $('.boardTile').last().css('background-color', '#F48FB1');
        }   
    }
    //Adding the arrival tile
    $('#board').append('<div class="boardTile" id="lastTile"></div>');
}//addTiles()

function addPlayers()
{
    $('#boardView').append('<div id="players"></div>');
    //Showing the players' score
    for (let index = 0; index < _players.length; index++) 
    {
        $('#players').append('<p>'+_players[index].name +' - '+_players[index].score +'</p><br>');     
    }

    //Adding the players to the board
    for (let index = 0; index < _players.length; index++) 
    {
        $('#boardView').append('<img width="50" class="playerAvatar" id="player'+index +'" src="../assets/avatars/'+ index +'.jpg">')     
    }

    //Setting dimensions of the players
    $('.playerAvatar').height($('#board div').height()/5);
    $('.playerAvatar').width($('#board div').height()/5);
    $('.playerAvatar').css('margin-left', '1%');

    let startX = $('#board').css('margin-left');
    let startY = $('#board').offset().top;
    
    //Positioning the players 
    for (let index = 0; index < _players.length; index++) 
    {
        $('#player'+index).css('left',startX );
        $('#player'+index).css('top', startY);
        startY += ($('#player'+index).height() + 10);        
    }
}//addPlayers()

function determineCurrentPlayer()
{
    _currentPlayer = null;
    for (let index = 0; index < _players.length; index++) 
    {
        //The first player that has not played is the current player
        if(_players[index].played == false)
        {
            _currentPlayer = index;
            break;
        }        
    }
    //If everyone played
    if(_currentPlayer == null)
    {
        _currentPlayer = 0; //the first player plays again
        for (let index = 1; index < _players.length; index++) {
            _players[index].played = false;            
        }
    }
}//determineCurrentPlayer

function turnPlayer()
{
    $('#dice p:first').text('It\'s '+_players[_currentPlayer].name +'\'s turn !' );
}


function rollDice()
{
    let result = Math.floor(Math.random() * (7 - 1) + 1);
    $('#diceResult').text(result);
    $('#dice button').prop('disabled', true);
    let moveDuration = 1000;
    movePlayer(result, moveDuration);
    setTimeout(function()
    {
        launchGame();
    }, moveDuration*2);
}


function movePlayer(diceResult, moveDuration)
{
    let movement = $('.boardTile:first').width() * diceResult;
    $('#player' + _currentPlayer).transition({x:movement, delay:500}, moveDuration);
}

function launchGame()
{
    const pickedGame =  Math.floor(Math.random() * (_games.length) + 0);

    _games[pickedGame].launch();
}

    /*eslint-enable */
