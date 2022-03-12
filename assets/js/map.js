var map = L.map('map', {
  crs: L.CRS.Simple, // CRS.Simple, which represents a square grid:
  minZoom: -2,
  maxZoom: 1
})

var bounds = [[0, 0], [564, 651]]
var image = L.imageOverlay('./maps/Singleton.png', bounds)
image.addTo(map)
