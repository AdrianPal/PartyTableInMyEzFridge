
 /*eslint-disable */

let _players = [];
let _currentPlayer;

export default function showBoardView(players)
{
    _players = players;
    _currentPlayer = 0;
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
    turnPlayer();
}

function addPlayers(players)
{
    $('#boardView').append('<div id="players"></div>');
    //Showing the players' score
    for (let index = 0; index < players.length; index++) {
        $('#players').append('<p>'+players[index].name +' - '+players[index].score +'</p><br>');     
    }

    //Adding the players to the board
    for (let index = 0; index < players.length; index++) {
        //$('#viewBoard').append('<img id="player-"'+index +' src="../assets/avatars/>')     
    }
}

function addTiles(numberOfTiles)
{
    for (let index = 0; index < numberOfTiles; index++) {

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
    $('#board').append('<div class="boardTile" id="lastTile"></div>')

}

function initializeDice()
{
    $('#dice').css('margin-left', ($(window).width() - $('#dice').width())/2);
    $('#dice button').prop('disable', false);
    $('#dice button').on('click', rollDice);
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
