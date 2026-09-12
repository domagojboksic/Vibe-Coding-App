import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PasswordStrength from '@/features/auth/components/PasswordStrength'
import { validatePassword } from '@/utils/validators'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword]       = useState('')
  const [confirm, setConfirm]         = useState('')
  const [errors, setErrors]           = useState({})
  const [loading, setLoading]         = useState(false)
  const [success, setSuccess]         = useState(false)
  const [globalError, setGlobalError] = useState(null)
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setSessionReady(true)
      }
      if (event === 'SIGNED_OUT') {
        setGlobalError('This reset link is invalid or has expired. Please request a new one.')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async () => {
    const newErrors = {}
    const passErr = validatePassword(password)
    if (passErr) newErrors.password = passErr
    if (!confirm) newErrors.confirm = 'Please confirm your password'
    if (password && confirm && password !== confirm) newErrors.confirm = 'Passwords do not match'
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setGlobalError(error.message || 'Something went wrong. Please try again.')
      return
    }

    setSuccess(true)
    setTimeout(() => navigate('/'), 2500)
  }

  if (!sessionReady && !globalError) {
    return (
      <div className="rp-root">
        <div className="rp-card">
          <div className="rp-logo">💪</div>
          <h1 className="rp-title">FitCrew</h1>
          <div className="rp-loading">
            <span className="rp-spinner" />
            <p>Verifying your reset link…</p>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    )
  }

  return (
    <div className="rp-root">
      <div className="rp-card">
        <div className="rp-logo">💪</div>
        <h1 className="rp-title">FitCrew</h1>
        <p className="rp-sub">Set a new password</p>

        {success && (
          <div className="rp-banner rp-success">
            Password updated! Redirecting you in…
          </div>
        )}

        {globalError && (
          <div className="rp-banner rp-error">
            {globalError}
            <button className="rp-link" onClick={() => navigate('/auth')}>
              Back to sign in →
            </button>
          </div>
        )}

        {!success && !globalError && (
          <>
            <div className="rp-fields">
              <div>
                <Input
                  label="New password"
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(err => ({ ...err, password: null })) }}
                  placeholder="Min. 8 characters"
                  error={errors.password}
                  autoComplete="new-password"
                />
                <div style={{ marginTop: 10 }}>
                  <PasswordStrength password={password} />
                </div>
              </div>
              <Input
                label="Confirm new password"
                type="password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setErrors(err => ({ ...err, confirm: null })) }}
                placeholder="Repeat your password"
                error={errors.confirm}
                autoComplete="new-password"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <Button className="btn-full" onClick={handleSubmit} loading={loading} size="lg" style={{ marginTop: 4 }}>
              Set new password
            </Button>
            <button className="rp-link" onClick={() => navigate('/auth')}>← Back to sign in</button>
          </>
        )}
      </div>
      <style>{styles}</style>
    </div>
  )
}

const styles = `
  .rp-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; background: var(--bg); }
  .rp-card { width: 100%; max-width: 380px; display: flex; flex-direction: column; gap: 14px; }
  .rp-logo { font-size: 44px; text-align: center; display: block; margin-bottom: 4px; }
  .rp-title { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; text-align: center; }
  .rp-sub { font-size: 14px; color: var(--text2); text-align: center; margin-top: -6px; }
  .rp-fields { display: flex; flex-direction: column; gap: 12px; }
  .rp-loading { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 24px 0; color: var(--text2); font-size: 14px; }
  .rp-spinner { width: 28px; height: 28px; border-radius: 50%; border: 3px solid var(--border-mid); border-top-color: var(--green); animation: spin .7s linear infinite; display: block; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .rp-banner { border-radius: var(--radius); padding: 12px 14px; font-size: 13px; line-height: 1.5; display: flex; flex-direction: column; gap: 8px; }
  .rp-success { background: var(--success-light); color: var(--success); border: 1px solid rgba(59,109,17,.2); }
  .rp-error { background: var(--danger-light); color: var(--danger); border: 1px solid rgba(226,75,74,.2); }
  .rp-link { text-align: center; font-size: 13px; color: var(--text2); padding: 4px; transition: color .15s; background: none; border: none; cursor: pointer; }
  .rp-link:hover { color: var(--green); }
`