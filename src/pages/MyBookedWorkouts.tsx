import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner/Spinner";
import { WorkoutItem } from "@/components/WorkoutItem";
import { toast } from "sonner";

type BookingDetails = {
  title: string;
  location: string;
  startTime: string;
  instructor: string;
};

export default function MyBookedWorkouts() {
  const navigate = useNavigate();

  //Local state for loading, errors and fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingDetails[]>([]);

  useEffect(() => {
    const email = sessionStorage.getItem("loggedInUserEmail");

    if (!email) {
      navigate("/logga-in");
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Get bookings
        //https://localhost:7175/api/Bookings/GetMyBookings/${email}
        //
        const bookingsRes: BookingDetails[] = await fetch(
          `https://bookingservice-api-e0e6hed3dca6egak.swedencentral-01.azurewebsites.net/api/Bookings/GetMyBookings/${email}`
        ).then((res) => {
          if (!res.ok) throw new Error("Kunde inte hämta bokningar");
          return res.json();
        });
        console.log("Bookings from API:", bookingsRes);
        setBookings(bookingsRes);

        if (bookingsRes.length === 0) {
          setBookings([]);
          return;
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ett okänt fel inträffade");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);
  if (loading) return <Spinner />;
  if (error) {
    toast.error(error);
    return null;
  }

  // Render booked workouts
  return (
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
              Tid
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Instruktör
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bookings.map((booking, index) => (
            <WorkoutItem
              key={index}
              workout={{
                id: index.toString(),
                title: booking.title,
                location: booking.location,
                startTime: booking.startTime,
                instructor: booking.instructor,
              }}
              index={index}
              isBooked={true}
              onBookingChanged={() => {}}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
