import React from "react";
import Spinner from "@/components/Spinner/Spinner";
import { useFetch } from "@/hooks/useFetch";
import { WorkoutItem } from "@/components/WorkoutItem";
import type { WorkoutResponseModel } from "@/types/workout";

const WORKOUTS_ENDPOINT =
  "https://workout-api-h8aae7hfcaghgvdb.swedencentral-01.azurewebsites.net/api/workout";

const WorkoutsPage: React.FC = () => {
  const { data, loading, error, refetch } =
    useFetch<WorkoutResponseModel[]>(WORKOUTS_ENDPOINT);

  const handleBook = async (workoutId: string) => {
    alert(`Book clicked for workout id: ${workoutId}`);
  };

  if (loading) return <Spinner />;

  const workouts = Array.isArray(data) ? data : [];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {error && (
        <div
          role="alert"
          className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 shadow"
        >
          <p>{`Vi kunde inte hämta passen just nu.: ${error}`}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-sm underline hover:text-red-600"
          >
            Försök igen
          </button>
        </div>
      )}

      {workouts.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl shadow-md">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pass
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Plats
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Start
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Instruktör
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {workouts.map((w, i) => (
                <WorkoutItem
                  key={w.id}
                  workout={w}
                  index={i}
                  onBook={handleBook}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : !error ? (
        <p className="text-gray-600 text-center">No workouts found.</p>
      ) : null}
    </div>
  );
};

export default WorkoutsPage;
