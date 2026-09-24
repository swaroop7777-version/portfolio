import { CONTACT } from '../data'

export default function Contact() {
  return (
    <section id="contact" style={{ padding: '6rem 3rem 5rem', background: '#f5f0e8' }}>
      <div className="fade-up">
        <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#888', marginBottom: '1rem' }}>04 — Contact</p>
        <h2 style={{ fontSize: 'clamp(3rem, 9vw, 7rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.9, marginBottom: '3rem' }}>
          Let's build<br />something.
        </h2>
        <div style={{ borderTop: '1px solid #c8c0b0', paddingTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', maxWidth: 700 }}>
          <div>
            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '0.75rem' }}>Email</p>
            <a href={`mailto:${CONTACT.email}`}
              style={{ fontSize: '0.95rem', fontWeight: 500, display: 'block', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#888'}
              onMouseLeave={e => e.target.style.color = '#0a0a0a'}>
              {CONTACT.email} ↗
            </a>
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', marginBottom: '0.75rem' }}>Links</p>
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer"
              style={{ fontSize: '0.95rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#888'}
              onMouseLeave={e => e.target.style.color = '#0a0a0a'}>
              LinkedIn ↗
            </a>
            <a href={CONTACT.github} target="_blank" rel="noreferrer"
              style={{ fontSize: '0.95rem', fontWeight: 500, display: 'block', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#888'}
              onMouseLeave={e => e.target.style.color = '#0a0a0a'}>
              GitHub ↗
            </a>
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#888', fontWeight: 300, marginTop: '2rem', lineHeight: 1.7 }}>
          {CONTACT.note}
        </p>
      </div>
    </section>
  )
}
