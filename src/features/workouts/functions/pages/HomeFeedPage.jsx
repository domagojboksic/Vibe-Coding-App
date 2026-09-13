import { useState } from 'react';
import '@/styles/workouts.css';
import WorkoutForm from '@/features/workouts/functions/components/WorkoutForm';  // ← promijenjeno
import WorkoutFeed from '@/features/workouts/functions/components/WorkoutFeed';  // ← promijenjeno


export default function HomeFeedPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="home-feed-page">
      <button onClick={() => setShowForm((v) => !v)} className="home-feed-page__toggle">
        {showForm ? 'Cancel' : 'Log a workout'}
      </button>

      {showForm && <WorkoutForm onSuccess={() => setShowForm(false)} />}

      <WorkoutFeed />
    </div>
  );
}