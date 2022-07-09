import Vector from "./Vector.js"

export default class Obstacle {
	/**
	 * @param {string} d 
	 */
	constructor(d) {
		this.d = d
		this.path = new Path2D(d)
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx 
	 */
	draw(ctx) {
		ctx.save()
		ctx.fillStyle = '#414042'
		ctx.fill(this.path)
		ctx.restore()
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx 
	 * @param {Vector} vec
	 */
	contains(ctx, vec) {
		return ctx.isPointInPath(this.path, vec.x, vec.y)
	}
}