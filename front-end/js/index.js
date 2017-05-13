const config = {
  filterAPI: 'http://gay.edzh.me/api/filter'
}
const DEBUG = true

// hook console
;(function () {
  if (!DEBUG) {
    console.log = () => {}
  }
})()

let map = null
/**
 * init page
 * create map
 */
function init() {
  map = new qq.maps.Map(document.getElementById('container'), {
    // 地图的中心地理坐标。
    center: new qq.maps.LatLng(22.540822, 113.934457),
    zoom: 14
  })

  renderLine(routes[0])
}

let markers = []
let polyline = null
/**
 * draw path and point to map
 * @param {object} line
 */
async function renderLine (line) {
  console.log(`render line: `, line)

  // remove markers when some markers have been drewve
  if (markers.length !== 0) {
    markers.forEach(marker => {
      marker.setMap(null)
    })

    markers = []
  }

  // remove polyline when polyline have been drewve
  if (polyline !== null) {
    polyline.setMap(null)
  }

  const points = []
  for (let i = 0; i < line.route.length; i++) {
    const point = line.route[i]

    if (point.longitude === 'unknown' || point.latitude === 'unknown') {
      console.log(`unknown location: ${point.station}`)

      // fetch location information
      const locationMatched = point.station.match(/(^.+)[\(（]/)
        ? point.station.match(/(^.+)[\(（]/)[1]
        : point.station
      const res = await getLocation(locationMatched)
      console.log(`get location: `, res.detail)

      const l = res.detail.location
      
      // add point to path
      points.push(new qq.maps.LatLng(l.lat, l.lng))

      // mark point to map
      markers.push(markToMap(l, point))
    } else {
      // add point to path
      points.push(new qq.maps.LatLng(point.latitude, point.longitude))

      // mark point to map
      markers.push(markToMap({
        lat: point.latitude,
        lng: point.longitude
      }, point))
    }
  }

  // draw path
  polyline = new qq.maps.Polyline({
    path: points,
    strokeColor: '#2196F3',
    strokeWeight: 3,
    map
  })
}

/**
 * mark a point to map and listen click event
 * @param {object} l latitude and longitude
 * @param {object} point point information
 */
function markToMap (l, point) {
  console.log(`mark point: `, l)
  const E = new qq.maps.LatLng(l.lat, l.lng)
  const marker = new qq.maps.Marker({
    position: E,
    map: map
  })

  qq.maps.event.addListener(marker, 'click', function () {
    map.setCenter(E)
    map.setZoom(14)
    resource(l, point)
  })

  return marker
}

/**
 * load house resource from backend
 * @param {object} l latitude and longitude
 * @param {object} point point information
 */
async function resource (l, point) {
  console.log(`load resources: `, l, point)

  try {
    const res = await axios({
      url: config.filterAPI,
      method: 'POST',
      data: {
        points: [[l.lng, l.lat]],
        distanceRange: 1000
      }
    })

    if (res.status === 200 && res.data.code === 88) {
      renderResource(point, res.data.data)
    } else {
      console.error(e)
      alert(`请求数据发生错误。\n${e.message}\n${res.data.message}`)
    }
  } catch (e) {
    console.error(e)
    alert(`请求数据发生错误。\n${e.message}`)
  }
}

/**
 * load house resource from backend
 * @param {object} station station information
 * @param {object} resources resources around station
 */
function renderResource (station, resources) {
  const _DOM_info = document.getElementById('infor')

  const _FRAGMENT_ = resources.map(c => {
    return h('a', {
      href: c.url,
      target: 'blank',
      class: 'house'
    }, [
      h('p', {
        class: 'house-name'
      }, c.name),
      h('p', {
        class: 'house-price'
      }, c.price)
    ])
  })

  const _HTML_ = [
    h('div', {
      class: 'close-info',
      onclick: 'closeInfo()'
    }, '×'),
    h('h1', {}, station.station),
    h('p', {}, `班车到达时间：${station.arrivalTime}`),
    '<h3 class="sub-title">周边房产</h3>',
    h('div', {
      class: 'houses-list'
    }, _FRAGMENT_),
  ].join('\n')

  _DOM_info.innerHTML = _HTML_
  _DOM_info.classList.add('show')
}

function closeInfo () {
  document.getElementById('infor').classList.remove('show')
}

/**
 * simple dom render
 * @param {string} tagName tagName
 * @param {object} props attributes
 * @param {string|array} children children node
 */
function h (tagName, props, children) {
  if (typeof tagName !== 'string') throw new Error(`tag name must be a string`)

  const _ATTR_ = Object.keys(props).reduce((p, v) => {
    return p += ` ${v}="${props[v]}"`
  }, '')

  const _CONTENT_ = children
    ? Array.isArray(children)
      ? children.join('')
      : children
    : ''

  return `<${tagName} ${_ATTR_}>${_CONTENT_}</${tagName}>`
}

/**
 * load location information (latitude and longitude)
 * @param {string} name place name
 * @return {Promise}
 */
function getLocation (name) {
  return new Promise((resolve, reject) => {
    const geocoder = new qq.maps.Geocoder({
      complete: function (res) {
        resolve(res)
      }
    })
    geocoder.getLocation(`中国,深圳,${name}`)
  })
}
