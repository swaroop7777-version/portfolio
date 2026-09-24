import { useState } from 'react'
import { EXPERIENCE } from '../data'

const ACCENT = ['#a8d5a2','#93b8e8','#e8c993','#c4a8e8']
const ICONS = ['🏭','✈️','🎓','📚']

export default function Experience() {
  const [active, setActive] = useState(0)
  const e = EXPERIENCE[active]

  return (
    <section id="experience" style={{
      background: '#0f0f0f',
      color: '#f5f0e8',
      padding: '7rem 3rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Subtle background texture lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.02) 40px)',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '4rem' }}>
          <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#444', marginBottom: '0.75rem' }}>
            03 — Experience
          </p>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.95, marginBottom: '0.75rem' }}>
            Where I've worked.
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#555', maxWidth: 420, lineHeight: 1.7 }}>
            3 years shipping production software at enterprise scale — Java, Spring Boot, Kafka, CI/CD.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '5rem', alignItems: 'start' }}>

          {/* Left: company tabs */}
          <div>
            {EXPERIENCE.map((exp, i) => (
              <div
                key={i}
                onClick={() => setActive(i)}
                style={{
                  padding: '1.25rem 0',
                  borderTop: `1px solid ${active === i ? ACCENT[i] + '55' : '#1e1e1e'}`,
                  cursor: 'none',
                  paddingLeft: active === i ? '1.25rem' : '0',
                  transition: 'padding-left 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease',
                  position: 'relative',
                }}
              >
                {/* Left colour bar */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
                  background: ACCENT[i],
                  transform: active === i ? 'scaleY(1)' : 'scaleY(0)',
                  transformOrigin: 'top',
                  transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                  borderRadius: 2,
                }} />

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.9rem' }}>{ICONS[i]}</span>
                  <span style={{
                    fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)',
                    fontWeight: active === i ? 800 : 500,
                    color: active === i ? '#f5f0e8' : '#444',
                    letterSpacing: '-0.02em',
                    transition: 'color 0.3s ease, font-weight 0.2s ease',
                  }}>
                    {exp.company}
                  </span>
                </div>
                <p style={{
                  fontSize: '0.75rem', color: active === i ? '#777' : '#333',
                  paddingLeft: '1.55rem', fontFamily: 'monospace', lineHeight: 1.4,
                  transition: 'color 0.3s ease',
                }}>
                  {exp.role} · {exp.period}
                </p>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #1e1e1e' }} />
          </div>

          {/* Right: detail card */}
          <div style={{
            position: 'sticky', top: '7rem',
            background: '#161616',
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid #222',
          }}>
            {/* Colour strip */}
            <div style={{
              height: 4,
              background: ACCENT[active],
              transition: 'background 0.5s ease',
            }} />

            <div style={{ padding: '2rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: 44, height: 44,
                  background: ACCENT[active] + '22',
                  border: `1px solid ${ACCENT[active]}44`,
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem',
                  transition: 'background 0.5s ease, border-color 0.5s ease',
                }}>
                  {ICONS[active]}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.1rem', letterSpacing: '-0.01em' }}>
                    {e.company}
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: '#555', fontFamily: 'monospace' }}>
                    {e.role} · {e.period}
                  </p>
                </div>
              </div>

              {/* Bullet points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {e.points.map((pt, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '0.65rem', alignItems: 'flex-start',
                    animation: `ptIn 0.4s ${i * 70}ms cubic-bezier(0.16,1,0.3,1) both`,
                  }}>
                    <span style={{
                      color: ACCENT[active],
                      fontSize: '0.6rem',
                      marginTop: '0.35rem',
                      flexShrink: 0,
                      transition: 'color 0.5s ease',
                    }}>▸</span>
                    <p style={{ fontSize: '0.83rem', color: '#999', lineHeight: 1.75, fontWeight: 300 }}>
                      {pt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ptIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:none; }
        }
      `}</style>
    </section>
  )
}
