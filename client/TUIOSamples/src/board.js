/**
 * @author Rémy KALOUSTIAN
 * 
 * Contains the actions related to the board view
 */

 /*eslint-disable */

let _players = []; //needed ? I dunno, maybe
let _currentPlayer;

//Called when switching from home to board OOOOR when finishing a game and going back to board view
export default function showBoardView(players)
{
    _players = players;
    _currentPlayer = null;
    $('#startView').remove();//Cleaning the screen
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
    addPlayers(players);
    determineCurrentPlayer(players);
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

function addPlayers(players)
{
    $('#boardView').append('<div id="players"></div>');
    //Showing the players' score
    for (let index = 0; index < players.length; index++) 
    {
        $('#players').append('<p>'+players[index].name +' - '+players[index].score +'</p><br>');     
    }

    //Adding the players to the board
    for (let index = 0; index < players.length; index++) 
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
    for (let index = 0; index < players.length; index++) 
    {
        $('#player'+index).css('left',startX );
        $('#player'+index).css('top', startY);
        startY += ($('#player'+index).height() + 10);        
    }
}//addPlayers()

function determineCurrentPlayer(players)
{
    _currentPlayer = null;
    for (let index = 0; index < players.length; index++) 
    {
        //The first player that has not played is the current player
        if(players[index].played == false)
        {
            _currentPlayer = index;
            break;
        }        
    }
    //If everyone played
    if(_currentPlayer == null)
    {
        _currentPlayer = 0; //the first player plays again
        for (let index = 1; index < players.length; index++) {
            players[index].played = false;            
        }
    }
}//determineCurrentPlayer

function turnPlayer()
{
    $('#dice p:first').text('It\'s '+_players[_currentPlayer].name +'\'s turn !' );
}


function rollDice()
{
    $('#diceResult').text(Math.floor(Math.random() * (7 - 1) + 1));
    $('#dice button').prop('disabled', true);
}
    /*eslint-enable */
