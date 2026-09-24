import { SKILLS } from '../data'

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 md:px-12 max-w-screen-xl mx-auto">
      <div className="reveal mb-12">
        <div className="font-mono text-xs font-bold mb-2" style={{ color: 'var(--amber)' }}>04 — Skills</div>
        <h2 className="font-black tracking-tight mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
          Tech stack
        </h2>
        <p className="text-slate-400 max-w-lg text-sm">
          <span style={{ color: 'var(--teal)' }}>Teal items</span> = used in real production or AcademIQ.
        </p>
      </div>

      <div className="reveal grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-xl overflow-hidden border"
        style={{ background: 'var(--border)', borderColor: 'var(--border)' }}>
        {SKILLS.map((s, i) => (
          <div key={i} className="p-5 transition-colors duration-200 group"
            style={{ background: 'var(--bg)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}>
            <div className="font-mono text-xs font-bold mb-3 tracking-widest" style={{ color: 'var(--amber)' }}>
              {s.cat}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {s.items.map((item) => (
                <span key={item}
                  className="text-xs px-2.5 py-1 rounded border transition-all duration-200 cursor-default"
                  style={{
                    borderColor: s.highlight ? 'rgba(0,212,200,0.3)' : 'var(--border)',
                    color: s.highlight ? 'var(--teal)' : '#94a3b8',
                    background: s.highlight ? 'rgba(0,212,200,0.04)' : 'transparent',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--teal)' }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = s.highlight ? 'rgba(0,212,200,0.3)' : 'var(--border)'
                    e.currentTarget.style.color = s.highlight ? 'var(--teal)' : '#94a3b8'
                  }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
