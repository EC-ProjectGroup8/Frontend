import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner/Spinner";
import { WorkoutItem } from "@/components/WorkoutItem";
import WorkoutDetailsModal from "@/components/WorkoutDetailsModal";
import { toast } from "sonner";

// API-endpoints
const WORKOUTS_BASE =
  "https://workout-api-h8aae7hfcaghgvdb.swedencentral-01.azurewebsites.net/api/workout";
const BOOKINGS_BASE =
  "https://bookingservice-api-e0e6hed3dca6egak.swedencentral-01.azurewebsites.net/api/Bookings";

// Fullständig endpoint för att hämta alla pass
type RawBooking = {
  id: number;
  userEmail: string;
  workoutIdentifier: string;
};

type BookingDetails = {
  workoutIdentifier: string;
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

  // State för vald bokning och modal
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDetails = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };
  const closeDetails = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

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

        const rawBooking: RawBooking[] = await fetch(
          `${BOOKINGS_BASE}/GetrawBookings/${email}`
        ).then((res) => {
          if (!res.ok) throw new Error("Kunde inte hämta bokningar");
          return res.json();
        });

        if (rawBooking.length === 0) {
          setBookings([]);
          return;
        }

        const details = await Promise.all(
          rawBooking.map(async (rb) => {
            const workoutDetails = await fetch(
              `${WORKOUTS_BASE}/${rb.workoutIdentifier}`).then((res) => {
                if (!res.ok) throw new Error("Kunde inte hämta passdetaljer");
                return res.json();
              });

              const d: BookingDetails = {
                workoutIdentifier: rb.workoutIdentifier,
                title: workoutDetails.title,
                location: workoutDetails.location,
                startTime: workoutDetails.startTime,
                instructor: workoutDetails.instructor,
              };
              return d;
          })
        );

        setBookings(details);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ett okänt fel inträffade");
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
              key={booking.workoutIdentifier}                
              workout={{
                id: booking.workoutIdentifier,
                title: booking.title,
                location: booking.location,
                startTime: booking.startTime,
                instructor: booking.instructor,
              }}
              index={index}
              isBooked={true}
              onBookingChanged={() => {}}
              onViewDetails={openDetails} 
            />
          ))}
        </tbody>
      </table>
      
      {/* Detaljmodal för valt pass */}
      <WorkoutDetailsModal
        workoutId={selectedId}
        isOpen={isModalOpen}
        onClose={closeDetails}
      />
    </div>
  );
}