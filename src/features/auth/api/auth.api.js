import { supabase } from '@/lib/supabase'

// ── Sign up ───────────────────────────────────────────────────────
export async function signUp({ email, password, username, fullName }) {
  // 1. Check username is available before creating auth user
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', username)   // case-insensitive check
    .maybeSingle()

  if (existing) {
    return { error: { message: 'Username is already taken. Try another one.' } }
  }

  // 2. Create auth user (Supabase sends confirmation email if enabled)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, full_name: fullName }  // stored in auth.users metadata
    }
  })
  if (error) return { error }

  // 3. Create public profile
  const colors = ['av-a', 'av-b', 'av-c', 'av-d', 'av-e']
  const avatarColor = colors[Math.floor(Math.random() * colors.length)]

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id:           data.user.id,
      username:     username.toLowerCase().trim(),
      full_name:    fullName.trim(),
      avatar_color: avatarColor,
    })

  if (profileError) return { error: profileError }
  return { data }
}

// ── Sign in ───────────────────────────────────────────────────────
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

// ── Sign out ──────────────────────────────────────────────────────
export async function signOut() {
  return supabase.auth.signOut()
}

// ── Get current session ───────────────────────────────────────────
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ── Fetch profile by user id ──────────────────────────────────────
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

// ── Check username availability (used for live feedback) ──────────
export async function checkUsername(username) {
  if (username.length < 3) return { available: false, error: 'Too short' }

  const { data } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', username)
    .maybeSingle()

  return { available: !data }
}

// ── Reset password ────────────────────────────────────────────────
export async function resetPassword(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
}
