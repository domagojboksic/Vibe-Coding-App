// src/features/workouts/functions/components/SetRow.jsx
export default function SetRow({ set, setIndex, onChange, onRemove }) {
  const handleChange = (field) => (e) => {
    onChange(setIndex, { ...set, [field]: e.target.value });
  };

  return (
    <div className="set-row">
      <span className="set-row__number">Set {setIndex + 1}</span>
      <input
        type="number"
        placeholder="Reps"
        value={set.reps}
        onChange={handleChange('reps')}
        min="0"
        className="set-row__input"
      />
      <input
        type="number"
        placeholder="Weight"
        value={set.weight}
        onChange={handleChange('weight')}
        min="0"
        step="0.5"
        className="set-row__input"
      />
      <button
        type="button"
        onClick={() => onRemove(setIndex)}
        className="set-row__remove"
        aria-label="Remove set"
      >
        ✕
      </button>
    </div>
  );
}