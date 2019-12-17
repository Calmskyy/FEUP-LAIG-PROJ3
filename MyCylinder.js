/**
 * MyCylinder
 * @constructor
 * @param scene Reference to MySceneGraph object
 * @param base Radius of the base (Z = 0)
 * @param top Radius of the top (Z = height)
 * @param height Size in the direction of the positive Z axis
 * @param slices Number of divisions around the circumference
 * @param stacks Number of divisions along the Z direction
 * 
*/

class MyCylinder extends CGFobject {

  constructor(scene, base, top, height, slices, stacks) {
    super(scene);

    this.base = base;
    this.top = top;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
  };

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    let stepAngle = 2 * Math.PI / this.slices;
    let stepStack = this.height / this.stacks;
    let radiusStep = (this.top - this.base) / this.stacks;

    for (let i = 0; i <= this.slices; ++i) {
      for (let j = 0; j <= this.stacks; ++j) {
        this.vertices.push((this.base + radiusStep * j) * Math.cos(stepAngle * i), (this.base + radiusStep * j) * Math.sin(stepAngle * i), j * stepStack);
        this.texCoords.push(i * 1 / this.slices, j * 1 / this.stacks);
        this.normals.push(Math.cos(stepAngle * i), Math.sin(stepAngle * i), 0);
      }
    }

    for (let i = 0; i < this.slices; ++i) {
      for (let j = 0; j < this.stacks; ++j) {
        this.indices.push(
          (i + 1) * (this.stacks + 1) + j, i * (this.stacks + 1) + j + 1, i * (this.stacks + 1) + j,
          i * (this.stacks + 1) + j + 1, (i + 1) * (this.stacks + 1) + j, (i + 1) * (this.stacks + 1) + j + 1);
      }
    }

    //add base
    //   this.vertices.push(0, 0, 0);
    //   this.texCoords.push(0.5, 0.5);
    //   this.normals.push(0, 0, -1);
    //   for (let i = 0; i < this.slices; ++i) {
    //     this.indices.push(i + (i+1)*this.stacks + 1, i + i*this.stacks, this.vertices.length/3 - 1);
    //   }

    //add top
    //   this.vertices.push(0, 0, this.height);
    //   this.texCoords.push(0.5, 0.5);
    //   this.normals.push(0, 0, 1);
    //   for (let i = 0; i < this.slices; ++i) {
    //     this.indices.push(this.vertices.length/3 - 1, i + i*this.stacks + this.stacks, i + (i+1)*this.stacks + 1 + this.stacks);
    //   }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }


  updateTexCoords(length_s, length_t) {
  }


};