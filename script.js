import Entity from './Classes/Entity.js'
import Vector from './Classes/Vector.js'
import Obstacle from './Classes/Obstacle.js'
import Controls from './Classes/Controls.js'

const WORLD_TIME_SPEED = 1

const canvas = document.querySelector('canvas')
if(!canvas)
	throw new Error('No canvas found')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext('2d')
if(!ctx)
	throw new Error('No context found')

const background = Array.from(document.querySelectorAll('svg #background path[d]'))
const collisions = Array.from(document.querySelectorAll('svg #collisions path[d]'))
const foreground = Array.from(document.querySelectorAll('svg #foreground path[d]'))

/**
 * @param {CanvasRenderingContext2D} ctx
 */
void function (ctx) {
	const entity = new Entity(ctx)
	const mousePos = new Vector(entity.position.x, entity.position.y)
	const obstacles = collisions.map(path => new Obstacle(path))
	const staticBack = background.map(path => new Obstacle(path))
	const staticFront = foreground.map(path => new Obstacle(path))
	const controls = new Controls(ctx, entity)
	update(ctx, mousePos, entity, obstacles)
	draw(ctx, mousePos, [
		...staticBack,
		// ...obstacles,
		entity,
		...staticFront,
		controls
	], entity)
}(ctx)

function update(ctx, mousePos, entity, obstacles) {
	window.addEventListener('pointermove', event => {
		mousePos.x = event.clientX
		mousePos.y = event.clientY
	})
	function loop(lastTime) {
		requestAnimationFrame((time) => {
			const modifiedTime = time * WORLD_TIME_SPEED
			const delta = lastTime ? modifiedTime - lastTime : 0
			entity.update(ctx, mousePos, obstacles, delta, modifiedTime)
			loop(modifiedTime)
		})
	}
	loop(0)
}

function draw(ctx, mousePos, entities, entity) {
	const offsets = {
		x: 0,
		y: 0,
	}
	function loop() {
		requestAnimationFrame(() => {
			if(entity.position.x + offsets.x < 400) {
				offsets.x = 400 - entity.position.x
			} else if(entity.position.x + offsets.x > ctx.canvas.width - 400) {
				offsets.x = ctx.canvas.width - 400 - entity.position.x
			}
			if(entity.position.y + offsets.y < 200) {
				offsets.y = 200 - entity.position.y
			} else if(entity.position.y + offsets.y > ctx.canvas.height - 200) {
				offsets.y = ctx.canvas.height - 200 - entity.position.y
			}
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
			ctx.save()
			ctx.translate(offsets.x, offsets.y)
			entities.forEach(entity => entity.draw(ctx))
			ctx.restore()
			loop()
		})
	}
	loop()
}