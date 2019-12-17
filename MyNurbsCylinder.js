/**
 * MyNurbsCylinder
 * @constructor
 * @param scene Reference to MySceneGraph object
 * @param base Radius of the base (Z = 0)
 * @param top Radius of the top (Z = height)
 * @param height Size in the direction of the positive Z axis
 * @param slices Number of divisions around the circumference
 * @param stacks Number of divisions along the Z direction
 */
class MyNurbsCylinder extends CGFobject {
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);
        this. cylinderSide1 = new MyPatch(scene, 4, 2, Math.ceil(slices), stacks,
            [	// U0
                [
                    [base, 0.0, 0.0, 1.0],        // V0
                    [top, 0.0, height, 1.0]       // V1

                ],
                // U1
                [
                    [base, 4 / 3 * base, 0.0, 1.0],   // V0
                    [top, 4 / 3 * top, height, 1.0]	// V1					 
                ],
                // U2
                [
                    [-base, 4 / 3 * base, 0.0, 1.0],   // V0
                    [-top, 4 / 3 * top, height, 1.0]   // V1
                ],
                // U3
                [
                    [-base, 0.0, 0.0, 1.0],        // V0
                    [-top, 0.0, height, 1.0]       // V1
                ]
            ]);

            this. cylinderSide2 = new MyPatch(scene, 4, 2, Math.ceil(slices), stacks,
            [	// U0
                [
                    [-base, 0.0, 0.0, 1.0],        // V0
                    [-top, 0.0, height, 1.0]       // V1

                ],
                // U1
                [
                    [-base, -4 / 3 * base, 0.0, 1.0],  // V0
                    [-top, -4 / 3 * top, height, 1.0]  // V1					 
                ],
                // U2
                [
                    [base, -4 / 3 * base, 0.0, 1.0],  // V0
                    [top, -4 / 3 * top, height, 1.0]  // V1
                ],
                // U3
                [
                    [base, 0.0, 0.0, 1.0],        // V0
                    [top, 0.0, height, 1.0]       // V1
                ]
            ]);
    }


    display() {
        this.cylinderSide1.display();
        this.cylinderSide2.display();
    }

    updateTexCoords(length_s, length_t) {
	}
}

