import parse from './parse-svg-path.js'
import abs from './abs-svg-path.js'
import normalize from './normalize-svg-path.js'

export default function pathBounds(path) {
  path = parse(path)
  path = abs(path)
  path = normalize(path)

  if (!path.length) return [0, 0, 0, 0]

  var bounds = [Infinity, Infinity, -Infinity, -Infinity]

  for (var i = 0, l = path.length; i < l; i++) {
    var points = path[i].slice(1)

    for (var j = 0; j < points.length; j += 2) {
      if (points[j + 0] < bounds[0]) bounds[0] = points[j + 0]
      if (points[j + 1] < bounds[1]) bounds[1] = points[j + 1]
      if (points[j + 0] > bounds[2]) bounds[2] = points[j + 0]
      if (points[j + 1] > bounds[3]) bounds[3] = points[j + 1]
    }
  }

  return bounds
}
