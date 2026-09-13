// src/features/workouts/functions/components/WorkoutCard.jsx
export default function WorkoutCard({ workout }) {
  const exercises = [...(workout.workout_exercises || [])].sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
  );

  return (
    <article className="workout-card">
      <header className="workout-card__header">
        <span
          className={`workout-card__avatar workout-card__avatar--${workout.profiles?.avatar_color || 'c'}`}
        >
          {(workout.profiles?.username ?? '?')[0].toUpperCase()}
        </span>
        <span className="workout-card__author">
          {workout.profiles?.full_name || workout.profiles?.username || 'Someone'}
        </span>
        <span className="workout-card__time">{new Date(workout.created_at).toLocaleString()}</span>
        {workout.visibility === 'private' && <span className="workout-card__badge">Private</span>}
      </header>

      {workout.title && <h3 className="workout-card__title">{workout.title}</h3>}

      <div className="workout-card__exercises">
        {exercises.map((ex) => {
          const sets = [...(ex.workout_sets || [])].sort((a, b) => a.set_number - b.set_number);
          return (
            <div key={ex.id} className="workout-card__exercise">
              <div className="exercise-name">{ex.exercise_name}</div>
              <ul className="workout-card__sets">
                {sets.map((s) => (
                  <li key={s.id} className="set-row set-row--display">
                    <span className="set-row__number">Set {s.set_number}</span>
                    <span className="set-row__result">
                      {s.reps ? `${s.reps} reps` : ''}
                      {s.weight ? ` @ ${s.weight}${s.weight_unit}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {workout.notes && <p className="workout-card__notes">{workout.notes}</p>}
    </article>
  );
}