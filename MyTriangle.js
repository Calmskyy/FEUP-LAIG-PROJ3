/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 * @param z - Scale of rectangle in Z 
 * 
 * @method updateTexCoords
 * Updates the list of texture coordinates of the object
 * @param length_s - Scale factor of the texture in the s direction
 * @param length_t - Scale factor of the texture in the t direction	 
 * 
 */
class MyTriangle extends CGFobject{

	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);

		
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,
			this.x2, this.y2, this.z2,
			this.x3, this.y3, this.z3,
			this.x1, this.y1, this.z1,
			this.x2, this.y2, this.z2,
			this.x3, this.y3, this.z3
		];

		this.indices = [
			0, 1, 2,
			2, 1, 0
		];
		
		let p1 = vec3.fromValues(this.x1, this.y1, this.z1);
		let p2 = vec3.fromValues(this.x2, this.y2, this.z2);
		let p3 = vec3.fromValues(this.x3, this.y3, this.z3);
		let vec1 = vec3.create();
		vec1 = vec3.subtract(vec1, p2, p1);
		
		let vec2 = vec3.create();
		vec2 = vec3.subtract(vec2, p3, p1);
		
		let dir = vec3.create();
		dir = vec3.cross(dir, vec1, vec2);
		let normal = vec3.create();
		vec3.normalize(normal, dir);

		//calcular as normals utilizando os pontos
		let auxVec = vec3.create();
		auxVec = vec3.subtract(auxVec, auxVec, normal);
		this.normals = [
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2],
			auxVec[0], auxVec[1], auxVec[2],
			auxVec[0], auxVec[1], auxVec[2],
			auxVec[0], auxVec[1], auxVec[2]
		];

		this.a = Math.sqrt((this.x2 - this.x1)*(this.x2 - this.x1) + (this.y2 - this.y1)*(this.y2 - this.y1) + (this.z2 - this.z1)*(this.z2 - this.z1));
		this.b = Math.sqrt((this.x3 - this.x2)*(this.x3 - this.x2) + (this.y3 - this.y2)*(this.y3 - this.y2) + (this.z3 - this.z2)*(this.z3 - this.z2));
		this.c = Math.sqrt((this.x1 - this.x3)*(this.x1 - this.x3) + (this.y1 - this.y3)*(this.y1 - this.y3) + (this.z1 - this.z3)*(this.z1 - this.z3));

		this.cosBeta = (this.a*this.a - this.b*this.b + this.c*this.c)/(2*this.a*this.c);
		this.sinBeta = Math.sqrt(1 - this.cosBeta*this.cosBeta);
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */
		this.texCoords = [
			0, 0,
			this.a, 0,
			this.c * this.cosBeta, this.c * this.sinBeta,
			0, 0,
			this.a, 0,
			this.c * this.cosBeta, this.c * this.sinBeta
		];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the object
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(length_s, length_t) {
		this.texCoords = [
			0, 0,
			this.a / length_s, 0,
			this.c * this.cosBeta / length_s, this.c * this.sinBeta / length_t,
			0, 0,
			this.a / length_s, 0,
			this.c * this.cosBeta / length_s, this.c * this.sinBeta / length_t
		];	
		this.updateTexCoordsGLBuffers(); 
	}
}