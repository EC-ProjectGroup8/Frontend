import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner/Spinner";
import WorkoutItem from "@/components/WorkoutItem";
import type { WorkoutResponseModel } from "@/types/workout";
import { toast } from "sonner";



type Booking = {
  workoutIdentifier: string;
};

export default function MyBookedWorkouts() {
  const navigate = useNavigate();

  //Local state for loading, errors and fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutResponseModel[]>([]);

  useEffect(() => {

    // Get user email from sessionStorage
    const email = sessionStorage.getItem("email");

    // Redirected to login if no email found
    if (!email) {
      navigate("/signin");
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Get bookings
        const bookingsRes: Booking[] = await fetch(
          `/api/bookings/my?email=${email}`
        ).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch bookings");
          return res.json();
        });

        // Stop if no bookings found
        setBookings(bookingsRes);


        if (bookingsRes.length === 0) {
          setWorkouts([]);
          return;
        }

        // Get workouts linked to booking IDs
        const workoutIds = bookingsRes.map((b) => b.workoutIdentifier);
        const workoutsRes: WorkoutResponseModel[] = await fetch(
          `/api/workout?ids=${workoutIds.join(",")}`
        ).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch workouts");
          return res.json();
        });

        setWorkouts(workoutsRes);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  // Show Loading spinner while getting data

  if (loading) return <Spinner />;

  // Show error toast if request fails
 if (error) {
  toast.error(error); 
  return null; 
}

    // Show empty state if no workouts booked
  if (workouts.length === 0) {
    return <p className="text-center mt-8">You have no booked workouts.</p>;
  }
  // Render booked workouts
  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">My booked workouts</h1>
    <div className="grid gap-4">
      {workouts.map((workout, index) => (
        <WorkoutItem
          key={workout.id}
          workout={workout}
          index={index}
          onBook={() => {}} 
        />
      ))}
    </div>
  </div>
);

}
