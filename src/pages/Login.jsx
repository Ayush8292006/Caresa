import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Img, Logo } from '../components/Common'
import { IMAGES } from '../data/products'

export default function Login() {
  const { login } = useStore()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' })
  const [otpSent, setOtpSent] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (mode === 'otp') {
      if (!otpSent) { if (!/^\d{10}$/.test(form.email)) return setErr('Enter a 10-digit mobile number'); setOtpSent(true); setErr(''); return }
      if (form.otp.length !== 6) return setErr('Enter the 6-digit code (any 6 digits in demo)')
      login(form.email + '@mobile.caresa', 'Guest'); return navigate('/account')
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErr('Enter a valid email address')
    if (form.password.length < 6) return setErr('Password must be at least 6 characters')
    if (mode === 'signup' && !form.name.trim()) return setErr('Enter your name')
    const u = login(form.email, form.name)
    navigate(u.isAdmin ? '/admin' : '/account')
  }

  return (
    <div className="auth">
      <div className="auth-media"><Img id={IMAGES.heroNecklace} w={1200} alt="" /><div className="auth-quote"><p className="script light">welcome back</p><p>Your wishlist, orders and saved addresses — all in one place.</p></div></div>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <Logo />
          <div className="tabs">
            {[['login', 'Sign in'], ['signup', 'Create account'], ['otp', 'Mobile OTP']].map(([m, l]) => (
              <button type="button" key={m} className={mode === m ? 'on' : ''} onClick={() => { setMode(m); setErr(''); setOtpSent(false) }}>{l}</button>
            ))}
          </div>
          {mode === 'signup' && <label className="field"><span>Full name</span><input id="auth-name" className="input" value={form.name} onChange={set('name')} /></label>}
          {mode === 'otp' ? (
            <>
              <label className="field"><span>Mobile number</span><input id="auth-mobile" className="input" inputMode="numeric" maxLength={10} value={form.email} onChange={set('email')} /></label>
              {otpSent && <label className="field"><span>6-digit code</span><input id="auth-otp" className="input" inputMode="numeric" maxLength={6} value={form.otp} onChange={set('otp')} /></label>}
            </>
          ) : (
            <>
              <label className="field"><span>Email</span><input id="auth-email" className="input" type="email" value={form.email} onChange={set('email')} /></label>
              <label className="field"><span>Password</span><input id="auth-password" className="input" type="password" value={form.password} onChange={set('password')} /></label>
            </>
          )}
          {err && <small className="err">{err}</small>}
          <button className="btn btn-dark btn-block">{mode === 'otp' ? (otpSent ? 'Verify & continue' : 'Send code') : mode === 'signup' ? 'Create account' : 'Sign in'}</button>
          {mode === 'login' && <button type="button" className="link-btn">Forgot password?</button>}
          <p className="demo-note">Demo: any email + 6-char password works. Use an email starting with <b>admin</b> (e.g. admin@caresa.in) to open the admin panel.</p>
          <Link to="/admin" className="link-u small">Go to Admin Panel →</Link>
        </form>
      </div>
    </div>
  )
}
