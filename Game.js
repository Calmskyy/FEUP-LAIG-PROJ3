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
		this.moveCounter = 0;
		//startGame('human', 'human', 'false', data => this.initializeBoard(data));
	};

	updateBoard(data) {
		let response = data.target.response;
		if (response != 1)	
			this.board = data.target.response;
		console.log(this.board);	
	}

	placePiece(row, column, player) {
		let boardIn = (' ' + this.board).slice(1);
		placePiece(this.board, row, column, player,  data => this.updateBoard(data));
		return boardIn.localeCompare(this.board); 
	}

	movePiece(row, column, newRow, newColumn, player) {
		let boardIn = (' ' + this.board).slice(1);
		movePiece(this.board, row, column, newRow, newColumn, player,  data => this.updateBoard(data));
		return boardIn.localeCompare(this.board); 
	}

};