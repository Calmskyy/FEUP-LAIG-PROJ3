/**
 * Animation
 * @constructor
 * @param span Time span of the animation
 * @param translate Translation Matrix to be applied
 * @param rotate Rotation Matrix to be applied
 * @param scale Scaling Matrix to be applied
 */
class Animation {
	constructor(span, translate, rotate, scale) {
		this.span = span * 1000;	// seconds to miliseconds
		this.current_time = 0;
		this.translate = translate;
		this.rotate = rotate;
		this.scale = scale;
		this.transformation = mat4.create();
		this.currentTranslate = [0, 0, 0];
		this.currentScale = [1, 1, 1];
		this.currentRotate = [0, 0, 0];
	};

	/**
	 * @method update
	 * Updates the current time of the animation
	 * @param delta_time Time to increment
	 */
	update(delta_time) {
		this.current_time += delta_time;
	}

	/**
	 * @method apply
	 * Updates current transformation matrix
	 */
	apply() {
		if (this.span != 0)
			var animationPercentage = this.current_time / this.span;
		else
			var animationPercentage = 1;
		if (animationPercentage > 1)
			animationPercentage = 1;
		return this.calculateTransformation(animationPercentage);
	}

	/**
	 * @method isFinished
	 * Verifies if animation is finished
	 */
	isFinished() {
		let finished = false;
		if (this.current_time >= this.span)
			finished = true;
		if (finished) {
			this.currentScale[0] *= this.scale[0];
			this.currentScale[1] *= this.scale[1];
			this.currentScale[2] *= this.scale[2];
			this.currentRotate[0] += this.rotate[0];
			this.currentRotate[1] += this.rotate[1];
			this.currentRotate[2] += this.rotate[2];
			this.currentTranslate[0] += this.translate[0];
			this.currentTranslate[1] += this.translate[1];
			this.currentTranslate[2] += this.translate[2];
		}
		return finished;
	}

	/**
	 * @method reset
	 * Resets animation time
	 */
	reset() {
		this.current_time = 0;
	}

	/**
	 * @method updateAnimation
	 * Updates the current keyframe being animated
	 * @param span Time span of the keyframe
	 * @param translate Translation Matrix to be applied
	 * @param rotate Rotation Matrix to be applied
	 * @param scale Scaling Matrix to be applied 
	 */
	updateAnimation(span, translate, rotate, scale) {
		this.span = span * 1000;
		this.rotate[0] = rotate[0] - this.currentRotate[0];
		this.rotate[1] = rotate[1] - this.currentRotate[1];
		this.rotate[2] = rotate[2] - this.currentRotate[2];
		this.scale[0] = scale[0] / this.currentScale[0];
		this.scale[1] = scale[1] / this.currentScale[1];
		this.scale[2] = scale[2] / this.currentScale[2];
		this.translate[0] = translate[0] - this.currentTranslate[0];
		this.translate[1] = translate[1] - this.currentTranslate[1];
		this.translate[2] = translate[2] - this.currentTranslate[2];
		this.reset();
	}

	/**
	 * @method calculateTransformation
	 * Calculates current transformation matrix
	 * @param animationPercentage Current animation percentage done
	 */
	calculateTransformation(animationPercentage) {
		var trans = this.translate.slice();
		var rot = this.rotate.slice();
		var sca = this.scale.slice();
		var actualTransformation = mat4.create();
		actualTransformation = this.createMatrix(actualTransformation, animationPercentage, sca, rot, trans);
		return actualTransformation;
	}

	createMatrix(out, animationPercentage, scale, rotate, translate) {
		var scaleXDiff = scale[0] - 1;
		var scaleYDiff = scale[1] - 1;
		var scaleZDiff = scale[2] - 1;
		var rotateX = rotate[0];
		var rotateY = rotate[1];
		var rotateZ = rotate[2];

		out[12] = this.currentTranslate[0] + (translate[0] * animationPercentage);
		out[13] = this.currentTranslate[1] + (translate[1] * animationPercentage);
		out[14] = this.currentTranslate[2] + (translate[2] * animationPercentage);
		out[0] = Math.cos(this.currentRotate[1] + (rotateY * animationPercentage)) * Math.cos(this.currentRotate[2] + (rotateZ * animationPercentage)) * this.currentScale[0] * (1 + (scaleXDiff * animationPercentage));
		out[1] = - (Math.sin(this.currentRotate[2] + (rotateZ * animationPercentage)));
		out[2] = - (Math.sin(this.currentRotate[1] + (rotateY * animationPercentage)));
		out[4] = Math.sin(this.currentRotate[2] + (rotateZ * animationPercentage));
		out[5] = Math.cos(this.currentRotate[0] + (rotateX * animationPercentage)) * Math.cos(this.currentRotate[2] + (rotateZ * animationPercentage)) * this.currentScale[1] * (1 + (scaleYDiff * animationPercentage));
		out[6] = Math.sin(this.currentRotate[0] + (rotateX * animationPercentage));
		out[8] = Math.sin(this.currentRotate[1] + (rotateY * animationPercentage));
		out[9] = - (Math.sin(this.currentRotate[0] + (rotateX * animationPercentage)));
		out[10] = Math.cos(this.currentRotate[0] + (rotateX * animationPercentage)) * Math.cos(this.currentRotate[1] + (rotateY * animationPercentage)) * this.currentScale[2] * (1 + (scaleZDiff * animationPercentage));

		return out;
	}

};