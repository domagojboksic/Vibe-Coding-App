// src/features/workouts/store/useWorkoutStore.js
// src/features/workouts/functions/store/useWorkoutStore.js
import { create } from 'zustand';
import { fetchFeed, createWorkout } from '@/features/workouts/api/workouts';  // ← promijenjeno

export const useWorkoutStore = create((set, get) => ({
  feed: [],
  page: 0,
  hasMore: true,
  loading: false,
  error: null,

  loadFeed: async (reset = false) => {
    set({ loading: true, error: null });
    try {
      const page = reset ? 0 : get().page;
      const { workouts, total } = await fetchFeed({ page });
      set((state) => ({
        feed: reset ? workouts : [...state.feed, ...workouts],
        page: page + 1,
        hasMore: (page + 1) * 10 < total,
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // src/features/workouts/functions/store/useWorkoutStore.js
addWorkout: async (workoutData) => {
  await createWorkout(workoutData);
  await get().loadFeed(true); // refetch iz baze, ispravni podaci, ispravan join
},
}));