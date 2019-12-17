/**
 * MySphere
 * @constructor
 * @param scene Reference to MySceneGraph object
 * @param radius Radius of the Sphere
 * @param slices Number of divisions around the circumference
 * @param stacks Number of divisions along the Z direction
 * 
 */
class MySphere extends CGFobject {
    constructor(scene, radius, slices, stacks) {
        super(scene);
        this.scene = scene;
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        var alfa;
        var beta;

        this.indices = [];
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];

        let x, y, z;                              
        let s, t;                                

        let sliceStep = 2 * Math.PI / this.slices;
        let stackStep = Math.PI / (this.stacks * 2);

        for (let i = 0; i <= this.stacks; ++i) {
            alfa = Math.PI / 2 - i * stackStep;

            for (let j = 0; j <= this.slices; ++j) {
                beta = j * sliceStep;          

                x = this.radius * Math.cos(alfa) * (Math.cos(beta));           
                y = this.radius * Math.cos(alfa) * (Math.sin(beta));            
                z = this.radius * Math.sin(alfa);
                this.vertices.push(x, y, z);

                this.normals.push(x/this.radius, y/this.radius, z/this.radius);

                s = j / this.slices;
                t = i / this.stacks;
                this.texCoords.push(s);
                this.texCoords.push(t);
            }
        }


        for (let j = 0; j < this.stacks; ++j) {
            let k1 = j * (this.slices + 1); //beginning of current stack
            let k2 = k1 + this.slices + 1;  //beginning of next stack

            for (let i = 0; i < this.slices; ++i, ++k1, ++k2) {
                // 2 triangles per slice excluding first and last stacks
                if (j != 0) {
                    this.indices.push(k1);
                    this.indices.push(k2);
                    this.indices.push(k1 + 1);
                }

                if (j != (this.stacks * 2 - 1)) {
                    this.indices.push(k1 + 1);
                    this.indices.push(k2);
                    this.indices.push(k2 + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        super.display();
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        super.display();    
        this.scene.popMatrix();
    }
    
	updateTexCoords(length_s, length_t) {
	}
}