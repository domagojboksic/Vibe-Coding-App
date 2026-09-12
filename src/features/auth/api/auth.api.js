import { supabase } from '@/lib/supabase'

export async function signUp({ email, password, username, fullName }) {
  const normalizedUsername = username.toLowerCase().trim()

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', normalizedUsername)
    .maybeSingle()

  if (existing) {
    return { error: { message: 'Username already taken. Try another one.' } }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: normalizedUsername, full_name: fullName } }
  })

  if (error) return { error }
  if (!data.user) return { error: { message: 'Signup failed, please try again.' } }

  const colors = ['av-a', 'av-b', 'av-c', 'av-d', 'av-e']
  const avatarColor = colors[Math.floor(Math.random() * colors.length)]

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id:           data.user.id,
      username:     normalizedUsername,
      full_name:    fullName.trim(),
      avatar_color: avatarColor,
    })

  if (profileError) {
    if (profileError.code === '23505') {
      return { error: { message: 'Username already taken. Try another one.' } }
    }
    return { error: profileError }
  }

  return { data }
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function checkUsername(username) {
  if (username.length < 3) return { available: false }

  const { data } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', username.toLowerCase().trim())
    .maybeSingle()

  return { available: !data }
}

export async function resetPassword(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
}