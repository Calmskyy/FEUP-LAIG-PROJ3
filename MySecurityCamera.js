/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySecurityCamera extends CGFobject {
	constructor(scene) {
        super(scene);
        this.scene = scene;
        this.camera = new MyRectangle(scene, 0.25, 1, -1, -0.25);
        this.shader = new CGFshader(this.scene.gl, "shaders/texture1.vert", "shaders/texture1.frag");
        this.texture = new CGFtexture(this.scene, "scenes/images/wood.jpg");
        this.texture2 = new CGFtexture(this.scene, "scenes/images/camera_viewfinder.png");

        this.shader.setUniformsValues({uSampler2: 1});
        this.shader.setUniformsValues({uSampler2: 2});
        this.shader.setUniformsValues({timeFactor: 0});
    }

    display() {
        this.scene.gl.disable(this.scene.gl.DEPTH_TEST);
        this.scene.setActiveShader(this.shader);
        this.texture.bind(1);
        this.scene.rtt.bind();
        this.texture2.bind(2);
        this.camera.display();
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
    }
}