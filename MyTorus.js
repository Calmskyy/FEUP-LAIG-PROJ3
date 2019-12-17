/**
 * MyTorus
 * @constructor
 * @param scene Reference to MySceneGraph object
 * @param inner The "tube" radius
 * @param outer Radius of the "circular axis" of the torus
 * @param slices Number of divisions around the circumference of the torus
 * @param loops Number of divisions along the "tube"
 * 
 */
class MyTorus extends CGFobject {
	constructor(scene, inner, outer, slices, loops) {
		super(scene);

		this.slices = slices;
		this.loops = loops;
		this.innerRadius = inner;
		this.outerRadius = outer;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		let sliceAngle = 2*Math.PI/this.slices;
		let loopAngle = 2*Math.PI/this.loops;

		for(let i = 0; i <= this.slices; ++i) {

			for(let j = 0; j <= this.loops; ++j) {

				this.vertices.push(
					(this.outerRadius + this.innerRadius*Math.cos(loopAngle*j)) * Math.cos(sliceAngle*i), 
					(this.outerRadius + this.innerRadius*Math.cos(loopAngle*j)) * Math.sin(sliceAngle*i), 
					this.innerRadius * Math.sin(loopAngle*j)
				);

				this.texCoords.push(
					i*1/this.slices, 
					j*1/this.loops	
				);

				this.normals.push(
					Math.cos(loopAngle*j) * Math.cos(sliceAngle*i), 
                    Math.cos(loopAngle*j) * Math.sin(sliceAngle*i),
                    Math.sin(loopAngle*j)
				);

			}

		}

		for (let i = 0; i < this.slices; ++i) {
			let k1 = i*(this.loops+1); //beggining of the currrent loop
			let k2 = (i+1)*(this.loops+1); //beggining of the next loop
			for(let j = 0; j < this.loops; ++j) {
				this.indices.push(
					k2 + j, k1 + j+1, k1 + j,
					k1 + j+1, k2 + j, k2 + j+1
				);
			}
		}	

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
	
	updateTexCoords(length_s, length_t) {
	}
};