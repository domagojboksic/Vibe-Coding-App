import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { fetchProfile } from '../api/auth.api'

// Boot hook — call once in App.jsx
export function useAuthBoot() {
  const { setUser, setProfile, setReady, clear } = useAuthStore()

  useEffect(() => {
    // 1. Check for existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        const { data } = await fetchProfile(session.user.id)
        setProfile(data)
      }
      setReady(true)
    })

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          const { data } = await fetchProfile(session.user.id)
          setProfile(data)
        } else {
          clear()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])
}

// Simple selector hooks
export const useUser    = () => useAuthStore(s => s.user)
export const useProfile = () => useAuthStore(s => s.profile)
export const useReady   = () => useAuthStore(s => s.ready)
