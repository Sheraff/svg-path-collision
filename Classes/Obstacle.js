import Vector from "./Vector.js"
import getBounds from "../Utils/svg-path-bounds/index.js"

export default class Obstacle {
	/**
	 * @param {SVGPathElement} path
	 */
	constructor(path) {
		const d = path.getAttribute('d')
		this.fill = path.getAttribute('fill')
		this.path = new Path2D(d)
		this.bounds = getBounds(d)
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {{x: number, y: number}} offsets
	 */
	draw(ctx, offsets) {
		if(!this.isActive(ctx, offsets))
			return
		ctx.save()
		ctx.fillStyle = this.fill
		ctx.fill(this.path)
		ctx.restore()
	}

	isActive(ctx, offsets) {
		const {width, height} = ctx.canvas
		const [x1, y1, x2, y2] = this.bounds
		const minX = -offsets.x
		const minY = -offsets.y
		const maxX = minX + width
		const maxY = minY + height
		return x2 >= minX && x1 <= maxX && y2 >= minY && y1 <= maxY
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx 
	 * @param {Vector} vec
	 */
	contains(ctx, vec, offsets) {
		if(!this.isActive(ctx, offsets))
			return false
		return ctx.isPointInPath(this.path, vec.x, vec.y)
	}
}