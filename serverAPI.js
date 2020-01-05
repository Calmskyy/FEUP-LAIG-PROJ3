/**
* Establishes a connection and sends a request to the prolog server.
* @param requestString Request to be executed on the server.
* @param onSuccess Function to be called if the request is a success.
* @param onError Function to be called if the connection fails.
* @param port Port used to connect to the server.
*/
function getPrologRequest(requestString, onSuccess, onError, port)
{
    var requestPort = port || 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, false);
    request.onload = onSuccess;
    request.onerror = onError || function(){console.log("Error waiting for response");};
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

/**
* Makes a request to the prolog server.
* @param request Request to be performed to the server.
* @param callback Response obtained from the server.
*/
function makeRequest(request, callback) {			
    getPrologRequest(request, callback);
}

/**
* Makes a request to the prolog server to place a piece on the board.
* @param boardin Board to place the piece on.
* @param row Row to position the piece in.
* @param column Column to position the piece in.
* @param player Player performing the placement.
* @param callback Response obtained from the server.
*/
function placePiece(boardin, row, column, player, callback) {

    let requestString = 'place([' + JSON.stringify(row) + ',' +
    JSON.stringify(column) + '],' + boardin +
    ',_,' + JSON.stringify(player) +
    ')';

    makeRequest(requestString, callback);
}

/**
* Makes a request to the prolog server to place a piece on the board, with CPU calculation to decide where to place it.
* @param boardin Board to place the piece on.
* @param player Player performing the placement.
* @param level Difficulty level to use on the calculation.
* @param callback Response obtained from the server.
*/
function placePieceCPU(boardin, player, level, callback) {

    let requestString = 'getCPUPlacement(' + boardin + ',' +
    JSON.stringify(player) + ',_,' + level + ')';

    makeRequest(requestString, callback);
}

/**
* Makes a request to the prolog server to move a piece on the board.
* @param boardin Board to place the piece on.
* @param row Row where the piece is located.
* @param column Column where the piece is located.
* @param newRow Row to move the piece to.
* @param newColumn Column to move the piece to.
* @param player Player performing the placement.
* @param callback Response obtained from the server.
*/
function movePiece(boardin, row, column, newRow, newColumn, player, callback) {

    let requestString = 'move([' + JSON.stringify(row) + ',' +
    JSON.stringify(column) + ',' + JSON.stringify(newRow) + ',' +
    JSON.stringify(newColumn) + '],' + boardin +
    ',_,' + JSON.stringify(player) +
    ')';

    makeRequest(requestString, callback);
}

/**
* Makes a request to the prolog server to move a piece on the board, with CPU calculation to decide where to place it.
* @param boardin Board to place the piece on.
* @param player Player performing the placement.
* @param level Difficulty level to use on the calculation.
* @param callback Response obtained from the server.
*/
function movePieceCPU(boardin, player, level, callback) {

    let requestString = 'choose_move(' + boardin + ',' +
    JSON.stringify(player) + ',_,' + level + ')';

    makeRequest(requestString, callback);
}

/**
* Makes a request to the prolog server to check for a game over condition.
* @param board Board to check for game over.
* @param player Player performing the check.
* @param callback Response obtained from the server.
*/
function gameOver(board, player, callback) {
    let requestString = 'game_over(' + board + ','
    + JSON.stringify(player) + ')';

    makeRequest(requestString, callback);
}
    