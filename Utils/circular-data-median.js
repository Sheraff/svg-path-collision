/**
 * 
 * Implementation of median angle function
 * A More Efficient Way Of Obtaining A Unique Median Estimate For Circular Data
 * 2003 / B. Sango Otieno & Christine M. Anderson-Cook
 * from the annexes in https://digitalcommons.wayne.edu/cgi/viewcontent.cgi?referer=&httpsredir=1&article=1738&context=jmasm
 * 
 */

/**
 * Median Estimate For Circular Data
 * @param {Array<number>} array - array of radians (angles or other circular data modulo 2𝜋)
 */
export default function circularMedian(array) {
	const sx = [...array].sort()
	const difsin = []
	const numties = []

	// Checks if sample size is odd or even
	const posmed = !(sx.length & 1)
		? checkeven(sx)
		: checkodd(sx)

	for(let i = 0; i < posmed.length; i++) {
		const newx = sx.map(x => x - posmed[i])
		difsin[i] = newx.filter(x => Math.sin(x) > 0).length - newx.filter(x => Math.sin(x) < 0).length
		numties[i] = newx.filter(x => Math.sin(x) === 0).length
	}

	// Checks for ties
	const cm = posmed.filter((_, i) => difsin[i] === 0 || Math.abs(difsin[i]) > numties[i])
	return cm.length
		? averageAngle(cm)
		: Infinity
}

/**
 * @param {Array<number>} array
 */
function averageAngle(array) {
	const y = array.reduce((sum, current) => sum + Math.sin(current), 0)
	const x = array.reduce((sum, current) => sum + Math.cos(current), 0)
	return x === 0 && y === 0
		? Infinity
		: Math.atan2(y, x)
	// If both x and y are zero, then no circular mean exists, so assign it a large number
}

/**
 * @param {Array<number>} sx
 */
function checkeven(sx) {
	const check = []
	// Computes possible medians
	const posmed = posmedf(sx)
	for (let i = 0; i < posmed.length; i++) {
		// Takes posmed[i] as the center, i.e. draws diameter at posmed[i] and counts observations on either side of the diameter
		if (sx.filter(x => Math.cos(x - posmed[i]) > 0).length >= sx.length / 2)
			check.push(posmed[i])
	}
	
	return check
}

/**
 * @param {Array<number>} sx
 */
function checkodd(sx) {
	const check = []
	// Each observation is a possible median
	for (let i = 0; i < sx.length; i++) {
		// Takes posmed[i] as the center, i.e. draws diameter at posmed[i] and counts observations on either side of the diameter
		if (sx.filter(x => Math.cos(x - sx[i]) > 0).length >= (sx.length - 1) / 2)
			check.push(sx[i])
	}
	
	return check
}

/**
 * @param {Array<number>} sx
 */
function posmedf(sx) {
	const [first, ...rest] = [...sx]
	const sx2 = [...rest, first]
	// Determines closest neighbors of a fixed observation
	const posmed = sx.map((x, i) => averageAngle([x, sx2[i]]))
	// Computes circular mean of two adjacent observations
	return posmed.filter(x => x !== Infinity)
}
