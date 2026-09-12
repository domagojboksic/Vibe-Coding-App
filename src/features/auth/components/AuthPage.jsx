import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PasswordStrength from './PasswordStrength'
import UsernameField from './UsernameField'
import { signIn, signUp, resetPassword } from '../api/auth.api'
import { validateEmail, validatePassword, validateUsername } from '@/utils/validators'

const TABS = { signin: 'Sign in', signup: 'Sign up' }

function parseError(error) {
  const msg = error?.message || ''
  if (msg.includes('already registered') || msg.includes('already been registered'))
    return { field: 'global', text: 'An account with this email already exists. Sign in instead.' }
  if (msg.includes('Username already taken'))
    return { field: 'username', text: msg }
  if (msg.includes('Invalid login') || msg.includes('invalid_credentials'))
    return { field: 'global', text: 'Wrong email or password.' }
  if (msg.includes('rate') || msg.includes('429') || msg.includes('too many'))
    return { field: 'global', text: 'Too many attempts — wait a minute and try again.' }
  if (msg.includes('Email not confirmed'))
    return { field: 'global', text: 'Please confirm your email first, then sign in.' }
  if (msg.includes('network') || msg.includes('fetch'))
    return { field: 'global', text: 'Network error — check your connection and try again.' }
  return { field: 'global', text: msg || 'Something went wrong, please try again.' }
}

export default function AuthPage() {
  const navigate = useNavigate()
  const [tab, setTab]         = useState('signin')
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showReset, setShowReset] = useState(false)

  const [form, setForm] = useState({ email: '', password: '', username: '', fullName: '' })
  const [errors, setErrors] = useState({})

  const set = field => e => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(e => ({ ...e, [field]: null }))
    setGlobalError(null)
  }

  const setFieldError = (field, msg) =>
    setErrors(e => ({ ...e, [field]: msg }))

  const handleError = (error) => {
    const { field, text } = parseError(error)
    if (field === 'global') setGlobalError(text)
    else setErrors(e => ({ ...e, [field]: text }))
  }

  const handleSignIn = async () => {
    const emailErr = validateEmail(form.email)
    if (emailErr) { setErrors({ email: emailErr }); return }
    if (!form.password) { setErrors({ password: 'Enter your password' }); return }
    setLoading(true)
    const { error } = await signIn({ email: form.email, password: form.password })
    setLoading(false)
    if (error) { handleError(error); return }
    navigate('/')
  }

  const handleSignUp = async () => {
    const newErrors = {}
    const usernameErr = validateUsername(form.username)
    const emailErr    = validateEmail(form.email)
    const passErr     = validatePassword(form.password)
    if (!form.fullName.trim()) newErrors.fullName = 'Enter your name'
    if (usernameErr)  newErrors.username = usernameErr
    if (emailErr)     newErrors.email    = emailErr
    if (passErr)      newErrors.password = passErr
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }
    setLoading(true)
    const { error } = await signUp({
      email: form.email, password: form.password,
      username: form.username, fullName: form.fullName,
    })
    setLoading(false)
    if (error) { handleError(error); return }
    setSuccess('Account created! Check your email to confirm, then sign in.')
    setTab('signin')
    setForm(f => ({ ...f, password: '', username: '', fullName: '' }))
  }

  const handleReset = async () => {
    const emailErr = validateEmail(form.email)
    if (emailErr) { setErrors({ email: emailErr }); return }
    setLoading(true)
    const { error } = await resetPassword(form.email)
    setLoading(false)
    if (error) { handleError(error); return }
    setShowReset(false)
    setSuccess('Password reset link sent — check your email.')
    setTimeout(() => setSuccess(null), 4000)
  }

  const submit = () => {
    if (showReset)        return handleReset()
    if (tab === 'signin') return handleSignIn()
    return handleSignUp()
  }

  const switchTab = (key) => {
    setTab(key)
    setErrors({})
    setGlobalError(null)
    setSuccess(null)
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">💪</span>
          <h1 className="auth-logo-text">FitCrew</h1>
          <p className="auth-logo-sub">Compete with your crew</p>
        </div>

        {success && <div className="auth-banner auth-success">{success}</div>}
        {globalError && <div className="auth-banner auth-global-error">{globalError}</div>}

        {!showReset ? (
          <>
            <div className="auth-tabs">
              {Object.entries(TABS).map(([key, label]) => (
                <button key={key} className={`auth-tab ${tab === key ? 'active' : ''}`} onClick={() => switchTab(key)}>
                  {label}
                </button>
              ))}
            </div>

            <div className="auth-fields">
              {tab === 'signup' && (
                <>
                  <Input
                    label="Full name"
                    value={form.fullName}
                    onChange={set('fullName')}
                    placeholder="Ivan Horvat"
                    error={errors.fullName}
                    autoComplete="name"
                  />
                  <UsernameField
                    value={form.username}
                    onChange={set('username')}
                    error={errors.username}
                    setError={setFieldError}
                  />
                </>
              )}

              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@email.com"
                error={errors.email}
                autoComplete="email"
              />

              <div>
                <Input
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder={tab === 'signup' ? 'Min. 8 characters' : '••••••••'}
                  error={errors.password}
                  autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                />
                {tab === 'signup' && (
                  <div style={{ marginTop: 10 }}>
                    <PasswordStrength password={form.password} />
                  </div>
                )}
              </div>
            </div>

            <Button className="btn-full" onClick={submit} loading={loading} size="lg" style={{ marginTop: 4 }}>
              {tab === 'signin' ? 'Sign in' : 'Create account'}
            </Button>

            {tab === 'signin' && (
              <button className="auth-link" onClick={() => setShowReset(true)}>
                Forgot password?
              </button>
            )}
          </>
        ) : (
          <>
            <p className="auth-reset-desc">
              Enter your email and we'll send you a link to reset your password.
            </p>
            <div className="auth-fields">
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@email.com"
                error={errors.email}
              />
            </div>
            <Button className="btn-full" onClick={submit} loading={loading} size="lg">
              Send reset link
            </Button>
            <button className="auth-link" onClick={() => setShowReset(false)}>← Back to sign in</button>
          </>
        )}
      </div>

      <style>{`
        .auth-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; background: var(--bg); }
        .auth-card { width: 100%; max-width: 380px; display: flex; flex-direction: column; gap: 14px; }
        .auth-logo { text-align: center; margin-bottom: 6px; }
        .auth-logo-icon { font-size: 44px; display: block; margin-bottom: 8px; }
        .auth-logo-text { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
        .auth-logo-sub { font-size: 14px; color: var(--text2); margin-top: 3px; }
        .auth-banner { border-radius: var(--radius); padding: 10px 14px; font-size: 13px; line-height: 1.5; }
        .auth-success { background: var(--success-light); color: var(--success); border: 1px solid rgba(59,109,17,.2); }
        .auth-global-error { background: var(--danger-light); color: var(--danger); border: 1px solid rgba(226,75,74,.2); }
        .auth-tabs { display: flex; background: var(--surface2); border-radius: var(--radius); padding: 3px; gap: 3px; }
        .auth-tab { flex: 1; padding: 8px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 600; color: var(--text2); transition: background .15s, color .15s; }
        .auth-tab.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow-sm); }
        .auth-fields { display: flex; flex-direction: column; gap: 12px; }
        .auth-link { text-align: center; font-size: 13px; color: var(--text2); padding: 4px; transition: color .15s; }
        .auth-link:hover { color: var(--green); }
        .auth-reset-desc { font-size: 14px; color: var(--text2); line-height: 1.5; }
      `}</style>
    </div>
  )
}