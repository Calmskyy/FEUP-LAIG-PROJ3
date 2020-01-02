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
        this.playingOption = ["Player v Player"];

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.scaleFactor = 1;
        this.turnTime = 20;
        this.displayAxis = true;
        this.selectedView = 0;
        this.selectedTheme = 0;
        this.score = "test123";
        this.redWins = 0;
        this.greenWins = 0;
        this.timeLeft = 20;

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
        this.cameraFOVChange = this.newCamera.fov - this.oldCamera.fov;
        this.cameraNearChange = this.newCamera.near - this.oldCamera.near;
        this.cameraFarChange = this.newCamera.far - this.oldCamera.far;
        this.cameraPositionChange = [this.newCamera.position[0] - this.oldCamera.position[0], this.newCamera.position[1] - this.oldCamera.position[1], this.newCamera.position[2] - this.oldCamera.position[2], this.newCamera.position[3] - this.oldCamera.position[3]];
        this.cameraTargetChange = [this.newCamera.target[0] - this.oldCamera.target[0], this.newCamera.target[1] - this.oldCamera.target[1], this.newCamera.target[2] - this.oldCamera.target[2], this.newCamera.target[3] - this.oldCamera.target[3]];
        this.cameraDirectionChange = [this.newCamera.direction[0] - this.oldCamera.direction[0], this.newCamera.direction[1] - this.oldCamera.direction[1], this.newCamera.direction[2] - this.oldCamera.direction[2], this.newCamera.direction[3] - this.oldCamera.direction[3]];
        this.tempCamera = new CGFcamera(0, this.oldCamera.near, this.oldCamera.far, [this.oldCamera.position[0], this.oldCamera.position[1], this.oldCamera.position[2]], [this.oldCamera.target[0], this.oldCamera.target[1], this.oldCamera.target[2]]);
        this.tempCamera.fov = this.oldCamera.fov;
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

        this.camera = this.cameras[this.selectedView];
    }

    /**
     * 
     */
    addGraph(theme) {
        this.themes[this.themes.length] = theme;
    }

    /**
     * 
     */
    undo() {
        console.log("test");
    }

    /**
     * 
     */
    startGame() {
        this.game = new Game(this, "human", "human");
    }

    /**
     * 
     */
    playMovie() {
        console.log("test3");
    }

    update(t) {
        this.checkKeys();

        if (!this.time) {
            this.time = t;
            this.startTime = t;
            return;
        }

        let deltaTime = t - this.time;
        if (this.timeLeft > 0) {
            this.timeLeft -= deltaTime / 1000;
            if (this.timeLeft < 0)
                this.timeLeft = 0;
        }
        this.time = t;
        this.score = "Red - " + this.redWins + " | " + this.redWins + " - Green";
        if (this.sceneInited) {
            for (var key in this.themes[this.selectedTheme].XML.animations) {
                if (this.themes[this.selectedTheme].XML.animations.hasOwnProperty(key))
                    this.themes[this.selectedTheme].XML.animations[key].update(deltaTime);
            }
            if (this.updatingCamera == true) {
                this.updateTicks++;
                if (this.updateTicks >= 61) {
                    console.log(this.tempCamera);
                    console.log(this.newCamera);
                    this.camera = this.newCamera;
                    this.updatingCamera = false;
                    return;

                }
                this.tempCamera.fov += this.cameraFOVChange / 60;
                this.tempCamera.near += this.cameraNearChange / 60;
                this.tempCamera.far += this.cameraFarChange / 60;
                this.tempCamera.position[0] = this.tempCamera.position[0] + (this.cameraPositionChange[0] / 60);
                this.tempCamera.position[1] = this.tempCamera.position[1] + (this.cameraPositionChange[1] / 60);
                this.tempCamera.position[2] = this.tempCamera.position[2] + (this.cameraPositionChange[2] / 60);
                this.tempCamera.position[3] = this.tempCamera.position[3] + (this.cameraPositionChange[3] / 60);
                this.tempCamera.target[0] = this.tempCamera.target[0] + (this.cameraTargetChange[0] / 60);
                this.tempCamera.target[1] = this.tempCamera.target[1] + (this.cameraTargetChange[1] / 60);
                this.tempCamera.target[2] = this.tempCamera.target[2] + (this.cameraTargetChange[2] / 60);
                this.tempCamera.target[3] = this.tempCamera.target[3] + (this.cameraTargetChange[3] / 60);
                this.tempCamera.direction[0] = this.tempCamera.direction[0] + (this.cameraDirectionChange[0] / 60);
                this.tempCamera.direction[1] = this.tempCamera.direction[1] + (this.cameraDirectionChange[1] / 60);
                this.tempCamera.direction[2] = this.tempCamera.direction[2] + (this.cameraDirectionChange[2] / 60);
                this.tempCamera.direction[3] = this.tempCamera.direction[3] + (this.cameraDirectionChange[3] / 60);
                this.camera = this.tempCamera;
            }
        }
    }

    checkKeys() {
        if (this.gui.isKeyPressed("KeyM")) {
            this.graph.processMPress();
        }
    }

    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    console.log(this.pickResults[i]);
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        if (obj.constructor.name == "MySphere") {
                            if (this.graph.redTurn == true) {
                                if (this.pickResults[i][1] > 4)
                                    continue;
                            }
                            else if (this.graph.greenTurn == true) {
                                if (this.pickResults[i][1] < 5)
                                    continue;
                            }
                            var movementInProgress = false;
                            for (var j = 1; j < 9; j++) {
                                if (this.themes[this.selectedTheme].XML.animations['movement' + j] != undefined)
                                    if (this.themes[this.selectedTheme].XML.animations['movement' + j].isFinished() == false)
                                        movementInProgress = true;
                                    else if (this.themes[this.selectedTheme].XML.animations['movement' + j].updatePosition() == true)
                                        this.graph.updatePiecePositions[j - 1] = true;
                            }
                            if (movementInProgress == true)
                                continue;
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
                                    this.graph.generateAnimation(j + 1, this.pickResults[i][1] - 8, this.selectedTheme);
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
        if (this.displayAxis)
            this.axis.display();

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
        if (this.sceneInited)
            this.render(this.camera)
    }
}