import { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import Hero from './sections/Hero'
import Work from './sections/Work'
import Experience from './sections/Experience'
import Contact from './sections/Contact'
import ENSOSection from './sections/ENSOSection'
import useScrollReveal from './hooks/useScrollReveal'

const GlobeSection = lazy(() => import('./sections/GlobeSection/GlobeSection'))

export default function App() {
  useScrollReveal()
  return (
    <div style={{ background:'#f5f0e8', minHeight:'100vh' }}>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Work />

        {/* Globe */}
        <div data-dark>
          <div style={{ paddingLeft:'3rem', paddingTop:'3.5rem', paddingBottom:'1.25rem', background:'#000' }}>
            <p style={{ fontFamily:'monospace', fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.18em', color:'#00d4c8', marginBottom:'0.4rem' }}>
              03 — Live Intelligence Globe
            </p>
            <h2 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:900, letterSpacing:'-0.04em', lineHeight:1, color:'#f5f0e8' }}>
              The world, right now.
            </h2>
            <p style={{ fontSize:'0.78rem', color:'#444', marginTop:'0.35rem' }}>
              Live aircraft · ISS · Seismic activity — drag to rotate, scroll to zoom
            </p>
          </div>
          <Suspense fallback={
            <div style={{ background:'#000', height:'88vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <p style={{ fontFamily:'monospace', color:'#00d4c8', fontSize:'0.75rem', letterSpacing:'0.14em' }}>◌ INITIALISING GLOBE...</p>
            </div>
          }>
            <GlobeSection />
          </Suspense>
        </div>

        {/* ENSO */}
        <ENSOSection />

        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
