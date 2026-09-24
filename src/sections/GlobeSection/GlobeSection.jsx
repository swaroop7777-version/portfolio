import { useEffect, useRef, useState, useCallback } from 'react'

// ─── Great circle distance & flight time ─────────────────────────────────────
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}
function flightTime(km) {
  const hrs = km / 850 + 0.5 // avg 850 km/h + 30min taxi
  const h = Math.floor(hrs), m = Math.round((hrs - h) * 60)
  return `${h}h ${m}m`
}

// ─── World clock ──────────────────────────────────────────────────────────────
const CONTINENT_TZ = {
  'North America': ['America/New_York','America/Chicago','America/Los_Angeles'],
  'South America': ['America/Sao_Paulo','America/Buenos_Aires'],
  'Europe':        ['Europe/London','Europe/Paris','Europe/Berlin'],
  'Africa':        ['Africa/Cairo','Africa/Lagos','Africa/Johannesburg'],
  'Asia':          ['Asia/Dubai','Asia/Mumbai','Asia/Singapore','Asia/Tokyo'],
  'Oceania':       ['Australia/Sydney','Pacific/Auckland'],
  'Antarctica':    ['Antarctica/McMurdo'],
}
function getContinentClocks(continent) {
  const tzs = CONTINENT_TZ[continent] || []
  return tzs.map(tz => {
    const now = new Date()
    const time = now.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' })
    const city = tz.split('/')[1]?.replace('_', ' ')
    return { city, time, tz }
  })
}

// ─── Real flight routes ────────────────────────────────────────────────────────
const ROUTES = [
  { id:'BA001', from:'London Heathrow',    fIATA:'LHR', toLoc:'New York JFK',        tIATA:'JFK', lat1:51.47,  lon1:-0.46,  lat2:40.64,  lon2:-73.78, airline:'British Airways',  color:'#00aaff' },
  { id:'EK201', from:'Dubai',              fIATA:'DXB', toLoc:'London Heathrow',      tIATA:'LHR', lat1:25.25,  lon1:55.36,  lat2:51.47,  lon2:-0.46,  airline:'Emirates',         color:'#cc0000' },
  { id:'SQ321', from:'Singapore',          fIATA:'SIN', toLoc:'Los Angeles',          tIATA:'LAX', lat1:1.35,   lon1:103.99, lat2:33.94,  lon2:-118.41,airline:'Singapore Air',    color:'#ffd700' },
  { id:'QF001', from:'Sydney',             fIATA:'SYD', toLoc:'Dallas Fort Worth',    tIATA:'DFW', lat1:-33.94, lon1:151.18, lat2:32.9,   lon2:-97.04, airline:'Qantas',           color:'#ff2200' },
  { id:'AF002', from:'Paris CDG',          fIATA:'CDG', toLoc:'São Paulo',            tIATA:'GRU', lat1:49.01,  lon1:2.55,   lat2:-23.43, lon2:-46.47, airline:'Air France',       color:'#0055cc' },
  { id:'JL003', from:'Tokyo Haneda',       fIATA:'HND', toLoc:'Frankfurt',            tIATA:'FRA', lat1:35.55,  lon1:139.78, lat2:50.04,  lon2:8.56,   airline:'Japan Airlines',   color:'#cc0033' },
  { id:'AA100', from:'New York JFK',       fIATA:'JFK', toLoc:'Los Angeles',          tIATA:'LAX', lat1:40.64,  lon1:-73.78, lat2:33.94,  lon2:-118.41,airline:'American Airlines',color:'#0099dd' },
  { id:'LH400', from:'Frankfurt',          fIATA:'FRA', toLoc:'Singapore',            tIATA:'SIN', lat1:50.04,  lon1:8.56,   lat2:1.35,   lon2:103.99, airline:'Lufthansa',        color:'#ffcc00' },
  { id:'UA501', from:'San Francisco',      fIATA:'SFO', toLoc:'Tokyo Haneda',         tIATA:'HND', lat1:37.62,  lon1:-122.38,lat2:35.55,  lon2:139.78, airline:'United',           color:'#003388' },
  { id:'CX101', from:'Hong Kong',          fIATA:'HKG', toLoc:'London Heathrow',      tIATA:'LHR', lat1:22.31,  lon1:113.91, lat2:51.47,  lon2:-0.46,  airline:'Cathay Pacific',   color:'#006666' },
  { id:'TK001', from:'Istanbul',           fIATA:'IST', toLoc:'New York JFK',         tIATA:'JFK', lat1:40.98,  lon1:28.82,  lat2:40.64,  lon2:-73.78, airline:'Turkish Airlines', color:'#cc3300' },
  { id:'AC801', from:'Toronto',            fIATA:'YYZ', toLoc:'London Heathrow',      tIATA:'LHR', lat1:43.68,  lon1:-79.63, lat2:51.47,  lon2:-0.46,  airline:'Air Canada',       color:'#cc0000' },
]

