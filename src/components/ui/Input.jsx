import { forwardRef, useState } from 'react'

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
)

const Input = forwardRef(({
  label, error, hint, suffix, prefix,
  type = 'text', className = '', ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType  = isPassword ? (showPassword ? 'text' : 'password') : type
  const hasError   = Boolean(error)

  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field ${hasError ? 'input-error' : ''} ${prefix ? 'has-prefix' : ''}`}>
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input ref={ref} type={inputType} {...props} />
        {isPassword && (
          <button
            type="button"
            className="input-eye"
            onClick={() => setShowPassword(v => !v)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={showPassword} />
          </button>
        )}
        {!isPassword && suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && <p className="input-err-msg">{error}</p>}
      {hint && !error && <p className="input-hint">{hint}</p>}

      <style>{`
        .input-wrapper { display: flex; flex-direction: column; gap: 6px; }
        .input-label { font-size: 13px; font-weight: 500; color: var(--text2); }
        .input-field {
          display: flex; align-items: center;
          background: var(--surface);
          border: 1.5px solid var(--border-mid);
          border-radius: var(--radius);
          transition: border-color .15s, box-shadow .15s;
          overflow: hidden;
        }
        .input-field:focus-within {
          border-color: var(--green);
          box-shadow: 0 0 0 3px rgba(29,158,117,0.12);
        }
        .input-field.input-error { border-color: var(--danger); }
        .input-field.input-error:focus-within { box-shadow: 0 0 0 3px rgba(226,75,74,0.12); }
        .input-field input {
          flex: 1; padding: 11px 14px; font-size: 15px;
          background: transparent; border: none; outline: none;
          color: var(--text); min-width: 0;
        }
        .input-field input::placeholder { color: var(--text3); }
        .input-prefix, .input-suffix {
          padding: 0 12px; color: var(--text3); font-size: 14px;
          display: flex; align-items: center; flex-shrink: 0;
        }
        .input-prefix { border-right: 1px solid var(--border); }
        .input-suffix { border-left: 1px solid var(--border); }
        .input-eye {
          padding: 0 12px; color: var(--text3);
          display: flex; align-items: center; flex-shrink: 0;
          background: none; border: none; cursor: pointer;
          transition: color .15s; height: 100%;
        }
        .input-eye:hover { color: var(--text2); }
        .input-err-msg { font-size: 12px; color: var(--danger); }
        .input-hint { font-size: 12px; color: var(--text3); }
      `}</style>
    </div>
  )
})

Input.displayName = 'Input'
export default Input