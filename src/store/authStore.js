import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user:    null,   // Supabase auth user
  profile: null,   // public.profiles row
  ready:   false,  // has the initial session check finished?

  setUser:    (user)    => set({ user }),
  setProfile: (profile) => set({ profile }),
  setReady:   (ready)   => set({ ready }),

  clear: () => set({ user: null, profile: null }),
}))