// ─── Main component ───────────────────────────────────────────────────────────
export default function GlobeSection() {
  const containerRef = useRef(null)
  const globeRef     = useRef(null)
  const [ready,   setReady]   = useState(false)
  const [quakes,  setQuakes]  = useState([])
  const [weather, setWeather] = useState({})
  const [tooltip, setTooltip] = useState(null)
  const [clock,   setClock]   = useState(null)
  const [stats,   setStats]   = useState({ quakes:0, flights:ROUTES.length, iss:'...' })
  const [tab,     setTab]     = useState('flights') // flights | quakes | iss | weather

  // ── Build globe ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let globe = null
    let issInterval = null

    async function init() {
      const { default: Globe } = await import('globe.gl')
      if (!containerRef.current) return

      // Calc route distances
      const routes = ROUTES.map(r => ({
        ...r,
        dist: Math.round(haversine(r.lat1, r.lon1, r.lat2, r.lon2)),
        time: flightTime(haversine(r.lat1, r.lon1, r.lat2, r.lon2)),
      }))

      globe = Globe()(containerRef.current)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .showGraticules(true)
        .showAtmosphere(true)
        .atmosphereColor('#0099ff')
        .atmosphereAltitude(0.18)
        // Flight arcs
        .arcsData(routes)
        .arcStartLat(d => d.lat1).arcStartLng(d => d.lon1)
        .arcEndLat(d => d.lat2).arcEndLng(d => d.lon2)
        .arcColor(d => [d.color+'88', d.color+'ff'])
        .arcAltitude(0.3)
        .arcStroke(0.7)
        .arcDashLength(0.4)
        .arcDashGap(0.15)
        .arcDashAnimateTime(3500)
        .onArcHover(arc => {
          if (!arc) { setTooltip(null); return }
          setTooltip({
            type: 'flight',
            id: arc.id,
            airline: arc.airline,
            from: `${arc.from} (${arc.fIATA})`,
            to:   `${arc.toLoc} (${arc.tIATA})`,
            dist: arc.dist,
            time: arc.time,
            alt:  Math.round(10000 + Math.random()*2000),
            speed: Math.round(820 + Math.random()*60),
          })
        })
        // Airport dots
        .pointsData(routes.flatMap(r => [
          { lat:r.lat1, lng:r.lon1, label:r.from,  iata:r.fIATA, size:0.35 },
          { lat:r.lat2, lng:r.lon2, label:r.toLoc, iata:r.tIATA, size:0.35 },
        ]))
        .pointColor(() => '#00d4c8')
        .pointAltitude(0.001)
        .pointRadius('size')
        .pointLabel(d => `<div style="background:rgba(0,0,0,0.8);border:1px solid #00d4c8;border-radius:6px;padding:6px 10px;font-family:monospace;font-size:11px;color:#f5f0e8"><b>${d.iata}</b> — ${d.label}</div>`)
        .width(containerRef.current.clientWidth)
        .height(containerRef.current.clientHeight)

      // Auto-rotate slowly
      globe.controls().autoRotate = true
      globe.controls().autoRotateSpeed = 0.4
      globe.controls().enableZoom = true
      globe.controls().minDistance = 150
      globe.controls().maxDistance = 600
      globe.pointOfView({ altitude: 2.5 })

      globeRef.current = { globe, routes }
      setReady(true)

      // ── Fetch earthquakes ──────────────────────────────────────────────────
      try {
        const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson')
        const json = await res.json()
        const qData = json.features.slice(0, 100).map(f => ({
          lat:   f.geometry.coordinates[1],
          lng:   f.geometry.coordinates[0],
          mag:   f.properties.mag || 2.5,
          place: f.properties.place || 'Unknown',
          time:  new Date(f.properties.time).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }),
          depth: Math.abs(Math.round(f.geometry.coordinates[2])),
        }))
        setQuakes(qData)
        setStats(s => ({ ...s, quakes: qData.length }))

        globe
          .ringsData(qData)
          .ringLat(d => d.lat).ringLng(d => d.lng)
          .ringColor(d => t => {
            const base = d.mag >= 6 ? '#ff1100' : d.mag >= 5 ? '#ff6600' : d.mag >= 4 ? '#ffaa00' : '#ff44aa'
            return base + Math.round((1-t)*255).toString(16).padStart(2,'0')
          })
          .ringMaxRadius(d => d.mag * 1.8)
          .ringPropagationSpeed(1.5)
          .ringRepeatPeriod(d => 1200 + d.mag * 200)
          .onRingHover(ring => {
            if (!ring) { setTooltip(null); return }
            setTooltip({
              type:  'quake',
              place: ring.place,
              mag:   ring.mag,
              depth: ring.depth,
              time:  ring.time,
              intensity: ring.mag >= 7 ? 'Major 🔴' : ring.mag >= 6 ? 'Strong 🟠' : ring.mag >= 5 ? 'Moderate 🟡' : 'Light 🟢',
            })
          })
      } catch(e) { console.warn('Quakes failed', e) }

      // ── ISS tracking ──────────────────────────────────────────────────────
      const issMarker = [{ lat:0, lng:0, label:'ISS', size:0.6 }]
      globe
        .labelsData(issMarker)
        .labelLat(d => d.lat).labelLng(d => d.lng)
        .labelText(() => '🛸')
        .labelSize(1.2)
        .labelAltitude(0.01)
        .labelColor(() => '#ffff00')

      async function updateISS() {
        try {
          const d = await fetch('https://api.open-notify.org/iss-now.json').then(r=>r.json())
          const lat = parseFloat(d.iss_position.latitude)
          const lng = parseFloat(d.iss_position.longitude)
          issMarker[0].lat = lat; issMarker[0].lng = lng
          globe.labelsData([...issMarker])
          setStats(s => ({ ...s, iss:`${lat.toFixed(1)}°N ${lng.toFixed(1)}°E` }))
        } catch {}
      }
      await updateISS()
      issInterval = setInterval(updateISS, 5000)

      // ── Weather (Open-Meteo, free, no key) ────────────────────────────────
      const cities = [
        { name:'London',    lat:51.5, lng:-0.1 },
        { name:'New York',  lat:40.7, lng:-74 },
        { name:'Tokyo',     lat:35.7, lng:139.7 },
        { name:'Sydney',    lat:-33.9,lng:151.2 },
        { name:'Dubai',     lat:25.2, lng:55.3 },
        { name:'São Paulo', lat:-23.5,lng:-46.6 },
        { name:'Lagos',     lat:6.5,  lng:3.4 },
        { name:'Mumbai',    lat:19.1, lng:72.9 },
      ]
      try {
        const weatherData = {}
        await Promise.all(cities.map(async city => {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`
          const d = await fetch(url).then(r=>r.json())
          const code = d.current.weather_code
          const icon = code <= 1 ? '☀️' : code <= 3 ? '⛅' : code <= 48 ? '🌫' : code <= 67 ? '🌧' : code <= 77 ? '❄️' : code <= 82 ? '🌦' : '⛈'
          weatherData[city.name] = { temp: Math.round(d.current.temperature_2m), icon, wind: Math.round(d.current.wind_speed_10m) }
        }))
        setWeather(weatherData)

        globe
          .htmlElementsData(cities)
          .htmlLat(d => d.lat).htmlLng(d => d.lng)
          .htmlAltitude(0.01)
          .htmlElement(d => {
            const w = weatherData[d.name]
            if (!w) return null
            const el = document.createElement('div')
            el.innerHTML = `<div style="font-family:monospace;font-size:10px;background:rgba(0,0,0,0.75);border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:3px 7px;color:#f5f0e8;white-space:nowrap;pointer-events:none">${w.icon} ${d.name} ${w.temp}°C</div>`
            return el
          })
      } catch(e) { console.warn('Weather failed', e) }
    }

    init()
    return () => {
      clearInterval(issInterval)
      if (globeRef.current?.globe) {
        try { globeRef.current.globe._destructor?.() } catch {}
      }
    }
  }, [])

  // ── World clock ticker ───────────────────────────────────────────────────────
  useEffect(() => {
    const tick = setInterval(() => {
      if (clock) setClock(c => c ? { ...c, clocks: getContinentClocks(c.continent) } : c)
    }, 1000)
    return () => clearInterval(tick)
  }, [clock])

  // ── Resize handler ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      if (globeRef.current?.globe && containerRef.current) {
        globeRef.current.globe.width(containerRef.current.clientWidth).height(containerRef.current.clientHeight)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const quakeColor = m => m >= 6 ? '#ff1100' : m >= 5 ? '#ff6600' : m >= 4 ? '#ffaa00' : '#ff44aa'

  return (
    <div data-dark style={{ background:'#000', position:'relative', width:'100%', height:'90vh', overflow:'hidden' }}>

      {/* Globe canvas */}
      <div ref={containerRef} style={{ width:'100%', height:'100%' }} />

      {/* Loading */}
      {!ready && (
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'#000' }}>
          <div style={{ fontFamily:'monospace', color:'#00d4c8', fontSize:'0.8rem', letterSpacing:'0.15em', textAlign:'center' }}>
            <div style={{ marginBottom:8 }}>◌ LOADING EARTH...</div>
            <div style={{ fontSize:'0.6rem', color:'#333' }}>Fetching live data</div>
          </div>
        </div>
      )}

      {/* HUD top-left */}
      <div style={{ position:'absolute', top:20, left:24, fontFamily:'monospace', pointerEvents:'none' }}>
        <div style={{ fontSize:'0.55rem', color:'#00d4c8', letterSpacing:'0.2em', opacity:0.8, marginBottom:4 }}>◈ GLOBAL INTELLIGENCE</div>
        <div style={{ fontSize:'0.65rem', color:'#00d4c8', display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:'#00d4c8', display:'inline-block', animation:'pulse 2s infinite' }}/>
          LIVE
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ position:'absolute', top:20, left:'50%', transform:'translateX(-50%)', display:'flex', gap:4 }}>
        {['flights','quakes','weather'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            fontFamily:'monospace', fontSize:'0.6rem', letterSpacing:'0.1em',
            padding:'5px 12px', borderRadius:4, border:'1px solid',
            borderColor: tab===t ? '#00d4c8' : '#1a1a1a',
            background: tab===t ? 'rgba(0,212,200,0.12)' : 'transparent',
            color: tab===t ? '#00d4c8' : '#444',
            cursor:'none', textTransform:'uppercase', transition:'all 0.2s',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Stats top-right */}
      <div style={{ position:'absolute', top:20, right:24, fontFamily:'monospace', textAlign:'right', pointerEvents:'none' }}>
        {[
          { c:'#00d4c8', l:'ROUTES',     v:stats.flights },
          { c:'#ff5500', l:'EARTHQUAKES', v:stats.quakes },
          { c:'#ffff00', l:'ISS',         v:stats.iss },
        ].map(s => (
          <div key={s.l} style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'flex-end', marginBottom:6 }}>
            <span style={{ fontSize:'0.55rem', color:'#333', letterSpacing:'0.1em' }}>{s.l}</span>
            <span style={{ fontSize:'0.8rem', fontWeight:700, color:s.c, minWidth:80, textAlign:'right' }}>{s.v}</span>
            <span style={{ width:5, height:5, borderRadius:'50%', background:s.c, animation:'pulse 2s infinite', display:'inline-block' }}/>
          </div>
        ))}
      </div>

      {/* Side panel — flights or quakes */}
      {tab === 'flights' && (
        <div style={{
          position:'absolute', top:'50%', transform:'translateY(-50%)',
          left:20, width:220,
          background:'rgba(0,0,0,0.85)', border:'1px solid #0d1f2d',
          borderRadius:10, padding:'12px 14px', fontFamily:'monospace',
          backdropFilter:'blur(12px)', maxHeight:'60vh', overflowY:'auto',
        }}>
          <div style={{ fontSize:'0.55rem', color:'#00d4c8', letterSpacing:'0.15em', marginBottom:8 }}>LIVE ROUTES</div>
          {(globeRef.current?.routes || ROUTES).map(r => {
            const dist = Math.round(haversine(r.lat1,r.lon1,r.lat2,r.lon2))
            return (
              <div key={r.id} style={{ borderBottom:'1px solid #0d1f2d', paddingBottom:8, marginBottom:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                  <span style={{ fontSize:'0.65rem', fontWeight:700, color:r.color }}>{r.id}</span>
                  <span style={{ fontSize:'0.55rem', color:'#555' }}>{flightTime(dist)}</span>
                </div>
                <div style={{ fontSize:'0.6rem', color:'#666', lineHeight:1.5 }}>
                  {r.fIATA} → {r.tIATA}<br/>
                  <span style={{ color:'#444' }}>{dist.toLocaleString()} km</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'quakes' && quakes.length > 0 && (
        <div style={{
          position:'absolute', top:'50%', transform:'translateY(-50%)',
          left:20, width:230,
          background:'rgba(0,0,0,0.85)', border:'1px solid #1a0a00',
          borderRadius:10, padding:'12px 14px', fontFamily:'monospace',
          backdropFilter:'blur(12px)', maxHeight:'65vh', overflowY:'auto',
        }}>
          <div style={{ fontSize:'0.55rem', color:'#ff5500', letterSpacing:'0.15em', marginBottom:8 }}>SEISMIC ACTIVITY</div>
          {quakes.slice(0,15).map((q,i) => (
            <div key={i} style={{ borderBottom:'1px solid #1a0800', paddingBottom:7, marginBottom:7 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                <span style={{ fontSize:'0.7rem', fontWeight:700, color:quakeColor(q.mag) }}>M{q.mag.toFixed(1)}</span>
                <span style={{ fontSize:'0.55rem', color:'#444' }}>{q.depth}km deep</span>
              </div>
              <div style={{ fontSize:'0.58rem', color:'#666', lineHeight:1.5 }}>{q.place}</div>
              <div style={{ fontSize:'0.53rem', color:'#333', marginTop:2 }}>{q.time}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'weather' && Object.keys(weather).length > 0 && (
        <div style={{
          position:'absolute', top:'50%', transform:'translateY(-50%)',
          left:20, width:200,
          background:'rgba(0,0,0,0.85)', border:'1px solid #001a1a',
          borderRadius:10, padding:'12px 14px', fontFamily:'monospace',
          backdropFilter:'blur(12px)',
        }}>
          <div style={{ fontSize:'0.55rem', color:'#00d4c8', letterSpacing:'0.15em', marginBottom:8 }}>LIVE WEATHER</div>
          {Object.entries(weather).map(([city, w]) => (
            <div key={city} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div>
                <div style={{ fontSize:'0.65rem', color:'#f5f0e8', fontWeight:600 }}>{city}</div>
                <div style={{ fontSize:'0.55rem', color:'#444' }}>Wind {w.wind} km/h</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'1rem' }}>{w.icon}</div>
                <div style={{ fontSize:'0.7rem', fontWeight:700, color:'#00d4c8' }}>{w.temp}°C</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hover tooltip */}
      {tooltip && (
        <div style={{
          position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)',
          background:'rgba(0,0,0,0.92)', borderRadius:10, fontFamily:'monospace',
          backdropFilter:'blur(12px)', animation:'fadeIn 0.15s ease',
          border: `1px solid ${tooltip.type==='flight'?'#00d4c8':'#ff5500'}`,
          padding:'14px 20px', minWidth:280, pointerEvents:'none',
        }}>
          {tooltip.type === 'flight' ? (
            <>
              <div style={{ fontSize:'0.55rem', color:'#444', letterSpacing:'0.12em', marginBottom:6 }}>FLIGHT INFORMATION</div>
              <div style={{ fontSize:'0.9rem', fontWeight:900, color:'#00d4c8', marginBottom:8 }}>{tooltip.id} — {tooltip.airline}</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 16px', fontSize:'0.72rem' }}>
                <div><span style={{ color:'#444' }}>FROM </span><span style={{ color:'#f5f0e8' }}>{tooltip.from}</span></div>
                <div><span style={{ color:'#444' }}>TO </span><span style={{ color:'#f5f0e8' }}>{tooltip.to}</span></div>
                <div><span style={{ color:'#444' }}>DIST </span><span style={{ color:'#f5f0e8' }}>{tooltip.dist?.toLocaleString()} km</span></div>
                <div><span style={{ color:'#444' }}>ETA </span><span style={{ color:'#00d4c8', fontWeight:700 }}>{tooltip.time}</span></div>
                <div><span style={{ color:'#444' }}>ALT </span><span style={{ color:'#f5f0e8' }}>{tooltip.alt?.toLocaleString()} m</span></div>
                <div><span style={{ color:'#444' }}>SPD </span><span style={{ color:'#f5f0e8' }}>{tooltip.speed} km/h</span></div>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize:'0.55rem', color:'#444', letterSpacing:'0.12em', marginBottom:6 }}>SEISMIC EVENT</div>
              <div style={{ fontSize:'0.9rem', fontWeight:900, color:quakeColor(tooltip.mag), marginBottom:8 }}>
                M{tooltip.mag?.toFixed(1)} — {tooltip.intensity}
              </div>
              <div style={{ fontSize:'0.72rem', color:'#f5f0e8', marginBottom:4 }}>{tooltip.place}</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 16px', fontSize:'0.68rem' }}>
                <div><span style={{ color:'#444' }}>DEPTH </span><span style={{ color:'#f5f0e8' }}>{tooltip.depth} km</span></div>
                <div><span style={{ color:'#444' }}>TIME </span><span style={{ color:'#f5f0e8' }}>{tooltip.time}</span></div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{ position:'absolute', bottom:28, right:24, fontFamily:'monospace', textAlign:'right', pointerEvents:'none' }}>
        <div style={{ fontSize:'0.55rem', color:'#222', letterSpacing:'0.06em', lineHeight:1.9 }}>
          DRAG TO ROTATE · SCROLL TO ZOOM<br/>HOVER ARCS & RINGS TO INSPECT
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(1.6)} }
        @keyframes fadeIn { from{opacity:0;transform:translateX(-50%) translateY(6px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>
    </div>
  )
}
