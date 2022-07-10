async function getImageBitmap(url) {
	const data = await fetch(url)
	const blob = await data.blob()
	const bitmap = await createImageBitmap(blob)
	return bitmap
}

export default class BitmapImage {
	constructor(url) {
		this.url = url
		this.bitmap = null
	}

	async load() {
		this.bitmap = await getImageBitmap(this.url)
	}

	draw(ctx, offset) {
		const {width, height} = ctx.canvas
		const {x, y} = offset
		ctx.drawImage(
			this.bitmap,
			-x,
			-y,
			width,
			height,
			-x,
			-y,
			width,
			height
		)
	}
}