/**
 * KeyFrameAnimation
 * @constructor
 * @param instants Instants of the different keyframes
 * @param translates Translation Matrices to be applied
 * @param rotates Rotation Matrices to be applied
 * @param scales Scaling Matrices to be applied
 */
class KeyFrameAnimation extends Animation {
	constructor(instants, translates, rotates, scales) {
		super(0, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
		this.keyFrameIndex = -1;
		this.translates = translates;
		this.rotates = rotates;
		this.scales = scales;
		this.instants = instants;
	};

	/**
	 * @method update
	 * Updates the current time of the animation and changes to the next keyframe if the current is finished
	 * @param delta_time Time to increment
	 */
	update(delta_time) {
		super.update(delta_time);
		if (this.keyFrameIndex >= (this.translates.length - 1)) {
			return;
		}
		if (super.isFinished()) {
			var actualKeyFrameIndex = this.keyFrameIndex;
			this.keyFrameIndex++;
			if (actualKeyFrameIndex == -1)
				super.updateAnimation(this.instants[0], this.translates[0], this.rotates[0], this.scales[0]);
			else
				super.updateAnimation(this.instants[this.keyFrameIndex] - this.instants[actualKeyFrameIndex], this.translates[this.keyFrameIndex],
					this.rotates[this.keyFrameIndex], this.scales[this.keyFrameIndex]);
		}
	}

	/**
	 * @method apply
	 * Updates current transformation matrix
	 */
	apply() {
		return super.apply();
	}
};