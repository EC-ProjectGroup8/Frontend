import React, { useMemo } from "react";
import Spinner from "@/components/Spinner/Spinner";
import { useFetch } from "@/hooks/useFetch";
import { WorkoutItem } from "@/components/WorkoutItem";
import WorkoutDetailsModal from "@/components/WorkoutDetailsModal";
import type { WorkoutResponseModel } from "@/types/workout";

// ANTAGANDE: RawBookingModel måste matcha den råa C# WorkoutIdDto:n
interface RawBookingModel {
  id: number;
  userEmail: string;
  // Det här fältet kommer från C# som 'WorkoutIdentifier', men JSON heter 'workoutIdentifier'
  workoutIdentifier: string;
}

const WORKOUTS_ENDPOINT =
  "https://workout-api-h8aae7hfcaghgvdb.swedencentral-01.azurewebsites.net/api/workout";
const BOOKINGS_API_BASE =
  "https://bookingservice-api-e0e6hed3dca6egak.swedencentral-01.azurewebsites.net/api/Bookings";

const Workouts: React.FC = () => {
  const userEmail =
    typeof window !== "undefined"
      ? sessionStorage.getItem("loggedInUserEmail")
      : null;

  const {
    data: allWorkouts,
    loading: workoutsLoading,
    error: workoutsError,
    refetch: refetchWorkouts,
  } = useFetch<WorkoutResponseModel[]>(WORKOUTS_ENDPOINT);

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openDetails = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const closeDetails = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  }; 

  const bookingUrl = userEmail
    ? `${BOOKINGS_API_BASE}/GetRawBookings/${userEmail}`
    : null;

  // FIX: Återinför 'as unknown as string' för att kringgå TS-reglerna
  const {
    data: myBookings,
    loading: bookingsLoading,
    error: bookingsError,
    refetch: refetchMyBookings,
  } = useFetch<RawBookingModel[]>(bookingUrl as unknown as string);

  const bookedWorkoutIds = useMemo(() => {
    if (!myBookings) return new Set<string>();

    // SLUTGILTIG FIX: Använder det faktiska JSON-fältnamnet (camelCase)
    // om din typdefinition (RawBookingModel) använder camelCase, annars b.workoutIdentifier
    return new Set(myBookings.map((b) => b.workoutIdentifier));
  }, [myBookings]);

  const handleBookingChanged = () => {
    refetchMyBookings();
  };

  const isLoading = workoutsLoading || bookingsLoading;
  const error = workoutsError || bookingsError;
  const refetch = () => {
    refetchWorkouts();
    if (userEmail) refetchMyBookings();
  };

  if (isLoading) return <Spinner />;

  const workouts = Array.isArray(allWorkouts) ? allWorkouts : [];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {error && (
        <div
          role="alert"
          className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 shadow"
        >

          <p>{`Kunde inte ladda passen: ${error}`}</p>

          <button
            onClick={refetch}
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
                  Starttid
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Instruktör
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Handling


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
                  // DENNA MATCHAR NU KORREKT: w.id (Crossfit ID) mot Set { Crossfit ID }
                  isBooked={bookedWorkoutIds.has(w.id)}
                  onBookingChanged={handleBookingChanged}
                  onViewDetails={openDetails}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : !error ? (
        <p className="text-gray-600 text-center">Inga pass hittades.</p>
      ) : null}

      {/* Details modal */}
      <WorkoutDetailsModal
        workoutId={selectedId}
        isOpen={isModalOpen}
        onClose={closeDetails}
      />
    </div>
  );
};

export default Workouts;
