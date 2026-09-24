import { useState } from 'react'
import { STACK } from '../data'

export default function Stack() {
  const [open, setOpen] = useState(null)
  const categories = Object.entries(STACK)

  return (
    <section id="stack" className="max-w-5xl mx-auto px-6 py-16">
      <p className="text-xs text-muted font-mono mb-8 tracking-widest uppercase reveal">
        Stack
      </p>
      <div className="stagger" style={{ borderTop: '1px solid #e5e7eb' }}>
        {categories.map(([cat, items]) => (
          <div key={cat} style={{ borderBottom: '1px solid #e5e7eb' }}>
            <button
              className="w-full py-5 flex items-center justify-between text-left cursor-pointer bg-transparent border-none"
              onClick={() => setOpen(open === cat ? null : cat)}
            >
              <span className="text-sm font-medium text-ink">{cat}</span>
              <span className="text-muted text-sm" style={{ transform: open === cat ? 'rotate(45deg)' : '', display: 'inline-block', transition: 'transform 0.2s ease' }}>+</span>
            </button>
            {open === cat && (
              <div className="pb-5 flex flex-wrap gap-x-4 gap-y-2">
                {items.map(item => (
                  <span key={item} className="text-sm text-muted" style={{ fontWeight: 300 }}>
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
