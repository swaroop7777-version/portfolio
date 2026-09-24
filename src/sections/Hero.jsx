import { useState, useEffect, useRef } from 'react'
import { ABOUT } from '../data'

const ROLES = [
  {
    word: 'DESIGNING',
    key: 'designing',
    color: '#b8e0d4',
    sub: 'Systems · Architectures · AI Pipelines',
    // Each letter animates in from different positions
    anim: 'scatter',
  },
  {
    word: 'BUILDING',
    key: 'building',
    color: '#c5d8f5',
    sub: 'Backends · Models · Platforms',
    anim: 'wave',
  },
  {
    word: 'ANALYSING',
    key: 'analysing',
    color: '#f5e2b8',
    sub: 'Data · Performance · Intelligence',
    anim: 'slide',
  },
]

function AnimatedWord({ item, index, globalVisible }) {
  const [hov, setHov] = useState(false)
  const [letterStates, setLetterStates] = useState(
    item.word.split('').map(() => ({ visible: false, x: 0, y: 0 }))
  )

  useEffect(() => {
    if (!globalVisible) return
    const baseDelay = index * 180

    if (item.anim === 'scatter') {
      // Each letter flies in from a random direction
      item.word.split('').forEach((_, i) => {
        setTimeout(() => {
          setLetterStates(prev => prev.map((s, j) =>
            j === i ? { visible: true, x: 0, y: 0 } : s
          ))
        }, baseDelay + i * 45)
      })
    } else if (item.anim === 'wave') {
      // Wave: letters fall from top one by one
      item.word.split('').forEach((_, i) => {
        setTimeout(() => {
          setLetterStates(prev => prev.map((s, j) =>
            j === i ? { visible: true, x: 0, y: 0 } : s
          ))
        }, baseDelay + i * 55)
      })
    } else {
      // Slide: entire word slides from right
      setTimeout(() => {
        setLetterStates(prev => prev.map(() => ({ visible: true, x: 0, y: 0 })))
      }, baseDelay)
    }
  }, [globalVisible, index, item])

  const getLetterStyle = (i, visible) => {
    const base = {
      display: 'inline-block',
      transition: `transform 0.7s ${i * 0.04}s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ${i * 0.04}s ease`,
      willChange: 'transform',
      position: 'relative',
      zIndex: 1,
    }
    if (!visible) {
      if (item.anim === 'scatter') return { ...base, transform: `translate(${(Math.random()-0.5)*200}px, ${(Math.random()-0.5)*200}px) rotate(${(Math.random()-0.5)*45}deg) scale(0)`, opacity: 0 }
      if (item.anim === 'wave')   return { ...base, transform: 'translateY(-120px) scale(0.5)', opacity: 0 }
      return { ...base, transform: 'translateX(120px)', opacity: 0 }
    }
    return { ...base, transform: 'none', opacity: 1 }
  }

  return (
    <div
      data-cursor={item.key}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        lineHeight: 0.88,
        userSelect: 'none',
        paddingLeft: '3rem',
        paddingRight: '3rem',
        display: 'flex',
        alignItems: 'baseline',
        gap: '2rem',
        overflow: 'visible',
      }}
    >
      {/* Full-bleed colour flood */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0,
        left: '-200vw', right: '-200vw',
        background: item.color,
        opacity: hov ? 1 : 0,
        transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: 'none',
      }} />

      {/* Animated letters */}
      <span style={{
        fontSize: 'clamp(4rem, 12vw, 10.5rem)',
        fontWeight: 900,
        letterSpacing: hov ? '-0.02em' : '-0.055em',
        color: '#0a0a0a',
        transition: 'letter-spacing 0.4s ease',
        display: 'inline-block',
        position: 'relative', zIndex: 1,
      }}>
        {item.word.split('').map((letter, i) => (
          <span key={i} style={getLetterStyle(i, letterStates[i]?.visible)}>
            {letter}
          </span>
        ))}
      </span>

      {/* Sub-label on hover */}
      <span style={{
        fontSize: '0.78rem',
        fontFamily: 'monospace',
        color: '#555',
        letterSpacing: '0.04em',
        opacity: hov ? 1 : 0,
        transform: hov ? 'translateX(0)' : 'translateX(-12px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        whiteSpace: 'nowrap',
        position: 'relative', zIndex: 1,
        alignSelf: 'center',
      }}>
        {item.sub}
      </span>
    </div>
  )
}

export default function Hero() {
  const [vis, setVis] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t) }, [])

  return (
    <section style={{
      minHeight: '100vh',
      paddingTop: '5rem',
      paddingBottom: '4rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      overflow: 'hidden',
    }}>
      {/* Greeting */}
      <div style={{
        paddingLeft: '3rem', paddingRight: '3rem',
        marginBottom: '1.25rem',
        opacity: vis ? 1 : 0,
        transform: vis ? 'none' : 'translateY(12px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)', fontWeight: 400, letterSpacing: '-0.01em' }}>
          Hey! I'm <strong style={{ fontWeight: 900 }}>Raju.</strong>&nbsp;&nbsp;
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#888', letterSpacing: '0.08em' }}>
            AI Engineer · Liverpool, UK
          </span>
        </p>
      </div>

      {/* Giant animated words */}
      <div style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '0.1em' }}>
        {ROLES.map((item, i) => (
          <AnimatedWord key={item.word} item={item} index={i} globalVisible={vis} />
        ))}
      </div>

      {/* Bottom strip */}
      <div style={{
        paddingLeft: '3rem', paddingRight: '3rem',
        borderTop: '1px solid #c8c0b0',
        paddingTop: '1.75rem',
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: '4rem',
        opacity: vis ? 1 : 0,
        transition: 'opacity 0.8s 0.8s ease',
      }}>
        <div>
          <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: '0.4rem' }}>Liverpool, UK</p>
          <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            Available for roles
          </p>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {[{ label: 'GitHub ↗', href: 'https://github.com/swaroop7777-version' },
              { label: 'LinkedIn ↗', href: 'https://linkedin.com/in/rajuswaroop7' }]
              .map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                  style={{ fontSize: '0.68rem', color: '#888', border: '1px solid #c8c0b0', padding: '4px 10px', borderRadius: 4, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.target.style.background = '#0a0a0a'; e.target.style.color = '#f5f0e8'; e.target.style.borderColor = '#0a0a0a' }}
                  onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#888'; e.target.style.borderColor = '#c8c0b0' }}>
                  {l.label}
                </a>
              ))}
          </div>
        </div>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.85, color: '#555', fontWeight: 300, maxWidth: 640 }}>
          {ABOUT}
        </p>
      </div>
    </section>
  )
}
