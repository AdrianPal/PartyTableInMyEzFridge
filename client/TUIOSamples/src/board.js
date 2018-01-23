
 /*eslint-disable */

export default function showBoardView(players)
{
    $('#startView').remove();
    $('#app').append('<div id="boardView"> <h1>Let\'s play !</h1>'+
    '<div id="board"></div>'+
    '<div id="dice"><button>Roll the dice</button></div>'+

    '</div>');

    positionDice();

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

    $('#boardView').append('<div id="players"></div>');

    for (let index = 0; index < players.length; index++) {
    $('#players').append('<p>'+players[index].name +' - '+players[index].score +'</p><br>');     
    }

}

function positionDice()
{
    $('#dice').css('margin-left', ($(window).width() - $('#dice').width())/2);
}

    /*eslint-enable */
