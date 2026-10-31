import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Img, Logo, Icon } from '../components/Common'
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
      if (!otpSent) {
        if (!/^\d{10}$/.test(form.email)) return setErr('Please enter a valid 10-digit mobile number')
        setOtpSent(true)
        setErr('')
        return
      }
      if (form.otp.length !== 6) return setErr('Enter the 6-digit code (any 6 digits in demo mode)')
      login(form.email + '@mobile.caresa', 'Guest Collector')
      return navigate('/account')
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErr('Please enter a valid email address')
    if (form.password.length < 6) return setErr('Password must be at least 6 characters')
    if (mode === 'signup' && !form.name.trim()) return setErr('Please enter your full name')

    const u = login(form.email, form.name)
    navigate(u.isAdmin ? '/admin' : '/account')
  }

  return (
    <div className="auth">
      <div className="auth-media">
        <Img id={IMAGES.heroNecklace} w={1200} alt="Caresa fine jewellery necklace" />
        <div className="auth-quote">
          <p className="script light">welcome back</p>
          <p>Your saved heirlooms, bespoke orders, and private certificates in one place.</p>
        </div>
      </div>

      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <Logo />

          <div className="tabs auth-tabs">
            {[
              ['login', 'Sign In'],
              ['signup', 'Create Account'],
              ['otp', 'Mobile OTP'],
            ].map(([m, l]) => (
              <button
                type="button"
                key={m}
                className={mode === m ? 'on' : ''}
                onClick={() => {
                  setMode(m)
                  setErr('')
                  setOtpSent(false)
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {mode === 'signup' && (
            <label className="field">
              <span>Full Name</span>
              <input
                id="auth-name"
                className="input"
                placeholder="e.g. Radhika Sharma"
                value={form.name}
                onChange={set('name')}
              />
            </label>
          )}

          {mode === 'otp' ? (
            <>
              <label className="field">
                <span>10-Digit Mobile Number</span>
                <input
                  id="auth-mobile"
                  className="input"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="9876543210"
                  value={form.email}
                  onChange={set('email')}
                />
              </label>
              {otpSent && (
                <label className="field">
                  <span>Enter 6-Digit OTP</span>
                  <input
                    id="auth-otp"
                    className="input"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter any 6 digits (e.g. 123456)"
                    value={form.otp}
                    onChange={set('otp')}
                  />
                </label>
              )}
            </>
          ) : (
            <>
              <label className="field">
                <span>Email Address</span>
                <input
                  id="auth-email"
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                />
              </label>
              <label className="field">
                <span>Password</span>
                <input
                  id="auth-password"
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                />
              </label>
            </>
          )}

          {err && <small className="err">{err}</small>}

          <button className="btn btn-dark btn-block" type="submit">
            {mode === 'otp'
              ? otpSent
                ? 'Verify & Enter Collection'
                : 'Send One-Time Passcode'
              : mode === 'signup'
              ? 'Create Collector Account'
              : 'Sign In to Account'}
          </button>

          {mode === 'login' && (
            <button
              type="button"
              className="link-btn center"
              onClick={() => alert('Password reset link simulated for demo.')}
            >
              Forgot your password?
            </button>
          )}

          <div className="demo-note">
            <p className="small">
              ✦ <b>Demo Credentials:</b> Any email + 6-character password works.
              <br />
              ✦ To view the <b>Admin Panel</b>, sign in with an email starting with <b>admin</b> (e.g. <code>admin@caresa.in</code>).
            </p>
          </div>

          <Link to="/admin" className="link-arrow center">
            Direct Link to Admin Panel <Icon name="arrow" size={14} />
          </Link>
        </form>
      </div>
    </div>
  )
}
