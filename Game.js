/**
 * Class that holds all the functions related to the game logic.
 * @constructor
 * @param scene Scene being displayed.
 * @param player1 Entity controlling the red pieces.
 * @param player2 Entity controlling the green pieces.
 */
class Game {
	constructor(scene, player1, player2) {
		this.scene = scene;
		this.player1 = player1;
		this.player2 = player2;
		this.board = "[['0','0','.','0','0'],['0','.','.','.','0'],['.','.','0','.','.'],['0','.','.','.','0'],['0','0','.','0','0']]";
		this.boards = [this.board];
		this.moveCounter = 0;
		this.gameOver = false;
	};

	/**
	 * @method updateBoard
	 * Updates the board with the current state of the game.
	 * @param data Data received from the prolog request.
	 */
	updateBoard(data) {
		let response = data.target.response;
		if (response != 1) {
			this.board = data.target.response;
			this.boards[this.moveCounter + 1] = data.target.response;
		}
	}

	/**
	 * @method handleGameOver
	 * Checks if a player has won, if so, resets the game's board and move counter.
	 * @param data Data received from the prolog request.
	 */
	handleGameOver(data) {
		let response = data.target.response;
		if (response == 0) {
			this.gameOver = true;
			this.board = "[['0','0','.','0','0'],['0','.','.','.','0'],['.','.','0','.','.'],['0','.','.','.','0'],['0','0','.','0','0']]";
			this.boards = [this.board];
		}
	}

	/**
	 * @method undo
	 * Updates the current state of the game to the state it was in one turn earlier.
	 */
	undo() {
		if (this.moveCounter == 0)
			return;
		this.moveCounter--;
		this.board = this.boards[this.moveCounter];
	}

	/**
	 * @method placePiece
	 * Places a piece on the board, when done by a human player.
	 * @param row Row to position the piece in.
	 * @param column Column to position the piece in.
	 * @param player Player performing the placement.
	 */
	placePiece(row, column, player) {
		let boardIn = (' ' + this.board).slice(1);
		placePiece(this.board, row, column, player, data => this.updateBoard(data));
		gameOver(this.board, player, data => this.handleGameOver(data));
		return boardIn.localeCompare(this.board);
	}

	/**
	 * @method movePiece
	 * Moves a piece on the board, when done by a human player.
	 * @param row Row where the piece is located.
	 * @param column Column where the piece is located.
	 * @param newRow Row to move the piece to.
	 * @param newColumn Column to move the piece to.
	 * @param player Player performing the placement.
	 */
	movePiece(row, column, newRow, newColumn, player) {
		let boardIn = (' ' + this.board).slice(1);
		movePiece(this.board, row, column, newRow, newColumn, player, data => this.updateBoard(data));
		gameOver(this.board, player, data => this.handleGameOver(data));
		return boardIn.localeCompare(this.board);
	}

	/**
	 * @method getPlacementPosition
	 * Returns the position that the CPU player placed the piece on.
	 * @param board Current board to be updated with the CPU piece placement.
	 */
	getPlacementPosition(board) {
		let boardIn = (' ' + board).slice(1);
		let boardOut = (' ' + this.board).slice(1);
		boardIn = boardIn.replace(/['",\[\]]+/g, '');
		boardOut = boardOut.replace(/['",\[\]]+/g, '');
		let index = 0;
		for (let i = 0; i < boardIn.length; i++) {
			if (boardIn[i] != boardOut[i]) {
				index = i;
				break;
			}
		}
		return index;
	}

	/**
	 * @method getMovementPositions
	 * Returns the position that the CPU player moved the piece to.
	 * @param board Current board to be updated with the CPU piece movement.
	 */
	getMovementPositions(board) {
		let boardIn = (' ' + board).slice(1);
		let boardOut = (' ' + this.board).slice(1);
		boardIn = boardIn.replace(/['",\[\]]+/g, '');
		boardOut = boardOut.replace(/['",\[\]]+/g, '');
		let sourceTile;
		let destTile;
		for (let i = 0; i < boardIn.length; i++) {
			if (boardIn[i] != boardOut[i]) {
				if (boardIn[i] == '0' || boardIn[i] == '.')
					destTile = i;
				else
					sourceTile = i;
			}
		}
		return [sourceTile, destTile];
	}

	/**
	 * @method placePieceCPU
	 * Places a piece on the board, when done by a CPU player.
	 * @param player Player performing the placement.
	 * @param level Difficulty level of the bot.
	 */
	placePieceCPU(player, level) {
		let boardIn = (' ' + this.board).slice(1);
		placePieceCPU(this.board, player, level, data => this.updateBoard(data));
		gameOver(this.board, player, data => this.handleGameOver(data));
		return this.getPlacementPosition(boardIn);
	}

	/**
	 * @method movePieceCPU
	 * Moves a piece on the board, when done by a CPU player.
	 * @param player Player performing the placement.
	 * @param level Difficulty level of the bot.
	 */
	movePieceCPU(player, level) {
		let boardIn = (' ' + this.board).slice(1);
		movePieceCPU(this.board, player, level, data => this.updateBoard(data));
		gameOver(this.board, player, data => this.handleGameOver(data));
		return this.getMovementPositions(boardIn);
	}

};