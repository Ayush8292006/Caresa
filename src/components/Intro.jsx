import { useEffect, useState } from 'react'
import { Bow } from './Common'

/* First-visit opening animation (once per browser session) */
export default function Intro() {
  const [stage, setStage] = useState(() => {
    try { return sessionStorage.getItem('caresa_intro') ? 'done' : 'play' } catch { return 'play' }
  })

  useEffect(() => {
    if (stage !== 'play') return
    document.body.style.overflow = 'hidden'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t1 = setTimeout(() => setStage('leave'), reduce ? 300 : 2900)
    return () => clearTimeout(t1)
  }, [stage])

  useEffect(() => {
    if (stage !== 'leave') return
    const t = setTimeout(() => {
      setStage('done')
      document.body.style.overflow = ''
      try { sessionStorage.setItem('caresa_intro', '1') } catch { /* ignore */ }
    }, 1100)
    return () => clearTimeout(t)
  }, [stage])

  if (stage === 'done') return null
  return (
    <div className={`intro ${stage === 'leave' ? 'intro-leave' : ''}`} aria-hidden="true">
      <div className="intro-panel intro-top" />
      <div className="intro-panel intro-bottom" />
      <div className="intro-content">
        <Bow size={86} draw />
        <h1 className="intro-word">
          {'caresa'.split('').map((ch, i) => <span key={i} style={{ animationDelay: `${0.9 + i * 0.08}s` }}>{ch}</span>)}
        </h1>
        <div className="intro-line" />
        <p className="intro-tag">Fine Jewellery · Since 2019</p>
      </div>
      <button className="intro-skip" onClick={() => setStage('leave')}>Skip</button>
    </div>
  )
}
