/**
 * Animation used to move a piece from the tray to the tile
 * @constructor
 * @param instant Instant where the animation begins
 * @param translate Overall total translation to be applied
 */
class PieceAnimation extends Animation {
	constructor(instant, translate) {
		super(0, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
		this.keyFrameIndex = -1;
		this.translates = [[0, 0, 0], [0, 10, 0], [translate[0], translate[1] + 10, translate[2]], [0, 0, 0]];
		this.instants = [instant, instant + 1, instant + 3, instant + 4];
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
			else if (keyFrameIndex == 2)
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
};