// src/features/workouts/functions/components/ExerciseRow.jsx
import SetRow from './SetRow';

const emptySet = () => ({ reps: '', weight: '' });

export default function ExerciseRow({ exercise, index, onChange, onRemove }) {
  const updateField = (field) => (e) => {
    onChange(index, { ...exercise, [field]: e.target.value });
  };

  const updateSet = (setIndex, updatedSet) => {
    const sets = exercise.sets.map((s, i) => (i === setIndex ? updatedSet : s));
    onChange(index, { ...exercise, sets });
  };

  const addSet = () => {
    onChange(index, { ...exercise, sets: [...exercise.sets, emptySet()] });
  };

  const removeSet = (setIndex) => {
    onChange(index, { ...exercise, sets: exercise.sets.filter((_, i) => i !== setIndex) });
  };

  return (
    <div className="exercise-block">
      <div className="exercise-block__header">
        <input
          type="text"
          placeholder="Exercise name (e.g. Bench press)"
          value={exercise.name}
          onChange={updateField('name')}
          required
          className="exercise-block__name"
        />
        <select value={exercise.weightUnit} onChange={updateField('weightUnit')} className="exercise-block__unit">
          <option value="kg">kg</option>
          <option value="lb">lb</option>
        </select>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="exercise-block__remove"
          aria-label="Remove exercise"
        >
          ✕
        </button>
      </div>

      <div className="exercise-block__sets">
        {exercise.sets.map((set, i) => (
          <SetRow key={i} set={set} setIndex={i} onChange={updateSet} onRemove={removeSet} />
        ))}
      </div>

      <button type="button" onClick={addSet} className="exercise-block__add-set">
        + Add set
      </button>
    </div>
  );
}