import { forwardRef } from 'react'

const Input = forwardRef(({
  label, error, hint, suffix, prefix,
  className = '', ...props
}, ref) => {
  const hasError = Boolean(error)

  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field ${hasError ? 'input-error' : ''} ${prefix ? 'has-prefix' : ''} ${suffix ? 'has-suffix' : ''}`}>
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input ref={ref} {...props} />
        {suffix && <span className="input-suffix">{suffix}</span>}
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
          color: var(--text);
        }
        .input-field input::placeholder { color: var(--text3); }
        .input-prefix, .input-suffix {
          padding: 0 12px; color: var(--text3); font-size: 14px;
          display: flex; align-items: center; flex-shrink: 0;
        }
        .input-prefix { border-right: 1px solid var(--border); }
        .input-suffix { border-left: 1px solid var(--border); }
        .input-err-msg { font-size: 12px; color: var(--danger); }
        .input-hint { font-size: 12px; color: var(--text3); }
      `}</style>
    </div>
  )
})

Input.displayName = 'Input'
export default Input
