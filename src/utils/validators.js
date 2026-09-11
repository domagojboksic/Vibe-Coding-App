// ── Username ──────────────────────────────────────────────────────
export function validateUsername(value) {
  if (!value) return 'Username is required'
  if (value.length < 3) return 'At least 3 characters'
  if (value.length > 20) return 'Max 20 characters'
  if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers and _'
  if (/^_|_$/.test(value)) return "Can't start or end with _"
  return null
}

// ── Email ─────────────────────────────────────────────────────────
export function validateEmail(value) {
  if (!value) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email'
  return null
}

// ── Password strength ─────────────────────────────────────────────
// Returns { score: 0-4, label, color, checks }
export function getPasswordStrength(password) {
  const checks = {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number:    /[0-9]/.test(password),
    special:   /[^A-Za-z0-9]/.test(password),
  }

  const score = Object.values(checks).filter(Boolean).length

  const levels = [
    { label: '',         color: 'var(--border-mid)' },
    { label: 'Too weak', color: 'var(--danger)' },
    { label: 'Weak',     color: '#E2882A' },
    { label: 'Fair',     color: 'var(--warning)' },
    { label: 'Strong',   color: 'var(--green)' },
    { label: 'Very strong', color: '#0F6E56' },
  ]

  return { score, checks, ...levels[score] }
}

export function validatePassword(value) {
  if (!value) return 'Password is required'
  if (value.length < 8) return 'At least 8 characters'
  const { score } = getPasswordStrength(value)
  if (score < 3) return 'Password is too weak'
  return null
}
