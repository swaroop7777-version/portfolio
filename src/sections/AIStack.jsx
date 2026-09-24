import { useState } from 'react'
import { STACK_LAYERS } from '../data'

export default function AIStack() {
  const [active, setActive] = useState(0)
  const layer = STACK_LAYERS[active]

  return (
    <section id="stack" className="py-24 px-6 md:px-12 max-w-screen-xl mx-auto">
      <div className="reveal mb-12">
        <div className="font-mono text-xs font-bold mb-2" style={{ color: 'var(--amber)' }}>
          01 — What I built with AI
        </div>
        <h2 className="font-black tracking-tight mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
          The full AI tech stack
        </h2>
        <p className="text-slate-400 max-w-lg">
          Every layer of AcademIQ. Click each to see what I actually built and the specific tools at that stage.
        </p>
      </div>

      <div className="reveal grid md:grid-cols-2 gap-6 lg:gap-10 items-start">
        {/* Layer list */}
        <div className="flex flex-col gap-2">
          {STACK_LAYERS.map((l, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg border transition-all duration-200 cursor-pointer relative overflow-hidden"
              style={{
                background: active === i ? 'var(--bg3)' : 'var(--bg2)',
                borderColor: active === i ? 'var(--border2)' : 'var(--border)',
                boxShadow: active === i ? '0 0 20px var(--glow)' : 'none',
              }}>
              {/* Active indicator */}
              <span className="absolute left-0 top-0 bottom-0 w-0.5 transition-transform duration-300 origin-bottom"
                style={{ background: 'var(--teal)', transform: active === i ? 'scaleY(1)' : 'scaleY(0)' }} />
              <span className="text-xl w-8 text-center">{l.icon}</span>
              <span className="flex-1">
                <span className="block font-bold text-sm text-slate-100">{l.title}</span>
                <span className="font-mono text-xs text-slate-500">{l.sub}</span>
              </span>
              <span className="text-slate-500 text-sm transition-transform duration-200"
                style={{ transform: active === i ? 'rotate(90deg)' : 'none', color: active === i ? 'var(--teal)' : '' }}>
                ›
              </span>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div key={active} className="animate-slide-in rounded-xl p-5 border sticky top-20"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border2)', minHeight: 360 }}>
          <span className="inline-block font-mono text-xs px-2 py-1 rounded mb-3 font-bold"
            style={{ background: 'rgba(0,212,200,0.08)', border: '1px solid var(--border2)', color: 'var(--teal)' }}>
            {layer.badge}
          </span>
          <h3 className="font-bold text-lg mb-2 text-slate-100">{layer.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">{layer.desc}</p>
          <ul className="flex flex-col gap-2 mb-4">
            {layer.items.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-400">
                <span className="font-mono shrink-0" style={{ color: 'var(--teal)' }}>→</span>
                {item}
              </li>
            ))}
          </ul>
          <pre className="font-mono text-xs rounded-lg px-4 py-3 overflow-x-auto leading-relaxed"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--teal)' }}>
            {layer.code}
          </pre>
        </div>
      </div>
    </section>
  )
}
