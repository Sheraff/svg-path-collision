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
	const offsets = new Vector(0, 0)
	update(ctx, mousePos, entity, obstacles, offsets)
	draw(ctx, mousePos, [
		...staticBack,
		// ...obstacles,
		entity,
		...staticFront,
		controls
	], entity, offsets)
}(ctx)

function update(ctx, mousePos, entity, obstacles, offsets) {
	window.addEventListener('pointermove', event => {
		mousePos.x = event.clientX
		mousePos.y = event.clientY
	})
	const xOffsetMax = Math.min(400, window.innerWidth / 3)
	const yOffsetMax = Math.min(200, window.innerHeight / 3)
	function loop(lastTime) {
		requestAnimationFrame((time) => {
			const modifiedTime = time * WORLD_TIME_SPEED
			const delta = lastTime ? modifiedTime - lastTime : 0
			entity.update(ctx, mousePos, obstacles, delta, modifiedTime, offsets)
			if(entity.position.x + offsets.x < xOffsetMax) {
				offsets.x = xOffsetMax - entity.position.x
			} else if(entity.position.x + offsets.x > ctx.canvas.width - xOffsetMax) {
				offsets.x = ctx.canvas.width - xOffsetMax - entity.position.x
			}
			if(entity.position.y + offsets.y < yOffsetMax) {
				offsets.y = yOffsetMax - entity.position.y
			} else if(entity.position.y + offsets.y > ctx.canvas.height - yOffsetMax) {
				offsets.y = ctx.canvas.height - yOffsetMax - entity.position.y
			}
			loop(modifiedTime)
		})
	}
	loop(0)
}

function draw(ctx, mousePos, entities, entity, offsets) {
	
	function loop() {
		requestAnimationFrame(() => {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
			ctx.save()
			ctx.translate(offsets.x, offsets.y)
			entities.forEach(entity => entity.draw(ctx, offsets))
			ctx.restore()
			loop()
		})
	}
	loop()
}