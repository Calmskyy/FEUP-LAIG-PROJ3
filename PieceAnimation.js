/**
 * Animation used to move a piece from the tray to the tile
 * @constructor
 * @param translate Overall total translation to be applied
 */
class PieceAnimation extends Animation {
	constructor(translate) {
		super(0, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
		this.keyFrameIndex = -1;
		this.translates = [[0, 0, 0], [0, 0, translate[0]], [translate[2], translate[1], translate[0]], [translate[2], translate[1], 0], [translate[2], translate[1], 0]];
		this.instants = [0, 0.5, 1.5, 2, 2];
		this.updatedPosition = false;
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
				super.updateAnimation(this.instants[0], this.translates[0], [0, 0, 0], [1, 1, 1], "no");
			else if (this.keyFrameIndex == 2)
				super.updateAnimation(this.instants[this.keyFrameIndex] - this.instants[actualKeyFrameIndex], this.translates[this.keyFrameIndex],
					[0, 0, 0], [1, 1, 1], "yes");
			else
				super.updateAnimation(this.instants[this.keyFrameIndex] - this.instants[actualKeyFrameIndex], this.translates[this.keyFrameIndex],
					[0, 0, 0], [1, 1, 1], "no");
		}
	}

	/**
	 * @method apply
	 * Updates current transformation matrix
	 */
	apply() {
		return super.apply();
	}

	/**
	 * @method isFinished
	 * Returns a boolean value based on whether or not the animation has fully completed.
	 */
	isFinished() {
		if (this.keyFrameIndex >= (this.translates.length - 1))
			return true;
		else
			return false;
	}

	/**
	 * @method updatePosition
	 * If the finished piece position hasn't been updated yet, update it
	 */
	updatePosition() {
		if (this.updatedPosition == false) {
			this.updatedPosition = true;
			return true;
		}
		else
			return false;
	}

	/**
	 * @method getFinalTranslation
	 * Returns the translation performed on the object at the last instant
	 */
	getFinalTranslation() {
		return this.translates[4];
	}
};