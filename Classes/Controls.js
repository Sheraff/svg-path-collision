import Vector from "./Vector.js"

export default class Controls {
	down = false
	start
	impulse = new Vector(0, 0)

	constructor(ctx, entity) {
		this.entity = entity
		ctx.canvas.addEventListener('pointerdown', this.onMouseDown.bind(this))
		window.addEventListener('pointerup', this.onMouseUp.bind(this))
		window.addEventListener('pointerleave', this.onMouseUp.bind(this))
		ctx.canvas.addEventListener('pointermove', this.onMouseUpdate.bind(this))
	}

	onMouseUpdate(event) {
		if(!this.down)
			return
		const end = new Vector(event.clientX, event.clientY)
		const vec = end.sub(this.start)
		this.impulse = vec.entrywise(new Vector(-0.1, -0.1))
		const speed = Math.hypot(this.impulse.x, this.impulse.y)
		if(speed > 20) {
			this.impulse = this.impulse.entrywise(new Vector(1 / speed, 1 / speed))
			this.impulse = this.impulse.entrywise(new Vector(30, 30))
		}
	}

	onMouseDown(event) {
		this.down = true
		this.start = new Vector(event.clientX, event.clientY)
	}

	onMouseUp(event) {
		this.onMouseUpdate(event)
		this.down = false
		this.entity.speed = this.impulse
	}

	draw(ctx) {
		if(!this.down)
			return
		ctx.save()
		ctx.strokeStyle = '#F00'
		ctx.lineWidth = 2
		ctx.beginPath()
		ctx.moveTo(this.entity.position.x, this.entity.position.y)
		ctx.lineTo(this.entity.position.x + this.impulse.x * 10, this.entity.position.y + this.impulse.y * 10)
		ctx.stroke()
		ctx.restore()
	}
	
}