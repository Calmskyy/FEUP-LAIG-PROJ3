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

		startGame('human', 'human', 'false', data => this.initializeBoard(data));
	};

	initializeBoard(data) {
		console.log('yoyoyo');
		console.log(data);
	}

};