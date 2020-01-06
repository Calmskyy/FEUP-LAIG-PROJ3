var DEGREE_TO_RAD = Math.PI / 180;
const FPS = 30;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.enableTextures(true);

        this.viewIDs = new Object();
        this.themes = [];
        this.themeIDs = new Object();
        this.difficulties = ["Easy", "Medium", "Hard"];
        this.difficulty = "Medium";
        this.playingOptions = ["Player v Player", "Player v Bot", "Bot v Bot"];
        this.playingOption = "Player v Player";

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.displayRules = false;
        this.automaticCameraChange = true;
        this.scaleFactor = 1;
        this.turnTime = 20;
        this.selectedView = 0;
        this.selectedTheme = 0;
        this.score = "Red - 0 | 0 - Green";
        this.redWins = 0;
        this.greenWins = 0;
        this.redTurn = false;
        this.greenTurn = false;
        this.timeLeft = "Not In-Game";
        this.movie = [];
        this.movies = [];
        this.selectedMovie = -1;
        this.movieNames = [];
        this.gamesPlayed = 0;
        this.moviesStored = 0;
        this.pieceMoves = [];
        this.moviePlaying = -1;
        this.movieAnimation = 0;
        this.rules = new MyRules(this);

        this.enableLight1 = false;
        this.enableLight2 = false;
        this.enableLight3 = false;
        this.enableLight4 = false;
        this.enableLight5 = false;
        this.enableLight6 = false;
        this.enableLight7 = false;
        this.enableLight8 = false;

        this.cameras = [];
        this.updatingCamera = false;

        this.rtt = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(1000 / FPS);
    }


    /**
     * Initializes the scene cameras with the values read from the XML file.
     */
    initCameras(theme) {
        var i = 0;
        for (var key in theme.XML["cameras"]) {
            if (theme.XML["cameras"].hasOwnProperty(key)) {
                var details = theme.XML["cameras"][key];
                if (details.type == "perspective") {
                    var camera = new CGFcamera(details.angle, details.near, details.far, details.fromCoords, details.toCoords);
                    if (key == "greenView" || key == "thirdView")
                        camera._up = [0, -1, 0];
                    this.viewIDs[key] = i;
                    this.cameras[i] = camera;
                }
                else if (details.type == "ortho") {
                    var camera = new CGFcameraOrtho(details.left, details.right, details.bottom, details.top, details.near, details.far,
                        details.fromCoords, details.toCoords, details.upCoords);
                    this.viewIDs[key] = i;
                    this.cameras[i] = camera;
                }
            }
            i++;
        }
    }

    /**
     * Updates the scene camera used upon being changed in the interface.
     */
    updateCamera() {
        this.updateTicks = 0;
        this.updatingCamera = true;
        this.oldCamera = this.camera;
        this.newCamera = this.cameras[this.selectedView];
        this.cameraUpChange = [this.newCamera._up[0] - this.oldCamera._up[0], this.newCamera._up[1] - this.oldCamera._up[1], this.newCamera._up[2] - this.oldCamera._up[2]];
        this.cameraPositionChange = [this.newCamera.position[0] - this.oldCamera.position[0], this.newCamera.position[1] - this.oldCamera.position[1], this.newCamera.position[2] - this.oldCamera.position[2], this.newCamera.position[3] - this.oldCamera.position[3]];
        this.cameraTargetChange = [this.newCamera.target[0] - this.oldCamera.target[0], this.newCamera.target[1] - this.oldCamera.target[1], this.newCamera.target[2] - this.oldCamera.target[2], this.newCamera.target[3] - this.oldCamera.target[3]];
        this.tempCamera = new CGFcamera(this.oldCamera.fov, this.oldCamera.near, this.oldCamera.far, [this.oldCamera.position[0], this.oldCamera.position[1], this.oldCamera.position[2]], [this.oldCamera.target[0], this.oldCamera.target[1], this.oldCamera.target[2]]);
        this.tempCamera._up[0] = this.oldCamera._up[0];
        this.tempCamera._up[1] = this.oldCamera._up[1];
        this.tempCamera._up[2] = this.oldCamera._up[2];
    }

    /**
     * Updates the theme used upon being changed in the interface.
     */
    updateTheme() {
        this.viewIDs = new Object();
        this.initializeScene();
    }

    /**
     * Updates the lights being used upon being selected in the interface.
     */
    updateLights() {
        this.enabledLights = [this.enableLight1, this.enableLight2, this.enableLight3, this.enableLight4,
        this.enableLight5, this.enableLight6, this.enableLight7, this.enableLight8];
        for (var i = 0; i < this.lights.length; i++) {
            if (this.enabledLights[i] == true) {
                this.lights[i].setVisible(true);
                this.lights[i].enable();
            }
            else {
                this.lights[i].setVisible(false);
                this.lights[i].disable();
            }
            this.lights[i].update();
        }
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     * @param theme Theme whose lights will be initialized.
     */
    initLights(theme) {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in theme.XML["lights"]) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (theme.XML["lights"].hasOwnProperty(key)) {
                var light = theme.XML["lights"][key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setConstantAttenuation(light["attenuation"][0]);
                this.lights[i].setLinearAttenuation(light["attenuation"][1]);
                this.lights[i].setQuadraticAttenuation(light["attenuation"][2]);

                this.lights[i].setVisible(true);
                if (light[0]) {
                    this.lights[i].enable();
                    switch (i) {
                        case 0:
                            this.enableLight1 = true;
                            break;
                        case 1:
                            this.enableLight2 = true;
                            break;
                        case 2:
                            this.enableLight3 = true;
                            break;
                        case 3:
                            this.enableLight4 = true;
                            break;
                        case 4:
                            this.enableLight5 = true;
                            break;
                        case 5:
                            this.enableLight6 = true;
                            break;
                        case 6:
                            this.enableLight7 = true;
                            break;
                        case 7:
                            this.enableLight8 = true;
                            break;

                    }
                }
                else
                    this.lights[i].disable();

                this.lights[i].update();

                this.interface.addLight(i, key);

                i++;
            }
        }
        this.updateLights();
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    /**
     * Initializes the theme list with the themes that are about to be parsed.
     */
    saveThemes(sceneThemes) {
        var i = 0;
        for (var j = 0; j < sceneThemes.length; j++) {
            this.themeIDs[sceneThemes[j]] = i;
            i++;
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    initializeScene() {
        this.sceneInited = true;

        var theme = this.themes[this.selectedTheme];

        this.axis = new CGFaxis(this, theme.XML["length"]);

        this.gl.clearColor(theme.XML["background"][0], theme.XML["background"][1], theme.XML["background"][2], theme.XML["background"][3]);

        this.setGlobalAmbientLight(theme.XML["ambient"][0], theme.XML["ambient"][1], theme.XML["ambient"][2], theme.XML["ambient"][3]);

        this.interface.initSceneGUI();

        this.interface.initGameGUI();

        this.initCameras(theme);

        this.interface.addViews();

        this.initLights(theme);

        this.interface.addThemes();

        let cameraUsed = this.cameras[this.selectedView];
        this.camera = new CGFcamera(cameraUsed.fov, cameraUsed.near, cameraUsed.far, cameraUsed.position, cameraUsed.target);
    }

    /**
     * Adds a fully parsed theme to the theme list.
     */
    addGraph(theme) {
        this.themes[this.themes.length] = theme;
    }

    /**
     * Updates the game mode being used upon being changed in the interface.
     */
    updateGameMode() {
        if (this.game == undefined)
            return;
        this.endGame(0);
        this.graph.repositionPieces(this.selectedTheme);
    }

    /**
     * Updates the difficulty being used upon being changed in the interface.
     */
    updateDifficulty() {
        if (this.game == undefined)
            return;
        switch (this.playingOption) {
            case "Bot v Bot":
                this.game = undefined;
                break;

            case "Player v Bot":
                this.game = undefined;
                this.greenWins++;
                break;

            case "Player v Player":
                return;
        }
        this.graph.repositionPieces(this.selectedTheme);
    }

    /**
     * Ends the game immediately, after one player surrenders.
     */
    forfeit() {
        if (this.game != undefined) {
            this.endGame(1);
        }
    }

    /**
     * Updates the current state of the game to the state it was in one turn earlier.
     */
    undo() {
        if (this.game != undefined) {
            if (this.game.moveCounter == 0)
                return;
            if (this.playingOption == "Bot v Bot")
                return;
            if (this.checkForMovement() == 1)
                return;
            let translation = [];
            let position = this.pieceMoves[this.game.moveCounter - 1]["position"];
            this.graph.piecePositions[this.pieceMoves[this.game.moveCounter - 1]["id"] - 1] = position;
            translation[0] = this.pieceMoves[this.game.moveCounter - 1]["animation"].translates[2][2];
            translation[1] = -this.pieceMoves[this.game.moveCounter - 1]["animation"].translates[2][1];
            translation[2] = -this.pieceMoves[this.game.moveCounter - 1]["animation"].translates[2][0];
            let undoAnimation = new PieceAnimation(translation);
            this.themes[this.selectedTheme].XML.components['piece' + this.pieceMoves[this.game.moveCounter - 1]["id"]]["animation"] = undoAnimation;
            this.themes[this.selectedTheme].XML.animations['movement' + this.pieceMoves[this.game.moveCounter - 1]["id"]] = undoAnimation;
            this.game.undo();
            if (this.playingOption == "Player v Bot") {
                position = this.pieceMoves[this.game.moveCounter - 1]["position"];
                this.graph.piecePositions[this.pieceMoves[this.game.moveCounter - 1]["id"] - 1] = position;
                translation[0] = this.pieceMoves[this.game.moveCounter - 1]["animation"].translates[2][2];
                translation[1] = -this.pieceMoves[this.game.moveCounter - 1]["animation"].translates[2][1];
                translation[2] = -this.pieceMoves[this.game.moveCounter - 1]["animation"].translates[2][0];
                let undoAnimation2 = new PieceAnimation(translation);
                this.themes[this.selectedTheme].XML.components['piece' + this.pieceMoves[this.game.moveCounter - 1]["id"]]["animation"] = undoAnimation2;
                this.themes[this.selectedTheme].XML.animations['movement' + this.pieceMoves[this.game.moveCounter - 1]["id"]] = undoAnimation2;
                this.game.undo();
            }
            else {
                if (this.redTurn) {
                    this.redTurn = false;
                    this.greenTurn = true;
                }
                else if (this.greenTurn) {
                    this.redTurn = true;
                    this.greenTurn = false;
                }
            }
        }
    }

    /**
     * Shows rules of the game
     */
    showRules() {
        this.rules.display();
    }

    /**
     * Starts a new game.
     */
    startGame() {
        if (this.game != undefined)
            return;
        this.gameDelay = -3;
        this.graph.repositionPieces(this.selectedTheme);
        this.redTurn = true;
        this.greenTurn = false;
        this.timeLeft = this.turnTime;
        this.movie = [];
        this.pieceMoves = [];
        this.game = new Game(this, "human", "human");
    }

    /**
     * Ends the game, saving its sequence of moves and awarding a win to the player that won.
     * @param result Decides if the win should be awarded to player 1 or player 2. 
     */
    endGame(result) {
        this.game = undefined;
        this.gamesPlayed++;
        if (this.movie.length != 0) {
            this.movies[this.moviesStored] = this.movie;
            if (this.movie.length == 1)
                this.movieNames[this.moviesStored] = "Game " + this.gamesPlayed + " - " + this.movie.length + " Turn";
            else
                this.movieNames[this.moviesStored] = "Game " + this.gamesPlayed + " - " + this.movie.length + " Turns";
            this.moviesStored++;
            this.interface.updateMovieSelection();
        }
        if (result == 0) {
            if (this.redTurn == true) {
                this.redWins++;
                this.redTurn = false;
            }
            else if (this.greenTurn == true) {
                this.greenWins++;
                this.greenTurn = false;
            }
        } else {
            if (this.redTurn == true) {
                this.greenWins++;
                this.greenTurn = false;
            }
            else if (this.greenTurn == true) {
                this.redWins++;
                this.redTurn = false;
            }
        }
    }


    /**
     * Starts playing the currently selected movie.
     */
    playMovie() {
        if (this.selectedMovie == -1)
            return;
        let movieNumber = parseInt(this.selectedMovie.substring(5, this.selectedMovie.indexOf('-') - 1));
        if (this.movies[movieNumber - 1].length == 0)
            return;
        this.movieAnimation = -3;
        this.graph.repositionPieces(this.selectedTheme);
        if (this.game != undefined) {
            this.endGame(0);
        }
        this.moviePlaying = movieNumber - 1;
    }

    /**
     * Advances the animation of the movie to the next turn, while waiting for each animation to play out fully.
     */
    updateMovie() {
        var result = this.checkForMovement();
        if (result == 1)
            return;
        else if (result == 2)
            this.movieAnimation++;
        if (this.movieAnimation >= this.movies[this.moviePlaying].length) {
            this.moviePlaying = -1;
            return;
        }
        if (this.movieAnimation < 0) {
            this.movieAnimation++;
            return;
        }
        var values = this.movies[this.moviePlaying][this.movieAnimation];
        this.graph.generateAnimation(values[0] + 1, values[1] - 8, this.selectedTheme);
    }

    update(t) {

        if (!this.time) {
            this.time = t;
            this.startTime = t;
            return;
        }

        let deltaTime = t - this.time;
        if (this.game != undefined) {
            if (this.checkForMovement() != 1)
                if (this.timeLeft > 0) {
                    this.timeLeft -= deltaTime / 1000;
                    this.timeLeft = Math.round(this.timeLeft * 100) / 100;
                    if (this.timeLeft <= 0) {
                        if (this.game != undefined) {
                            this.endGame(1);
                        }
                    }
                }
        }
        else
            this.timeLeft = "Not In-Game";
        if (this.moviePlaying != -1)
            this.updateMovie();
        this.time = t;
        this.score = "Red - " + this.redWins + " | " + this.greenWins + " - Green";
        if (this.sceneInited) {
            for (var key in this.themes[this.selectedTheme].XML.animations) {
                if (this.themes[this.selectedTheme].XML.animations.hasOwnProperty(key))
                    this.themes[this.selectedTheme].XML.animations[key].update(deltaTime);
            }
            if (this.updatingCamera == true) {
                this.updateTicks++;
                if (this.updateTicks >= 61) {
                    this.camera = new CGFcamera(this.newCamera.fov, this.newCamera.near, this.newCamera.far, this.newCamera.position, this.newCamera.target);
                    this.camera._up[0] = this.newCamera._up[0];
                    this.camera._up[1] = this.newCamera._up[1];
                    this.camera._up[2] = this.newCamera._up[2];
                    this.updatingCamera = false;
                    return;
                }
                else if (this.updateTicks < 31) {
                    let newPos = [];
                    newPos[0] = this.tempCamera.position[0] + (this.cameraPositionChange[0] / 30);
                    newPos[1] = this.tempCamera.position[1] + (this.cameraPositionChange[1] / 30);
                    newPos[2] = this.tempCamera.position[2] + (this.cameraPositionChange[2] / 30);
                    newPos[3] = this.tempCamera.position[3] + (this.cameraPositionChange[3] / 30);
                    this.tempCamera.setPosition(newPos);
                }
                else {
                    let newTarget = [];
                    newTarget[0] = this.tempCamera.target[0] + (this.cameraTargetChange[0] / 30);
                    newTarget[1] = this.tempCamera.target[1] + (this.cameraTargetChange[1] / 30);
                    newTarget[2] = this.tempCamera.target[2] + (this.cameraTargetChange[2] / 30);
                    newTarget[3] = this.tempCamera.target[3] + (this.cameraTargetChange[3] / 30);
                    this.tempCamera.setTarget(newTarget);
                }
                this.tempCamera._up[0] = this.tempCamera._up[0] + this.cameraUpChange[0] / 60;
                this.tempCamera._up[1] = this.tempCamera._up[1] + this.cameraUpChange[1] / 60;
                this.tempCamera._up[2] = this.tempCamera._up[2] + this.cameraUpChange[2] / 60;
                this.camera = this.tempCamera;
            }
        }
    }

    /**
     * Changes the turn to the next player, and checks if a player has won.
     */
    swapPlayer() {
        this.game.moveCounter++;
        if (this.game.gameOver) {
            this.endGame(0);
            return;
        }

        if (this.redTurn == true) {
            this.redTurn = false;
            this.greenTurn = true;
            if (this.automaticCameraChange)
                if (this.playingOption == "Player v Player") {
                    this.selectedView = 1;
                    this.updateCamera();
                }
        }
        else if (this.greenTurn == true) {
            this.redTurn = true;
            this.greenTurn = false;
            if (this.automaticCameraChange)
                if (this.playingOption == "Player v Player") {
                    this.selectedView = 0;
                    this.updateCamera();
                }
        }
    }

    /**
     * Checks if any piece has just finished its movement, and if any piece is currently in movement.
     */
    checkForMovement() {
        for (var j = 1; j < 9; j++) {
            if (this.themes[this.selectedTheme].XML.animations['movement' + j] != undefined)
                if (this.themes[this.selectedTheme].XML.animations['movement' + j].isFinished() == false) {
                    return 1;
                }
                else if (this.themes[this.selectedTheme].XML.animations['movement' + j].updatePosition() == true) {
                    this.graph.updatePiecePositions[j - 1] = true;
                    return 2;
                }
        }
        return 0;
    }

    /**
     * Calls necessary functions to get a Player move
     */
    playerPick() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        if (obj.constructor.name == "MySphere") {
                            if (this.redTurn == true) {
                                if (this.pickResults[i][1] > 4)
                                    continue;
                            }
                            else if (this.greenTurn == true) {
                                if (this.pickResults[i][1] < 5)
                                    continue;
                            }
                            if (this.graph.pieceSelections[this.pickResults[i][1] - 1] == true) {
                                this.graph.pieceSelections[this.pickResults[i][1] - 1] = false;
                                continue;
                            }
                            for (var j = 0; j < this.graph.pieceSelections.length; j++) {
                                this.graph.pieceSelections[j] = false;
                            }
                            this.graph.pieceSelections[this.pickResults[i][1] - 1] = true;
                        }
                        else if (obj.constructor.name == "MyRectangle") {
                            for (var j = 0; j < this.graph.pieceSelections.length; j++) {
                                if (this.graph.pieceSelections[j] == true) {
                                    this.graph.pieceSelections[j] = false;

                                    let column = (this.pickResults[i][1] - 8 - 1) % 5 + 1;
                                    let row = Math.floor((this.pickResults[i][1] - 8 - 1) / 5) + 1;
                                    let player = this.redTurn ? 1 : 2;

                                    if (this.game.moveCounter >= 8) { //piece movement
                                        let validMove = this.game.movePiece(this.graph.piecePositions[j][0], this.graph.piecePositions[j][1], row, column, player);
                                        if (validMove != 0) {
                                            let move = [];
                                            move["position"] = [this.graph.piecePositions[j][0], this.graph.piecePositions[j][1]];
                                            this.graph.piecePositions[j] = [row, column];
                                            let animation = this.graph.generateAnimation(j + 1, this.pickResults[i][1] - 8, this.selectedTheme);
                                            move["animation"] = animation;
                                            move["id"] = j + 1;
                                            move["position"] = [row, column];
                                            this.pieceMoves[this.game.moveCounter] = move;
                                            this.movie[this.game.moveCounter] = [j, this.pickResults[i][1], row, column];
                                            this.timeLeft = this.turnTime;
                                        }
                                    }
                                    else if (this.game.moveCounter < 8 && this.graph.piecePositions[j][0] == 0) { //piece placement
                                        let validPlacement = this.game.placePiece(row, column, player);
                                        if (validPlacement != 0) {
                                            let move = [];
                                            move["position"] = [this.graph.piecePositions[j][0], this.graph.piecePositions[j][1]];
                                            this.graph.piecePositions[j] = [row, column];
                                            let animation = this.graph.generateAnimation(j + 1, this.pickResults[i][1] - 8, this.selectedTheme);
                                            move["animation"] = animation;
                                            move["id"] = j + 1;
                                            this.pieceMoves[this.game.moveCounter] = move;
                                            this.movie[this.game.moveCounter] = [j, this.pickResults[i][1], row, column];
                                            this.timeLeft = this.turnTime;
                                        }
                                    }



                                    break;
                                }
                            }
                        }
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    /**
     * Gets a piece from a specific position on the board
     * @param row 
     * @param column 
     */
    getPiece(row, column) {
        for (let i = 0; i < 8; i++) {
            if (this.graph.piecePositions[i][0] == row
                && this.graph.piecePositions[i][1] == column)
                return i;
        }
    }

    /**
     * Calls necessary functions to get a CPU move
     */
    cpuPick() {
        let level;
        switch (this.difficulty) {
            case "Easy":
                level = 1;
                break;

            case "Medium":
                level = 2;
                break;

            case "Hard":
                level = 3;
                break;
        }
        let player = this.redTurn ? 1 : 2;
        if (this.game.moveCounter >= 8) { //piece movement
            let movePositions = this.game.movePieceCPU(player, level);
            let sourceTile = movePositions[0];
            let destTile = movePositions[1];

            let sourceCol = (sourceTile) % 5 + 1;
            let sourceRow = Math.floor((sourceTile) / 5) + 1;

            let destCol = (destTile) % 5 + 1;
            let destRow = Math.floor((destTile) / 5) + 1;

            let pieceID = this.getPiece(sourceRow, sourceCol);
            let tileID = destTile + 1;

            let move = [];
            move["position"] = [this.graph.piecePositions[pieceID][0], this.graph.piecePositions[pieceID][1]];

            this.graph.piecePositions[pieceID] = [destRow, destCol];
            let animation = this.graph.generateAnimation(pieceID + 1, tileID, this.selectedTheme);
            move["animation"] = animation;
            move["id"] = pieceID + 1;
            this.pieceMoves[this.game.moveCounter] = move;
            this.movie[this.game.moveCounter] = [pieceID, tileID + 8, destRow, destCol];
        }
        else if (this.game.moveCounter < 8) { //piece placement
            let tile = this.game.placePieceCPU(player, level);
            let tileID = tile + 9;
            let pieceID;
            switch (this.game.moveCounter) {
                case 0:
                    pieceID = 1;
                    break;
                case 1:
                    pieceID = 5;
                    break;
                case 2:
                    pieceID = 2;
                    break;
                case 3:
                    pieceID = 6;
                    break;
                case 4:
                    pieceID = 3;
                    break;
                case 5:
                    pieceID = 7;
                    break;
                case 6:
                    pieceID = 4;
                    break;
                case 7:
                    pieceID = 8;
                    break;
            }

            let column = (tile) % 5 + 1;
            let row = Math.floor(tile / 5) + 1;
            let move = [];
            move["position"] = [this.graph.piecePositions[pieceID - 1][0], this.graph.piecePositions[pieceID - 1][1]];
            this.graph.piecePositions[pieceID - 1] = [row, column];
            let animation = this.graph.generateAnimation(pieceID, tileID - 8, this.selectedTheme);
            move["animation"] = animation;
            move["id"] = pieceID;
            this.pieceMoves[this.game.moveCounter] = move;
            this.movie[this.game.moveCounter] = [pieceID - 1, tileID, row, column];
        }
    }

    /**
     * Checks if the game is currently being played, and hands off control to a human or a CPU depending on game mode.
     */
    logPicking() {
        if (this.game != undefined) {
            var result = this.checkForMovement();
            if (result == 1)
                return;
            else if (result == 2)
                this.swapPlayer();
            if (this.gameDelay < 0) {
                this.gameDelay++;
                return;
            }
            if (this.game == undefined)
                return;
            switch (this.playingOption) {
                case "Bot v Bot":
                    this.cpuPick();
                    break;

                case "Player v Bot":
                    if (this.redTurn)
                        this.playerPick();
                    else {
                        this.cpuPick();
                    }
                    break;

                case "Player v Player":
                    this.playerPick();
                    break;
            }
        }
    }

    /**
     * Displays the scene.
     */
    render(camera) {
        // ---- BEGIN Background, camera and axis setup
        this.interface.setActiveCamera(camera);
        this.camera = camera;

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        this.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    display() {
        this.logPicking();
        this.clearPickRegistration();
        if (this.sceneInited) {
            this.rtt.attachToFrameBuffer()
            this.rules.rules.display();
            this.rtt.detachFromFrameBuffer()
            this.render(this.camera);
        }
        if (this.displayRules)
            this.rules.display();


    }
}