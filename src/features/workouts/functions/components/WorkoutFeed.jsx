// src/features/workouts/functions/components/WorkoutFeed.jsx
import { useEffect } from 'react';
import { useWorkoutStore } from '@/features/workouts/functions/store/useWorkoutStore';
import WorkoutCard from './WorkoutCard';

export default function WorkoutFeed() {
  const { feed, loading, hasMore, loadFeed, error } = useWorkoutStore();

  useEffect(() => {
    loadFeed(true);
  }, []);

  return (
    <div className="workout-feed">
      {error && <p className="workout-feed__error">Error: {error}</p>}

      {feed.map((w) => (
        <WorkoutCard key={w.id} workout={w} />
      ))}

      {loading && <p className="workout-feed__status">Loading...</p>}
      {!loading && feed.length === 0 && <p className="workout-feed__status">No workouts yet.</p>}
      {!loading && hasMore && (
        <button onClick={() => loadFeed(false)} className="workout-feed__load-more">
          Load more
        </button>
      )}
    </div>
  );
}