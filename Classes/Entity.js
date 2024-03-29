import circularMedian from '../Utils/circular-data-median.js'
import Obstacle from './Obstacle.js'
import Vector from './Vector.js'

export default class Ball {
	static BUMPER_COUNT = 20 // 30 // resolution of angle of collision
	static BUMPER_RESOLUTION = 50 // 40 // resolution of strength of collision

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.r = 20
		this.offset = new Vector(0, 0)
		this.rays = Array(Ball.BUMPER_COUNT).fill(0).map((_, i) => {
			const angle = i / Ball.BUMPER_COUNT * Math.PI * 2
			const bumpers = Array(Ball.BUMPER_RESOLUTION - 1).fill(0).map((_, j) => {
				const r = this.r - j * this.r / Ball.BUMPER_RESOLUTION
				return {
					vec: new Vector(
						r * Math.cos(angle),
						r * Math.sin(angle)
					),
					r,
				}
			})
			return {
				angle,
				bumpers,
			}
		})
		this.position = new Vector(
			300,
			300
		)
		this.speed = new Vector(0, 0)
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Vector} mousePos
	 * @param {Obstacle[]} obstacles
	 * @param {number} dt
	 * @param {number} time
	 * @param {Vector} offsets
	 */
	update(ctx, mousePos, obstacles, dt, time, offsets){
		// this.position = mousePos
		const {x, y} = this.position
		this.position = this.position.add(this.speed)

		let [rays, minR] = this.findCollidingRays(this.rays, obstacles, ctx, offsets)
		if (rays.length > 0) {
			const angle = circularMedian(rays.map(ray => ray.angle))
			const offset = new Vector(
				(-this.r + minR) * Math.cos(angle),
				(-this.r + minR) * Math.sin(angle)
			)
			this.offset = offset
		} else {
			this.offset = new Vector(0, 0)
		}

		this.position = this.position.add(this.offset)
		const decrease = rays.length > 0 ? 0.999 : 0.99
		this.speed = new Vector(
			(this.position.x - x) * decrease,
			(this.position.y - y) * decrease,
		)
	}

	findCollidingRays(allRays, obstacles, ctx, offsets) {
		// test center
		const centerCollides = obstacles.some(obstacle => {
			return obstacle.contains(ctx, this.position, offsets)
		})
		if(centerCollides) {
			const rays = this.rays.filter(ray => {
				const currentPos = ray.bumpers[0].vec.add(this.position)
				return obstacles.some(obstacle => {
					return obstacle.contains(ctx, currentPos, offsets)
				})
			})
			const minR = -this.r * 2 * Math.max(0, rays.length / this.rays.length - 0.5)
			return [rays, minR]
		}

		// test rays individually
		let minR = Infinity
		let rays = []
		for (let i = 0; i < allRays.length; i++) {
			for (let j = 0; j < allRays[i].bumpers.length; j++) {
				const bumper = allRays[i].bumpers[j]
				if (bumper.r > minR)
					continue
				const currentPos = bumper.vec.add(this.position)
				const bumps = obstacles.some(obstacle => {
					return obstacle.contains(ctx, currentPos, offsets)
				})
				if (!bumps)
					continue
				if (bumper.r < minR) {
					minR = bumper.r
					rays = [allRays[i]]
				} else {
					rays.push(allRays[i])
				}
			}
		}
		return [rays, minR]
	}

	lastDraw = new Vector(0, 0)
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Vector} mousePos
	 */
	draw(ctx, mousePos){
		if(this.position.dist(this.lastDraw) > 0.5) {
			this.lastDraw = this.position
		}
		ball: {
			const {x, y} = this.lastDraw
			const {r} = this
			ctx.save()
			ctx.fillStyle = '#ffffff'
			ctx.beginPath()
			ctx.arc(x, y, r, 0, Math.PI * 2)
			ctx.fill()
			ctx.restore()
		}
		// rays: {
		// 	if(!this.offset)
		// 		break rays
		// 	const {x, y} = this.position
		// 	ctx.save()
		// 	ctx.strokeStyle = '#00f'
		// 	ctx.lineWidth = 1
		// 	ctx.beginPath()
		// 	ctx.moveTo(x, y)
		// 	ctx.lineTo(x + this.offset.x, y + this.offset.y)
		// 	ctx.stroke()
		// 	ctx.restore()

		// }
	}
}