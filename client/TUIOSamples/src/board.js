
 /*eslint-disable */

let _players = []; //needed ? I dunno, maybe
let _currentPlayer;

export default function showBoardView(players)
{
    _players = players;
    _currentPlayer = null;
    $('#startView').remove();
    $('#app').append('<div id="boardView"> <h1>Let\'s play !</h1>'+
    '<div id="board"></div>'+
    '<div id="dice"><p></p><br><p id="diceResult"></p><br><button>Roll the dice</button></div>'+
    '</div>');

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
    $('#dice').css('margin-left', ($(window).width() - $('#dice').width())/2);
    $('#dice button').prop('disable', false);
    $('#dice button').on('click', rollDice);
}
function addTiles(numberOfTiles)
{
    for (let index = 0; index < numberOfTiles; index++) 
    {

        $('#board').append('<div class="boardTile"></div>');
        if(index % 2 != 0)
        {
            $('.boardTile').last().css('background-color', '#F44336');

        }
        else 
        {
            $('.boardTile').last().css('background-color', '#F48FB1');
        }   
    }
    $('#board').append('<div class="boardTile" id="lastTile"></div>');
}

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
        $('#boardView').append('<img width="50" class="playerAvatar" id="player-"'+index +'" src="../assets/avatars/'+ index +'.jpg">')     
    }

    $('.playerAvatar').height($('#board div').height()/5);
    $('.playerAvatar').width($('#board div').height()/5);

}

function determineCurrentPlayer(players)
{
    _currentPlayer = null;
    for (let index = 0; index < players.length; index++) 
    {
        if(players[index].played == false)
        {
            _currentPlayer = index;
            break;
        }        
    }

    if(_currentPlayer == null)
    {
        _currentPlayer = 0;
        for (let index = 1; index < players.length; index++) {
            players[index].played = false;            
        }
    }
}

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
