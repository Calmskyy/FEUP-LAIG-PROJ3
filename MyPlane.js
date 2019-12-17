/**
 * MyPlane
 * @constructor
 * @param scene Reference to MyScene object
 * @param degreeU Nurbs surface's degree on U
 * @param degreeV Nurbs surface's degree on V 
 */
class MyPlane extends CGFobject {
	constructor(scene,  divisionsU, divisionsV) {
		super(scene);
		var controlVertexes = 						
		[	// U = 0
			[ // V = 0..1;
				 [-1.0, -1.0, 0.0, 1 ],
				 [-1.0,  1.0, 0.0, 1 ]
				
			],
			// U = 1
			[ // V = 0..1
				 [ 1.0, -1.0, 0.0, 1 ],
				 [ 1.0,  1.0, 0.0, 1 ]							 
			]
		];
		this.surface = new CGFnurbsSurface(1, 1, controlVertexes);
		this.nurbsObject = new CGFnurbsObject(scene, divisionsU, divisionsV, this.surface);
	}

	updateTexCoords(length_s, length_t) {
	}

	display() {
		this.nurbsObject.display();
	}
}

