import { useState, useEffect } from 'react'

const LINKS = [
  { label: 'work', href: '#work' },
  { label: 'experience', href: '#experience' },
  { label: 'contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 3rem',
      background: scrolled ? 'rgba(245,240,232,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(200,192,176,0.5)' : '1px solid transparent',
      transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#0a0a0a"/>
          <text x="16" y="22" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
            fontWeight="900" fontSize="11" letterSpacing="-0.5" fill="#f5f0e8">RST</text>
        </svg>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '-0.01em' }}>Raju Swaroop</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        {LINKS.map(l => (
          <a key={l.href} href={l.href} style={{ fontSize: '0.82rem', color: '#888', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#0a0a0a'}
            onMouseLeave={e => e.target.style.color = '#888'}>
            {l.label}
          </a>
        ))}
        <a href="mailto:swaroopraj1035@gmail.com"
          style={{ fontSize: '0.82rem', fontWeight: 600, background: '#0a0a0a', color: '#f5f0e8', padding: '7px 16px', borderRadius: 6, transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.target.style.opacity = '0.8'}
          onMouseLeave={e => e.target.style.opacity = '1'}>
          hire me →
        </a>
      </div>
    </nav>
  )
}
