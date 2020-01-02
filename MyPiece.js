class MyPiece extends CGFobject {

    /*
    * Consctructor for the bishop game object
    */
    constructor(scene,row,column, player) {
        super(scene);
        this.scene = scene;
        this.row = row;
        this.column = column;
        this.player = player;
        this.animation = null;
        this.initTextures();
        this.body = new MySphere(this.scene, 1, 10, 4);
    }


    
    initTextures(){
        //wooden appearance
        this.woodenAppearance = new CGFappearance(this.scene);
        this.woodenAppearance.loadTexture("scenes/images/wood.jpg");
        this.woodenAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
        if (this.player == 1) {
            this.woodenAppearance.setAmbient(1,1,1,1);
            this.woodenAppearance.setDiffuse(0.9,0.1,0.1,1);
            this.woodenAppearance.setSpecular(0.9,0.1,0.1,1);
            this.woodenAppearance.setShininess(10.0);
        }
        else if (this.player == 2) {
            this.woodenAppearance.setAmbient(1,1,1,1);
            this.woodenAppearance.setDiffuse(0.1,0.9,0.1,1);
            this.woodenAppearance.setSpecular(0.1,0.9,0.1,1);
            this.woodenAppearance.setShininess(10.0);
        }

        //glass appearance
    //     this.glassAppearance = new CGFappearance(this.scene);
    //     this.glassAppearance.loadTexture("scenes/images/glass.jpg");
	// 	this.glassAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    // 	this.glassAppearance.setAmbient(1,1,1,1);
	// 	this.glassAppearance.setDiffuse(0.5,0.5,0.5,1);
	// 	this.glassAppearance.setSpecular(0.5,0.5,0.5,1);
    //     this.glassAppearance.setShininess(10.0);
    }

    display(){
        this.scene.pushMatrix();
        this.scene.translate(2, 0, this.row * 3);
        this.scene.scale(0.5, 1, 1);
        this.woodenAppearance.apply();
        this.body.display();
        this.scene.popMatrix();
    }

    move(row,column) {
        this.row = row;
        this.column = column;
    }
}