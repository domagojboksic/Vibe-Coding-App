import { useState, useEffect, useRef } from 'react'
import Input from '@/components/ui/Input'
import { validateUsername } from '@/utils/validators'
import { checkUsername } from '../api/auth.api'

export default function UsernameField({ value, onChange, error, setError }) {
  const [status, setStatus] = useState(null) // 'checking' | 'available' | 'taken' | null
  const [localError, setLocalError] = useState(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!value) {
      setStatus(null)
      setLocalError(null)
      return
    }

    // Show local validation errors immediately while typing
    const validationError = validateUsername(value)
    if (validationError) {
      setLocalError(validationError)
      setStatus(null)
      clearTimeout(debounceRef.current)
      return
    }

    // Passed local validation — clear local error, check availability
    setLocalError(null)
    setStatus('checking')
    clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      const { available } = await checkUsername(value)
      setStatus(available ? 'available' : 'taken')
      if (!available) {
        setError('username', 'Username already taken')
      } else {
        setError('username', null)
      }
    }, 600)

    return () => clearTimeout(debounceRef.current)
  }, [value])

  const suffix = () => {
    if (localError)             return <span style={{fontSize:16,color:'var(--danger)'}}>✗</span>
    if (status === 'checking')  return <span style={{fontSize:11,color:'var(--text3)'}}>checking…</span>
    if (status === 'available') return <span style={{fontSize:16,color:'var(--green)'}}>✓</span>
    if (status === 'taken')     return <span style={{fontSize:16,color:'var(--danger)'}}>✗</span>
    return null
  }

  const hint = status === 'available' ? 'Username is available!' : null
  const fieldError = localError || error || (status === 'taken' ? 'Username already taken' : null)

  return (
    <Input
      label="Username"
      value={value}
      onChange={e => {
        onChange(e)
        setStatus(null)
      }}
      placeholder="your_username"
      prefix="@"
      suffix={suffix()}
      error={fieldError}
      hint={hint}
      maxLength={20}
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
    />
  )
}