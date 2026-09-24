import { useRef, useState } from 'react'
import { WORK } from '../data'

const VISUALS = {
  'AcademIQ': { bg: '#0d1f1d', accent: '#00d4c8', emoji: '🧠' },
  'PharmAI Copilot': { bg: '#0a1628', accent: '#60a5fa', emoji: '💊' },
  'Kafka Transaction Processor': { bg: '#1a0f0a', accent: '#f59e0b', emoji: '⚡' },
  'Secure Backend API': { bg: '#0f0a1a', accent: '#a78bfa', emoji: '🔐' },
}

function ProjectCard({ project, index }) {
  const [hov, setHov] = useState(false)
  const [mx, setMx] = useState(0)
  const [my, setMy] = useState(0)
  const cardRef = useRef(null)
  const v = VISUALS[project.name]

  const onMouseMove = (e) => {
    const r = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    setMx(x)
    setMy(y)
  }

  const tiltX = hov ? my * -10 : index % 2 === 0 ? 1 : -1
  const tiltY = hov ? mx * 12 : index % 2 === 0 ? -3 : 3

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setMx(0); setMy(0) }}
      onMouseMove={onMouseMove}
      data-cursor="view"
      style={{
        flex: '0 0 400px',
        height: 520,
        borderRadius: 18,
        overflow: 'hidden',
        background: v.bg,
        position: 'relative',
        transform: `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${hov ? 1.04 : 1})`,
        transition: hov
          ? 'transform 0.15s ease, box-shadow 0.4s ease'
          : 'transform 0.7s cubic-bezier(0.16,1,0.3,1), box-shadow 0.7s ease',
        boxShadow: hov
          ? `0 48px 100px rgba(0,0,0,0.55), 0 0 0 1px ${v.accent}33`
          : '0 16px 48px rgba(0,0,0,0.3)',
        willChange: 'transform',
      }}
    >
      {/* Visual area */}
      <div style={{ height: 300, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${v.accent}18 1px, transparent 1px), linear-gradient(90deg, ${v.accent}18 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }} />
        {/* Glow orb */}
        <div style={{
          position: 'absolute',
          width: 180, height: 180,
          background: `radial-gradient(circle, ${v.accent}40, transparent 70%)`,
          borderRadius: '50%',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          transition: 'transform 0.3s ease',
          transform: hov ? 'translate(-50%,-50%) scale(1.3)' : 'translate(-50%,-50%) scale(1)',
        }} />
        {/* Emoji icon */}
        <div style={{
          position: 'relative', zIndex: 2,
          fontSize: '5rem',
          filter: 'drop-shadow(0 0 20px ' + v.accent + '80)',
          transform: hov ? 'scale(1.1) translateY(-4px)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {v.emoji}
        </div>
        {/* Tags floating */}
        {project.tags.slice(0, 3).map((tag, i) => (
          <div key={tag} style={{
            position: 'absolute',
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${v.accent}44`,
            color: v.accent,
            fontSize: '0.62rem', fontFamily: 'monospace',
            padding: '3px 8px', borderRadius: 20,
            top: 18 + i * 32,
            left: i % 2 === 0 ? 16 : 'auto',
            right: i % 2 !== 0 ? 16 : 'auto',
            opacity: hov ? 1 : 0.5,
            transition: `opacity 0.4s ${i * 60}ms ease`,
          }}>{tag}</div>
        ))}
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${v.bg} 100%)` }} />
      </div>

      {/* Info */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{project.type}</span>
          <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: '#555' }}>{project.year}</span>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f5f0e8', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>{project.name}</h3>
        <p style={{ fontSize: '0.78rem', color: '#888', lineHeight: 1.6, marginBottom: '1rem', fontWeight: 300 }}>{project.descriptors[0]}</p>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
              style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0a0a0a', background: '#f5f0e8', padding: '5px 14px', borderRadius: 5, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}>
              Live ↗
            </a>
          )}
          <a href={project.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
            style={{ fontSize: '0.72rem', color: '#666', padding: '5px 0', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#f5f0e8'}
            onMouseLeave={e => e.target.style.color = '#666'}>
            GitHub ↗
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Work() {
  const trackRef = useRef(null)
  const [drag, setDrag] = useState(false)
  const startX = useRef(0)
  const scrollL = useRef(0)

  return (
    <section id="work" style={{ padding: '6rem 0 5rem' }}>
      <div style={{ paddingLeft: '3rem', paddingRight: '3rem', marginBottom: '2.5rem' }} className="fade-up">
        <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#888', marginBottom: '0.5rem' }}>
          02 — Selected Work
        </p>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
          Things I've shipped.
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#888', marginTop: '0.5rem' }}>drag or scroll →</p>
      </div>

      <div
        ref={trackRef}
        data-cursor="drag"
        onMouseDown={e => { setDrag(true); startX.current = e.pageX; scrollL.current = trackRef.current.scrollLeft }}
        onMouseMove={e => { if (drag) trackRef.current.scrollLeft = scrollL.current - (e.pageX - startX.current) }}
        onMouseUp={() => setDrag(false)}
        onMouseLeave={() => setDrag(false)}
        style={{
          display: 'flex', gap: '1.25rem',
          overflowX: 'auto', overflowY: 'visible',
          paddingLeft: '3rem', paddingRight: '3rem',
          paddingTop: '2rem', paddingBottom: '3rem',
          scrollbarWidth: 'none',
          userSelect: 'none',
        }}
      >
        {WORK.map((p, i) => <ProjectCard key={p.name} project={p} index={i} />)}
        <div style={{ flex: '0 0 2rem' }} />
      </div>
    </section>
  )
}
