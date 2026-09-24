import { PROJECTS } from '../data'

function Tag({ label }) {
  return (
    <span className="font-mono text-xs px-2 py-1 rounded border transition-colors duration-200 cursor-default"
      style={{ border: '1px solid var(--border)', color: '#94a3b8' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--teal)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = '#94a3b8' }}>
      {label}
    </span>
  )
}

export default function Projects() {
  const f = PROJECTS.featured
  return (
    <section id="projects" className="py-24 px-6 md:px-12 max-w-screen-xl mx-auto">
      <div className="reveal mb-12">
        <div className="font-mono text-xs font-bold mb-2" style={{ color: 'var(--amber)' }}>02 — Projects</div>
        <h2 className="font-black tracking-tight mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
          Things I've shipped
        </h2>
        <p className="text-slate-400 max-w-lg">Real systems with live deployments — not prototypes.</p>
      </div>

      {/* Featured — AcademIQ */}
      <div className="reveal rounded-2xl border overflow-hidden mb-6 relative"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <div className="absolute top-0 left-0 right-0 h-0.5 grad-border" />
        <div className="grid lg:grid-cols-2 min-h-96">
          <div className="p-8 flex flex-col justify-center">
            <span className="inline-block font-mono text-xs px-2.5 py-1 rounded font-bold mb-4"
              style={{ background: 'rgba(0,212,200,0.08)', border: '1px solid var(--border2)', color: 'var(--teal)' }}>
              {f.tag}
            </span>
            <h3 className="text-3xl font-black tracking-tight mb-3">{f.title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm mb-5 max-w-md">{f.desc}</p>
            <div className="flex flex-wrap gap-5 mb-5">
              {f.stats.map((s, i) => (
                <div key={i}>
                  <div className="font-mono font-black text-lg" style={{ color: 'var(--teal)' }}>{s.val}</div>
                  <div className="text-xs text-slate-500">{s.lbl}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {f.tags.map((t) => <Tag key={t} label={t} />)}
            </div>
            <div className="flex gap-3 flex-wrap">
              <a href={f.live} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200"
                style={{ background: 'var(--teal)', color: '#070d1a' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                🌐 Live Demo
              </a>
              <a href={f.github} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-slate-200 border transition-all duration-200"
                style={{ borderColor: 'var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal2)'; e.currentTarget.style.color = 'var(--teal)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = '' }}>
                GitHub ↗
              </a>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center p-8"
            style={{ background: 'linear-gradient(135deg,#030d0c 0%,#071a18 60%,#030d0c 100%)' }}>
            <div className="w-full max-w-sm rounded-xl p-5 font-mono text-xs leading-relaxed"
              style={{ background: '#030d0c', border: '1px solid rgba(0,212,200,0.2)' }}>
              <div className="flex gap-1.5 items-center mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-auto text-slate-600 text-xs">api_mistral.py</span>
              </div>
              <div className="space-y-1 text-slate-400">
                <div><span style={{ color: '#7dd3fc' }}>model</span> = <span style={{ color: '#a78bfa' }}>AutoModelForCausalLM</span>.from_pretrained(</div>
                <div className="pl-4"><span style={{ color: '#fbbf24' }}>"mistralai/Mistral-7B-Instruct"</span>,</div>
                <div className="pl-4"><span style={{ color: '#7dd3fc' }}>quantization_config</span>=bnb_4bit,</div>
                <div className="pl-4"><span style={{ color: '#7dd3fc' }}>device_map</span>=<span style={{ color: '#fbbf24' }}>"cuda"</span></div>
                <div>)</div>
                <div className="mt-2 text-slate-600"># RAG pipeline</div>
                <div><span style={{ color: '#7dd3fc' }}>@app</span>.<span style={{ color: '#a78bfa' }}>post</span>(<span style={{ color: '#fbbf24' }}>"/ask"</span>)</div>
                <div><span style={{ color: '#7dd3fc' }}>def</span> <span style={{ color: '#a78bfa' }}>ask</span>(req):</div>
                <div className="pl-4">chunks = <span style={{ color: '#a78bfa' }}>retrieve</span>(req.question, k=<span style={{ color: 'var(--amber)' }}>5</span>)</div>
                <div className="pl-4"><span style={{ color: '#7dd3fc' }}>return</span> <span style={{ color: '#a78bfa' }}>generate</span>(chunks, req)</div>
                <div className="mt-2" style={{ color: '#4ade80' }}>✓ GPU: NVIDIA L4 · 23.66 GB</div>
                <div style={{ color: '#4ade80' }}>✓ 3,249 chunks indexed
                  <span className="inline-block w-1.5 h-3 ml-1 animate-cursor"
                    style={{ background: 'var(--teal)', verticalAlign: 'middle' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini grid */}
      <div className="reveal grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECTS.mini.map((p, i) => (
          <div key={i} className="rounded-xl p-5 border flex flex-col transition-all duration-250 relative overflow-hidden group cursor-default"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,200,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 grad-border scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="text-2xl mb-3">{p.icon}</div>
            <h4 className="font-bold text-sm mb-2 text-slate-100">{p.title}</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-3 flex-1">{p.desc}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {p.tags.map((t) => <Tag key={t} label={t} />)}
            </div>
            <div className="flex gap-2 flex-wrap">
              <a href={p.github} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded border transition-all duration-200 text-slate-300"
                style={{ borderColor: 'var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal2)'; e.currentTarget.style.color = 'var(--teal)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = '' }}>
                GitHub ↗
              </a>
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded transition-all duration-200"
                  style={{ background: 'rgba(0,212,200,0.1)', color: 'var(--teal)', border: '1px solid var(--border2)' }}>
                  🌐 Live
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
