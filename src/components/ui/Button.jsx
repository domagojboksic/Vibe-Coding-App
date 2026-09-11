export default function Button({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false,
  className = '', ...props
}) {
  return (
    <>
      <button
        className={`btn btn-${variant} btn-${size} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <span className="btn-spinner" /> : children}
      </button>

      <style>{`
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 8px; font-weight: 600; border-radius: var(--radius);
          transition: opacity .15s, transform .1s, background .15s;
          white-space: nowrap; flex-shrink: 0;
          border: none; cursor: pointer; font-family: inherit;
        }
        .btn:disabled { opacity: .5; cursor: not-allowed; }
        .btn:not(:disabled):active { transform: scale(.97); }

        .btn-sm { font-size: 13px; padding: 7px 14px; }
        .btn-md { font-size: 15px; padding: 12px 20px; }
        .btn-lg { font-size: 16px; padding: 14px 24px; }

        .btn-primary { background: var(--green); color: #fff; }
        .btn-primary:not(:disabled):hover { background: #189966; }

        .btn-secondary { background: var(--surface2); color: var(--text); border: 1.5px solid var(--border-mid); }
        .btn-secondary:not(:disabled):hover { background: var(--surface3); }

        .btn-ghost { background: transparent; color: var(--text2); }
        .btn-ghost:not(:disabled):hover { background: var(--surface2); color: var(--text); }

        .btn-danger { background: var(--danger-light); color: var(--danger); }
        .btn-danger:not(:disabled):hover { background: #f5c1c1; }

        .btn-full { width: 100%; }

        .btn-spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          animation: spin .6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}
