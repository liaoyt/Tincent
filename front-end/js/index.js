const config = {
  filterAPI: 'http://gay.edzh.me/api/filter'
}

// temp variable
let map = null
let activeLine = 0
let markers = []
let polyline = null
let houseMarkers = []

/**
 * init page
 * create map
 */
;(function init() {
  map = new qq.maps.Map(document.getElementById('container'), {
    // 地图的中心地理坐标。
    center: new qq.maps.LatLng(22.540822, 113.934457),
    zoom: 12
  })

  renderLine(routes[activeLine])

  document.getElementById('lineSelector').addEventListener('change', e => {
    // clean now house on map
    if (houseMarkers.length !== 0) {
      houseMarkers.forEach(v => v.setMap(null))
      houseMarkers = []
    }

    // close information bar
    const _DOM_INFOR_ = document.getElementById('infor')
    _DOM_INFOR_.classList.remove('show')
    _DOM_INFOR_.scrollTop = 0

    activeLine = e.target.value - 1
    const line = routes[activeLine]
    const lineValues = document.getElementsByClassName('line-value')

    lineValues[0].innerText = line.line
    lineValues[1].innerText = line.startTime
    lineValues[2].innerText = line.license
    lineValues[3].innerText = line.driverName
    lineValues[4].innerText = line.driverPhone
    lineValues[5].innerText = line.route[0].station
    lineValues[6].innerText = line.route[line.route.length - 1].station

    renderLine(line)
  })
})()

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

  const ICON = new qq.maps.MarkerImage(
    '/image/bus_station.png',
    new qq.maps.Size(40, 40),
    new qq.maps.Point(0, 0),
    new qq.maps.Point(20, 40),
    new qq.maps.Size(40, 40)
  )

  const marker = new qq.maps.Marker({
    position: E,
    map: map,
    icon: ICON
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
      markHouseToMap(res.data.data)
    } else {
      console.error(e)
      alert(`请求数据发生错误。\n${e.message}\n${res.data.message}`)
    }
  } catch (e) {
    console.error(e)
    alert(`请求数据发生错误。\n${e.message}`)
  }
}

function markHouseToMap (houses) {
  // clean now house on map
  if (houseMarkers.length !== 0) {
    houseMarkers.forEach(v => v.setMap(null))
    houseMarkers = []
  }

  document.getElementById('infor').scrollTop = 0

  // mark house to map
  houses.forEach(v => {
    const ICON = new qq.maps.MarkerImage(
      '/image/house.png',
      new qq.maps.Size(32, 32),
      new qq.maps.Point(0, 0),
      new qq.maps.Point(16, 32),
      new qq.maps.Size(32, 32)
    )

    const marker = new qq.maps.Marker({
      position: new qq.maps.LatLng(v.lat, v.lon),
      map: map,
      animation: qq.maps.MarkerAnimation.DOWN,
      icon: ICON
    })

    // hook click event to highlight item
    qq.maps.event.addListener(marker, 'click', function (e) {
      // get house DOM NODE
      const curHouse = document.getElementById(`id-${v.id}`)

      // scroll to item
      document.getElementById('infor').scrollTop = curHouse.offsetTop - 20

      // add highlight
      curHouse.classList.add('highlight')

      // remove highlight
      setTimeout(() => {
        curHouse.classList.remove('highlight')
      }, 1000)
    })

    houseMarkers.push(marker)
  })
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
      class: 'house',
      id: `id-${c.id}`
    }, [
      h('p', {
        class: 'house-name'
      }, c.name),
      h('p', {
        class: 'house-price'
      }, `￥${c.price} /月`)
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
