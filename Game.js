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

		//startGame('human', 'human', 'false', data => this.initializeBoard(data));
	};

	initializeBoard(data) {
		console.log(this.board);	
		this.board = data.target.response;
		console.log(this.board);	
	}

	placePiece(row, column, player) {
		placePiece(this.board, this.board, row, column, player,  data => this.initializeBoard(data));
	}

};