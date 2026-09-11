import { getPasswordStrength } from '@/utils/validators'

export default function PasswordStrength({ password }) {
  if (!password) return null

  const { score, label, color, checks } = getPasswordStrength(password)

  const checkItems = [
    { key: 'length',    text: 'At least 8 characters' },
    { key: 'uppercase', text: 'Uppercase letter' },
    { key: 'lowercase', text: 'Lowercase letter' },
    { key: 'number',    text: 'Number' },
    { key: 'special',   text: 'Special character (!@#...)' },
  ]

  return (
    <div className="ps-wrap">
      {/* Bar */}
      <div className="ps-bar-track">
        {[1,2,3,4,5].map(i => (
          <div
            key={i}
            className="ps-bar-seg"
            style={{ background: i <= score ? color : 'var(--surface3)' }}
          />
        ))}
      </div>
      {label && <span className="ps-label" style={{ color }}>{label}</span>}

      {/* Checklist */}
      <div className="ps-checks">
        {checkItems.map(({ key, text }) => (
          <div key={key} className={`ps-check ${checks[key] ? 'ok' : ''}`}>
            <span className="ps-icon">{checks[key] ? '✓' : '○'}</span>
            {text}
          </div>
        ))}
      </div>

      <style>{`
        .ps-wrap { display: flex; flex-direction: column; gap: 8px; margin-top: 2px; }
        .ps-bar-track { display: flex; gap: 4px; }
        .ps-bar-seg {
          flex: 1; height: 4px; border-radius: 99px;
          transition: background .3s;
        }
        .ps-label { font-size: 12px; font-weight: 600; align-self: flex-end; margin-top: -4px; }
        .ps-checks { display: flex; flex-direction: column; gap: 3px; }
        .ps-check {
          display: flex; align-items: center; gap: 7px;
          font-size: 12px; color: var(--text3);
          transition: color .2s;
        }
        .ps-check.ok { color: var(--text2); }
        .ps-icon {
          font-size: 11px; width: 14px; text-align: center;
          color: var(--text3); transition: color .2s;
        }
        .ps-check.ok .ps-icon { color: var(--green); }
      `}</style>
    </div>
  )
}
