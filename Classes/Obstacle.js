import Vector from "./Vector.js"

export default class Obstacle {
	/**
	 * @param {SVGPathElement} path
	 */
	constructor(path) {
		const d = path.getAttribute('d')
		this.fill = path.getAttribute('fill')
		this.path = new Path2D(d)
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx 
	 */
	draw(ctx) {
		ctx.save()
		ctx.fillStyle = this.fill
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