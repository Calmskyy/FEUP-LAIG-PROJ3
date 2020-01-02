function getPrologRequest(requestString, onSuccess, onError, port)
{
    var requestPort = port || 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);
    request.onload = onSuccess;
    request.onerror = onError || function(){console.log("Error waiting for response");};
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

function makeRequest(request, callback) {			
    getPrologRequest(request, callback);
}

function startGame(player1, player2, cpuLevel, callback) {
    let requestString = 'start_game(' + JSON.stringify(0) + ',' + 
    JSON.stringify(0) + ')';

    makeRequest(requestString, callback);
    console.log('this is the callback %s\n', callback);
}

function placePiece(boardin, boardout, row, column, player, callback) {
    console.log(JSON.stringify(boardin))

    let requestString = 'place([' + JSON.stringify(row) + ',' +
    JSON.stringify(column) + '],' + boardin +
    ',_,' + JSON.stringify(player) +
    ')';

    makeRequest(requestString, callback);
    console.log('this is the callback %s\n', callback);
}
    