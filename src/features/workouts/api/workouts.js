// src/features/workouts/api/workouts.js
import { supabase } from '@/lib/supabase';

export async function createWorkout({ title, notes, visibility, exercises }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: workout, error: workoutError } = await supabase
    .from('workouts')
    .insert({ user_id: user.id, title, notes, visibility })
    .select()
    .single();

  if (workoutError) throw workoutError;

  // Insert exercises one at a time so we get each exercise's real id
  // back before inserting its sets (safer than a bulk insert + guessing order).
  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];

    const { data: exerciseRow, error: exerciseError } = await supabase
      .from('workout_exercises')
      .insert({ workout_id: workout.id, exercise_name: ex.name, order_index: i })
      .select()
      .single();

    if (exerciseError) throw exerciseError;

    const setRows = ex.sets.map((s, j) => ({
      workout_exercise_id: exerciseRow.id,
      set_number: j + 1,
      reps: s.reps || null,
      weight: s.weight || null,
      weight_unit: ex.weightUnit || 'kg',
    }));

    const { error: setsError } = await supabase
      .from('workout_sets')
      .insert(setRows);

    if (setsError) throw setsError;
  }

  return workout;
}

export async function fetchFeed({ page = 0, pageSize = 10 } = {}) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('workouts')
    .select(`
      id, title, notes, visibility, created_at,
      profiles ( id, username, full_name, avatar_color ),
      workout_exercises (
        id, exercise_name, order_index,
        workout_sets ( id, set_number, reps, weight, weight_unit, duration_seconds )
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { workouts: data, total: count };
}