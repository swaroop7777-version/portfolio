import { useEffect, useRef, useState } from 'react'

// ENSO phases with SST anomaly simulation
const PHASES = [
  { id:'elnino',    label:'El Niño',      color:'#ff4400', accent:'#ff6633', temp:'+2.4°C',
    desc:'Warm water spreads east across the Pacific. Droughts in Australia, floods in South America.',
    year:'2023–24', intensity:'Strong' },
  { id:'neutral',   label:'Neutral',       color:'#00aadd', accent:'#33ccff', temp:'±0.2°C',
    desc:'Pacific sea surface temperatures near average. Normal monsoon patterns globally.',
    year:'2022',    intensity:'Neutral' },
  { id:'lanina',   label:'La Niña',       color:'#0055ff', accent:'#3377ff', temp:'−1.8°C',
    desc:'Cool water dominates the eastern Pacific. Stronger monsoons, drought in South America.',
    year:'2021–22', intensity:'Moderate' },
  { id:'supelnino',label:'Super El Niño', color:'#ff0000', accent:'#ff2200', temp:'+3.2°C',
    desc:'Extreme warming. Catastrophic flooding, wildfires, coral bleaching on a global scale.',
    year:'2025 projected', intensity:'Extreme' },
]

function ENSOMap({ phase }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width = canvas.offsetWidth * window.devicePixelRatio
    const H = canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    const w = canvas.offsetWidth, h = canvas.offsetHeight

    // Background ocean
    ctx.fillStyle = '#040e18'
    ctx.fillRect(0, 0, w, h)

    // Draw SST anomaly heatmap across Pacific
    const isElNino  = phase.id === 'elnino' || phase.id === 'supelnino'
    const isLaNina  = phase.id === 'lanina'
    const intensity = phase.id === 'supelnino' ? 1.4 : 1.0

    // Pacific region centres: lon 120E–280E (centre lon ~200), lat ±30
    const mapLonMin = 100, mapLonMax = 280 // degrees
    const mapLatMin = -50, mapLatMax = 50

    function mapX(lon) { return ((lon - mapLonMin) / (mapLonMax - mapLonMin)) * w }
    function mapY(lat) { return ((mapLatMax - lat) / (mapLatMax - mapLatMin)) * h }

    // SST anomaly blobs
    const blobs = []
    if (isElNino) {
      // Warm tongue from central to east Pacific
      for (let lon=170; lon<=270; lon+=8) {
        const strength = ((lon - 170) / 100) * intensity
        const latSpread = 12 - (lon - 170) * 0.05
        blobs.push({ lon, lat:0, r:strength*0.18*w, hot:true, alpha:strength*0.7 })
        blobs.push({ lon, lat:latSpread*0.5, r:strength*0.12*w, hot:true, alpha:strength*0.5 })
        blobs.push({ lon, lat:-latSpread*0.5, r:strength*0.12*w, hot:true, alpha:strength*0.5 })
      }
      // Cool west Pacific
      blobs.push({ lon:130, lat:5,  r:0.08*w, hot:false, alpha:0.4 })
      blobs.push({ lon:125, lat:-5, r:0.07*w, hot:false, alpha:0.35 })
    } else if (isLaNina) {
      // Cool tongue in east Pacific
      for (let lon=200; lon<=270; lon+=10) {
        const strength = ((270-lon)/70) * 1.0
        blobs.push({ lon, lat:0,  r:strength*0.14*w, hot:false, alpha:strength*0.7 })
        blobs.push({ lon, lat:8,  r:strength*0.09*w, hot:false, alpha:strength*0.4 })
        blobs.push({ lon, lat:-8, r:strength*0.09*w, hot:false, alpha:strength*0.4 })
      }
      // Warm west Pacific
      blobs.push({ lon:140, lat:5,  r:0.1*w, hot:true, alpha:0.5 })
      blobs.push({ lon:145, lat:-3, r:0.08*w, hot:true, alpha:0.4 })
    } else {
      // Neutral — very slight random variation
      blobs.push({ lon:200, lat:0, r:0.06*w, hot:true,  alpha:0.2 })
      blobs.push({ lon:230, lat:5, r:0.05*w, hot:false, alpha:0.2 })
    }

    blobs.forEach(b => {
      const x = mapX(b.lon), y = mapY(b.lat)
      const grad = ctx.createRadialGradient(x, y, 0, x, y, b.r)
      if (b.hot) {
        grad.addColorStop(0, `rgba(255,${isElNino?50:120},0,${b.alpha})`)
        grad.addColorStop(0.5,`rgba(255,${isElNino?100:160},0,${b.alpha*0.5})`)
        grad.addColorStop(1, 'transparent')
      } else {
        grad.addColorStop(0, `rgba(0,80,255,${b.alpha})`)
        grad.addColorStop(0.5,`rgba(0,120,220,${b.alpha*0.5})`)
        grad.addColorStop(1, 'transparent')
      }
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(x, y, b.r, 0, Math.PI*2); ctx.fill()
    })

    // Simplified continent outlines on the map
    ctx.strokeStyle = 'rgba(0,212,200,0.4)'
    ctx.lineWidth = 1

    // Draw simplified Pacific rim coastlines
    const coastlines = [
      // North America west coast
      [[60,-140],[55,-130],[50,-125],[45,-124],[35,-121],[30,-118],[22,-106],[15,-90],[10,-85],[8,-77]],
      // South America west coast
      [[8,-77],[0,-78],[-10,-75],[-20,-70],[-30,-71],[-40,-73],[-55,-68]],
      // Australia east coast
      [[-15,145],[-20,148],[-25,152],[-33,151],[-38,147]],
      // Australia north
      [[-12,136],[-15,129],[-20,118]],
      // Japan/East Asia
      [[45,141],[35,137],[25,121],[20,110],[10,104],[0,110],[-10,120]],
      // New Zealand rough
      [[-35,174],[-40,176],[-46,168],[-44,168],[-38,176],[-35,174]],
    ]
    coastlines.forEach(pts => {
      ctx.beginPath()
      pts.forEach(([lat,lon],i) => {
        const x = mapX(lon < 0 ? lon + 360 : lon), y = mapY(lat)
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
      })
      ctx.stroke()
    })

    // Equator line
    ctx.strokeStyle = 'rgba(0,212,200,0.25)'
    ctx.setLineDash([4,4])
    ctx.beginPath(); ctx.moveTo(0,mapY(0)); ctx.lineTo(w,mapY(0)); ctx.stroke()
    ctx.setLineDash([])

    // Labels
    ctx.fillStyle = 'rgba(0,212,200,0.5)'
    ctx.font = `${Math.round(9*window.devicePixelRatio)/window.devicePixelRatio}px monospace`
    ctx.fillText('EQUATOR', 8, mapY(0)-5)
    ctx.fillText('PACIFIC OCEAN', w*0.35, h*0.48)
    ctx.fillText('EAST PACIFIC', w*0.72, h*0.45)

    // Anomaly scale bar
    const barX=w-90, barY=h-30, barW=80, barH=8
    const barGrad = ctx.createLinearGradient(barX,0,barX+barW,0)
    barGrad.addColorStop(0,   '#0055ff')
    barGrad.addColorStop(0.5, '#002233')
    barGrad.addColorStop(1,   '#ff4400')
    ctx.fillStyle = barGrad
    ctx.fillRect(barX, barY, barW, barH)
    ctx.fillStyle='rgba(0,212,200,0.6)'; ctx.font='7px monospace'
    ctx.fillText('−3°C', barX-18, barY+7)
    ctx.fillText('+3°C', barX+barW+2, barY+7)

  }, [phase])

  return (
    <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block' }} />
  )
}

