// src/features/workouts/functions/components/WorkoutForm.jsx
import { useState } from 'react';
import { useWorkoutStore } from '@/features/workouts/functions/store/useWorkoutStore';
import ExerciseRow from './ExerciseRow';

const emptySet = () => ({ reps: '', weight: '' });
const emptyExercise = () => ({ name: '', weightUnit: 'kg', sets: [emptySet()] });

export default function WorkoutForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [exercises, setExercises] = useState([emptyExercise()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const addWorkout = useWorkoutStore((s) => s.addWorkout);

  const updateExercise = (index, updated) => {
    setExercises((prev) => prev.map((ex, i) => (i === index ? updated : ex)));
  };

  const removeExercise = (index) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const addExercise = () => setExercises((prev) => [...prev, emptyExercise()]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanExercises = exercises
      .filter((ex) => ex.name.trim())
      .map((ex) => ({
        name: ex.name.trim(),
        weightUnit: ex.weightUnit,
        sets: ex.sets
          .filter((s) => s.reps !== '' || s.weight !== '')
          .map((s) => ({
            reps: s.reps ? Number(s.reps) : null,
            weight: s.weight ? Number(s.weight) : null,
          })),
      }))
      .filter((ex) => ex.sets.length > 0);

    if (cleanExercises.length === 0) {
      setError('Add at least one exercise with at least one set.');
      return;
    }

    setSubmitting(true);
    try {
      await addWorkout({
        title: title.trim() || null,
        notes: notes.trim() || null,
        visibility,
        exercises: cleanExercises,
      });
      setTitle('');
      setNotes('');
      setVisibility('public');
      setExercises([emptyExercise()]);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="workout-form">
      <input
        type="text"
        placeholder="Workout title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="workout-form__title"
      />

      <div className="workout-form__exercises">
        {exercises.map((ex, i) => (
          <ExerciseRow key={i} exercise={ex} index={i} onChange={updateExercise} onRemove={removeExercise} />
        ))}
      </div>

      <button type="button" onClick={addExercise} className="workout-form__add-exercise">
        + Add exercise
      </button>

      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="workout-form__notes"
      />

      <label className="workout-form__visibility">
        <input
          type="checkbox"
          checked={visibility === 'private'}
          onChange={(e) => setVisibility(e.target.checked ? 'private' : 'public')}
        />
        Private (only followers can see)
      </label>

      {error && <p className="workout-form__error">{error}</p>}

      <button type="submit" disabled={submitting} className="workout-form__submit">
        {submitting ? 'Posting...' : 'Post workout'}
      </button>
    </form>
  );
}