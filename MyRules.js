/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyRules extends CGFobject {
	constructor(scene) {
        super(scene);
        this.scene = scene;
        this.rules = new MyRectangle(scene, 0.25, 1, -1, -0.25);

        this.material = new CGFappearance(scene);
        this.material.setAmbient(0 , 1, 1, 1);
        this.material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(10.0);
        this.material.loadTexture('scenes/images/wood.jpg');
        this.material.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');

        this.shader = new CGFshader(this.scene.gl, "shaders/texture1.vert", "shaders/texture1.frag");
        this.texture = new CGFtexture(this.scene, "scenes/images/rules.jpg");


        this.shader.setUniformsValues({uSampler2: 1});
        this.shader.setUniformsValues({uSampler2: 2});
        this.shader.setUniformsValues({timeFactor: 0});
    }

    display() {
        this.scene.gl.disable(this.scene.gl.DEPTH_TEST);
        this.scene.setActiveShader(this.shader);
        this.scene.rtt.bind();
        this.texture.bind(2);
        this.rules.display();
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
    }
}