export default function ENSOSection() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)

  const switchPhase = (i) => {
    if (i === active) return
    setAnimating(true)
    setTimeout(() => { setActive(i); setAnimating(false) }, 300)
  }

  const phase = PHASES[active]

  return (
    <section id="enso-section" data-dark style={{ background:'#030a0f', color:'#f5f0e8', padding:'5rem 0' }}>
      <div style={{ paddingLeft:'3rem', paddingRight:'3rem', marginBottom:'2.5rem' }}>
        <p style={{ fontFamily:'monospace', fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.18em', color:'#00d4c8', marginBottom:'0.75rem' }}>
          04 — Geo Intelligence
        </p>
        <h2 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, letterSpacing:'-0.04em', lineHeight:1, marginBottom:'0.6rem' }}>
          ENSO Tracker
        </h2>
        <p style={{ fontSize:'0.82rem', color:'#444', maxWidth:500, lineHeight:1.75 }}>
          Real-time Pacific Ocean sea surface temperature anomaly — tracking El Niño, La Niña and the progression toward Super El Niño conditions.
        </p>
      </div>

      {/* Phase selector */}
      <div style={{ paddingLeft:'3rem', display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
        {PHASES.map((p,i) => (
          <button key={p.id} onClick={() => switchPhase(i)}
            style={{
              fontFamily:'monospace', fontSize:'0.72rem', fontWeight:700,
              padding:'8px 18px', borderRadius:6, border:`1px solid ${active===i ? p.color : '#1a1a1a'}`,
              background: active===i ? p.color+'22' : 'transparent',
              color: active===i ? p.color : '#444',
              transition:'all 0.3s ease', cursor:'none', letterSpacing:'0.05em',
              boxShadow: active===i ? `0 0 16px ${p.color}33` : 'none',
            }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'0', alignItems:'stretch' }}>

        {/* Map */}
        <div style={{
          height:400, overflow:'hidden', position:'relative',
          opacity: animating ? 0 : 1,
          transition:'opacity 0.3s ease',
        }}>
          <ENSOMap phase={phase} />
          {/* Phase overlay label */}
          <div style={{
            position:'absolute', top:16, left:16,
            fontFamily:'monospace',
          }}>
            <div style={{ fontSize:'0.6rem', color:'#00d4c8', letterSpacing:'0.12em', marginBottom:2 }}>
              CURRENT PHASE
            </div>
            <div style={{ fontSize:'1.2rem', fontWeight:900, color:phase.color, letterSpacing:'-0.02em' }}>
              {phase.label}
            </div>
            <div style={{ fontSize:'0.65rem', color:'#555', marginTop:2 }}>{phase.year}</div>
          </div>
          {/* Temp anomaly badge */}
          <div style={{
            position:'absolute', top:16, right:16,
            background:'rgba(0,0,0,0.7)', border:`1px solid ${phase.color}`,
            borderRadius:8, padding:'8px 14px', fontFamily:'monospace',
            backdropFilter:'blur(8px)',
          }}>
            <div style={{ fontSize:'0.55rem', color:'#555', marginBottom:2, letterSpacing:'0.1em' }}>SST ANOMALY</div>
            <div style={{ fontSize:'1.4rem', fontWeight:900, color:phase.color }}>{phase.temp}</div>
          </div>
        </div>

        {/* Info panel */}
        <div style={{
          background:'#060e14', borderLeft:'1px solid #0d1f2d',
          padding:'2rem 1.75rem', display:'flex', flexDirection:'column', justifyContent:'space-between',
          opacity: animating ? 0 : 1,
          transition:'opacity 0.3s ease',
        }}>
          <div>
            <div style={{ width:32, height:3, background:phase.color, borderRadius:2, marginBottom:'1.25rem', transition:'background 0.4s ease' }} />
            <h3 style={{ fontSize:'1.1rem', fontWeight:800, marginBottom:'0.5rem', color:'#f5f0e8' }}>{phase.label}</h3>
            <p style={{ fontSize:'0.6rem', fontFamily:'monospace', color:phase.color, marginBottom:'1rem', letterSpacing:'0.08em' }}>
              INTENSITY: {phase.intensity.toUpperCase()}
            </p>
            <p style={{ fontSize:'0.82rem', color:'#888', lineHeight:1.8, fontWeight:300, marginBottom:'1.5rem' }}>
              {phase.desc}
            </p>
          </div>
          <div style={{ borderTop:'1px solid #0d1f2d', paddingTop:'1.25rem' }}>
            <div style={{ fontSize:'0.6rem', fontFamily:'monospace', color:'#333', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>
              GLOBAL EFFECTS
            </div>
            {({
              'elnino':     ['🔥 Australian drought','🌊 Peru flooding','⛈ US Gulf storms','🌡 Global temp +0.2°C'],
              'neutral':    ['✅ Normal rainfall','🌤 Stable monsoons','📊 Average sea levels','🐠 Healthy coral'],
              'lanina':     ['🌧 Australia floods','💧 SE Asia heavy rain','❄ US cold winters','🌊 Higher sea levels'],
              'supelnino':  ['🚨 Catastrophic floods','🔥 Mass wildfires','🐠 Global coral bleach','🌡 Record temperatures'],
            }[phase.id] || []).map((e,i) => (
              <div key={i} style={{ fontSize:'0.75rem', color:'#666', marginBottom:'0.4rem', fontWeight:300 }}>{e}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
