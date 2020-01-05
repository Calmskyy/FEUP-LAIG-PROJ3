/**
 * Class that holds all the functions related to the game logic
 * @constructor
 * @param scene blahblah
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

	updateBoard(data) {
		let response = data.target.response;
		if (response != 1) {
			this.board = data.target.response;
			this.boards[this.moveCounter + 1] = data.target.response;
		}
		console.log(this.board);
	}

	handleGameOver(data) {
		let response = data.target.response;
		if (response == 0) {
			this.gameOver = true;
			this.board = "[['0','0','.','0','0'],['0','.','.','.','0'],['.','.','0','.','.'],['0','.','.','.','0'],['0','0','.','0','0']]";
			this.moveCounter = 0;
			this.boards = [this.board];
		}
	}

	undo() {
		if (this.moveCounter == 0)
			return;
		this.moveCounter--;
		this.board = this.boards[this.moveCounter];
	}

	placePiece(row, column, player) {
		let boardIn = (' ' + this.board).slice(1);
		placePiece(this.board, row, column, player, data => this.updateBoard(data));
		gameOver(this.board, player, data => this.handleGameOver(data));
		return boardIn.localeCompare(this.board);
	}

	movePiece(row, column, newRow, newColumn, player) {
		let boardIn = (' ' + this.board).slice(1);
		movePiece(this.board, row, column, newRow, newColumn, player, data => this.updateBoard(data));
		gameOver(this.board, player, data => this.handleGameOver(data));
		return boardIn.localeCompare(this.board);
	}

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
		// let column = (index) % 5 + 1;
		// let row = Math.floor((index) / 5) + 1;
		// return [row, column];
		return index;
	}

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
		// let column = (index) % 5 + 1;
		// let row = Math.floor((index) / 5) + 1;
		// return [row, column];
		console.log(sourceTile, destTile)
		return [sourceTile, destTile];
	}

	placePieceCPU(player, level) {
		let boardIn = (' ' + this.board).slice(1);
		placePieceCPU(this.board, player, level, data => this.updateBoard(data));
		gameOver(this.board, player, data => this.handleGameOver(data));
		return this.getPlacementPosition(boardIn);
	}

	movePieceCPU(player, level) {
		let boardIn = (' ' + this.board).slice(1);
		movePieceCPU(this.board, player, level, data => this.updateBoard(data));
		gameOver(this.board, player, data => this.handleGameOver(data));
		return this.getMovementPositions(boardIn);
	}

};