const HEIGHT_PIX = 7207
const WIDTH_PIX = 5595
const XBOUNDS = [30, 44]
const YBOUNDS = [93, 11]

const XDIFF = XBOUNDS[1] - XBOUNDS[0]
const YDIFF = YBOUNDS[1] - YBOUNDS[0]

const WIDTH_UNITS = (XDIFF >= 0) ? XDIFF : XDIFF + 100
const HEIGHT_UNITS = (YDIFF >= 0) ? YDIFF : YDIFF + 100
const X_PIX = WIDTH_PIX / WIDTH_UNITS
const Y_PIX = HEIGHT_PIX / HEIGHT_UNITS

var bounds = [[0, 0], [HEIGHT_PIX, WIDTH_PIX]]
var map = L.map('map', {
  crs: L.CRS.EPSG4326, // CRS.Simple, which represents a square grid:
  minZoom: -3,
  maxZoom: 10,
  maxBounds: bounds,
  maxBoundsViscosity: 1.0
})
L.imageOverlay('/assets/maps/marangaroo.png', bounds).addTo(map)
map.fitBounds(bounds, { animation: false })
var locs = getLocs()
mapPoints(locs)

function getLocs () {
  const locs = []
  $('#log-body > tr').each((index, row) => {
    const loc = {
      gr: $(row).children().eq(2).html(),
      callsign: $(row).children().eq(1).html(),
      time: $(row).children().eq(3).html()
    }
    locs.push(loc)
  })
  return locs
}

function mapPoints (locs) {
  for (var i = 0; i < locs.length; i++) {
    const coords = grToMap(locs[i].gr)
    if (coords === undefined) continue
    var icon = L.divIcon({
      iconSize: null,
      html: `<div class="map-label">
              <div class="map-label-content">
                ${locs[i].callsign}
              </div>
              <div class="map-label-arrow"></div>
            </div> `
    });
    const options = {
      title: locs[i].callsign,
      clickable: false,
      draggable: false,
      icon: icon
    }
    L.marker(coords, options).addTo(map)
  }
}

/* doesnt check for locs out of bounds of map */
function grToMap (gr) {
  if (gr > 999999) return undefined
  const gridY = (gr % 1000) / 10
  const gridX = (~~(gr / 1000)) / 10 // 123456 => [12.3, 45.6]
  if (!pointsInBounds(gridX, gridY)) return undefined
  var mapX = (gridX < XBOUNDS[0]) ? gridX - XBOUNDS[0] + 100 : gridX - XBOUNDS[0]
  mapX *= X_PIX
  var mapY = (gridY < YBOUNDS[0]) ? gridY - YBOUNDS[0] + 100 : gridY - YBOUNDS[0]
  mapY *= Y_PIX
  return [mapY, mapX]
}

function pointsInBounds (x, y) {
  if (XDIFF >= 0) {
    if (x < XBOUNDS[0] || XBOUNDS[1] < x) return false
  } else {
    if (x < XBOUNDS[0] && x > XBOUNDS[1]) return false
    if (x >= 100) return false
  }
  if (YDIFF >= 0) {
    if (y < YBOUNDS[0] || YBOUNDS[1] < y) return false
  } else {
    if (y < YBOUNDS[0] && y > YBOUNDS[1]) return false
    if (y >= 100) return false
  }
  return true
}
