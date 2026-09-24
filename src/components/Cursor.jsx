import { useEffect, useRef, useState, useCallback } from 'react'

const IDEAS = {
  'designing': ['UI/UX Design','System Design','Architecture','Wireframes','User Flow','Figma','Prototypes','Design Tokens'],
  'building':  ['Mistral 7B','RAG Pipeline','Spring Boot','Kafka','FastAPI','Docker','AWS S3','PostgreSQL'],
  'analysing': ['FAISS Index','3,249 Chunks','QLoRA','Embeddings','CUDA GPU','Benchmarks','Evaluation','Metrics'],
  'view':  ['Open Project','View →'],
  'drag':  ['← Drag →','Rotate','Zoom'],
  'globe': ['Live Data','ISS Orbit','Aircraft','Earthquakes','ENSO','Sea Temp'],
}

function Cloud({ bubbles, isLight }) {
  const pill = isLight ? 'rgba(10,10,10,0.9)' : 'rgba(245,240,232,0.95)'
  const txt  = isLight ? '#f5f0e8'            : '#0a0a0a'
  return (
    <div style={{ position:'absolute', top:0, left:0, pointerEvents:'none' }}>
      <svg style={{ position:'absolute', overflow:'visible', top:0, left:0 }} width="0" height="0">
        {bubbles.map((b,i) => (
          <line key={i} x1={0} y1={0} x2={b.x} y2={b.y}
            stroke={isLight ? 'rgba(10,10,10,0.2)' : 'rgba(245,240,232,0.2)'}
            strokeWidth="0.8" strokeDasharray="3,3"
            style={{ animation:`lineIn 0.3s ${b.delay}ms ease both` }} />
        ))}
      </svg>
      {bubbles.map((b,i) => (
        <div key={i} style={{
          position:'absolute', left:b.x, top:b.y,
          transform:'translate(-50%,-50%)',
          background: pill, color: txt,
          fontSize:'0.58rem', fontFamily:"'DM Mono',monospace",
          fontWeight:500, padding:'3px 8px', borderRadius:20,
          whiteSpace:'nowrap', letterSpacing:'0.03em',
          animation:`bubblePop 0.4s ${b.delay}ms cubic-bezier(0.16,1,0.3,1) both`,
          boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.4)',
        }}>{b.text}</div>
      ))}
    </div>
  )
}

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const posRef  = useRef({ x:-400, y:-400 })
  const ringPos = useRef({ x:-400, y:-400 })
  const rafRef  = useRef(null)
  const [bubbles, setBubbles]   = useState([])
  const [isLight, setIsLight]   = useState(true)

  const spawnBubbles = useCallback((key) => {
    const items = IDEAS[key] || []
    if (!items.length) { setBubbles([]); return }
    setBubbles(items.map((text, i) => {
      const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2
      const r = 58 + Math.random() * 22
      return { id:i, text, x: Math.cos(angle)*r, y: Math.sin(angle)*r, delay: i*38 }
    }))
  }, [])

  useEffect(() => {
    const onMove = (e) => { posRef.current = { x: e.clientX, y: e.clientY } }

    const onOver = (e) => {
      // Detect dark background by checking parent section background
      const el = e.target
      const onDark = !!el.closest('#experience') || !!el.closest('#globe-viz') || !!el.closest('#enso-section') || !!el.closest('[data-dark]')
      setIsLight(!onDark)

      const trigger = e.target.closest('[data-cursor]')
      if (trigger) spawnBubbles(trigger.dataset.cursor)
      else setBubbles([])
    }

    const animate = () => {
      const dx = posRef.current.x - ringPos.current.x
      const dy = posRef.current.y - ringPos.current.y
      ringPos.current.x += dx * 0.09
      ringPos.current.y += dy * 0.09

      if (dotRef.current) {
        dotRef.current.style.left = posRef.current.x + 'px'
        dotRef.current.style.top  = posRef.current.y + 'px'
      }
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + 'px'
        ringRef.current.style.top  = ringPos.current.y + 'px'
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove, { passive:true })
    window.addEventListener('mouseover', onOver)
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(rafRef.current)
    }
  }, [spawnBubbles])

  const dot  = isLight ? '#0a0a0a' : '#ffffff'
  const ring = isLight ? 'rgba(10,10,10,0.5)' : 'rgba(255,255,255,0.8)'

  return (
    <>
      <div ref={dotRef} style={{
        position:'fixed', zIndex:9999, pointerEvents:'none',
        width:7, height:7, borderRadius:'50%',
        background: dot,
        transform:'translate(-50%,-50%)',
        willChange:'left,top',
        transition:'background 0.2s ease',
        mixBlendMode: isLight ? 'normal' : 'normal',
      }} />
      <div ref={ringRef} style={{
        position:'fixed', zIndex:9998, pointerEvents:'none',
        transform:'translate(-50%,-50%)',
        willChange:'left,top',
      }}>
        <div style={{
          width:40, height:40,
          border:`1.5px solid ${ring}`,
          borderRadius:'50%',
          transition:'border-color 0.2s ease',
        }} />
        {bubbles.length > 0 && <Cloud bubbles={bubbles} isLight={isLight} />}
      </div>
      <style>{`
        * { cursor: none !important; }
        @keyframes bubblePop {
          from { opacity:0; transform:translate(-50%,-50%) scale(0.1); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        }
        @keyframes lineIn { from{opacity:0} to{opacity:1} }
      `}</style>
    </>
  )
}
