/**
 * MyPatch
 * @constructor
 * @param scene Reference to MyScene object
 * @param degreeU Nurbs surface's degree on U
 * @param degreeV Nurbs surface's degree on V 
 * @param divisionsU Nurb surface's number of divisions on U
 * @param divisionsV Nurb surface's number of divisions on U
 * @param controlVertexes Nurb surface's control Vertexes
 */
class MyPatch extends CGFobject {
	constructor(scene, degreeU, degreeV, divisionsU, divisionsV, controlVertexes) {
		super(scene);
		this.surface = new CGFnurbsSurface(degreeU - 1, degreeV - 1, controlVertexes);
		this.nurbsObject = new CGFnurbsObject(scene, divisionsU, divisionsV, this.surface);
	}


	display() {
		this.nurbsObject.display();
	}

	updateTexCoords(length_s, length_t) {
	}
}

