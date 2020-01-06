/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.sceneGUI = new dat.GUI();
        this.gameGUI = new dat.GUI();

        this.initKeys();

        return true;
    }

    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    /**
     * Initializes the scene menu.
     */
    initSceneGUI() {
        this.sceneGUI.destroy();
        this.sceneGUI = new dat.GUI();
        this.sceneGUI.add(this.scene, 'scaleFactor', 0.1, 15).name('Scale Factor');
    }

    /**
     * Initializes the game menu, containing various options/buttons to interact with the game.
     */
    initGameGUI() {
        this.gameGUI.destroy();
        this.gameGUI = new dat.GUI();
        this.gameGUI.add(this.scene, 'displayRules').name('Rules');
        this.gameGUI.add(this.scene, 'automaticCameraChange').name('Automatic Camera');
        this.gameGUI.add(this.scene, 'playingOption', this.scene.playingOptions).name('Game Mode').onChange(this.scene.updateGameMode.bind(this.scene));
        this.gameGUI.add(this.scene, 'difficulty', this.scene.difficulties).name('Difficulty').onChange(this.scene.updateDifficulty.bind(this.scene));
        this.gameGUI.add(this.scene, 'turnTime', 5, 30).name('Turn Time');
        this.gameGUI.add(this.scene, 'timeLeft').name('Time Left').listen();
        this.gameGUI.add(this.scene, "startGame").name('Start Game');
        this.gameGUI.add(this.scene, "forfeit").name('Forfeit');
        this.gameGUI.add(this.scene, "score").name('Score').listen();
        this.gameGUI.add(this.scene, "undo").name('Undo Turn');
        this.gameGUI.add(this.scene, "playMovie").name('Replay Selected Game');
        this.movieSelection = this.gameGUI.add(this.scene, 'selectedMovie', this.scene.movieNames).name('Select Movie');
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    /**
     * Updates the movie selection option to contain the newest movie recorded.
     */
    updateMovieSelection() {
        this.gameGUI.remove(this.movieSelection);
        this.movieSelection = this.gameGUI.add(this.scene, 'selectedMovie', this.scene.movieNames).name('Select Movie');
    }

    /**
     * Initializes the view selection upon reading how many views are defined in the XML file.
     */
    addViews() {
        this.sceneGUI.add(this.scene, 'selectedView', this.scene.viewIDs).name('Selected View').onChange(this.scene.updateCamera.bind(this.scene));
    }

    /**
     * Initializes the theme selection upon reading how many different XML files are loaded.
     */
    addThemes() {
        this.sceneGUI.add(this.scene, 'selectedTheme', this.scene.themeIDs).name('Selected Theme').onChange(this.scene.updateTheme.bind(this.scene));
    }

    /**
     * Adds the option to enable a specific light upon reading how many lights are defined in the XML file.
     * @param i Index of the light being added.
     * @param lightName Name given to the light on the XML file.
     */
    addLight(i, lightName) {
        var variableName = 'enableLight' + (i + 1);
        this.sceneGUI.add(this.scene, variableName).name(lightName).onChange(this.scene.updateLights.bind(this.scene));
    }
}