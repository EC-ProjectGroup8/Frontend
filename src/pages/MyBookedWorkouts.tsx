import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner/Spinner";
import { WorkoutItem } from "@/components/WorkoutItem";
import WorkoutDetailsModal from "@/components/WorkoutDetailsModal";
import Toast from "@/components/Toast/Toast";
import { toast } from "sonner";

const WORKOUTS_BASE =
  "https://workout-api-h8aae7hfcaghgvdb.swedencentral-01.azurewebsites.net/api/workout";
const BOOKINGS_BASE =
  "https://bookingservice-api-e0e6hed3dca6egak.swedencentral-01.azurewebsites.net/api/Bookings";

type RawBooking = {
  id: number;
  userEmail: string;
  workoutIdentifier: string;
};

type BookingDetails = {
  bookingId: number;
  workoutIdentifier: string;
  title: string;
  location: string;
  startTime: string;
  instructor: string;
};

export default function MyBookedWorkouts() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const emailRef = useRef<string | null>(null);

  const openDetails = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };
  const closeDetails = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const fetchAll = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    try {
      if (!silent) setLoading(true);
      setError(null);

      const email = emailRef.current;
      if (!email) throw new Error("Ingen användare inloggad");

      const raw: RawBooking[] = await fetch(
        `${BOOKINGS_BASE}/GetRawBookings/${email}`
      ).then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta bokningar");
        return res.json();
      });

      if (!raw || raw.length === 0) {
        setBookings([]);
      } else {
        const details = await Promise.all(
          raw.map(async (rb) => {
            const w = await fetch(
              `${WORKOUTS_BASE}/${rb.workoutIdentifier}`
            ).then((res) => {
              if (!res.ok) throw new Error("Kunde inte hämta passdetaljer");
              return res.json();
            });
            return {
              bookingId: rb.id,
              workoutIdentifier: rb.workoutIdentifier,
              title: w.title,
              location: w.location,
              startTime: w.startTime,
              instructor: w.instructor,
            } as BookingDetails;
          })
        );
        setBookings(details);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ett okänt fel inträffade");
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const email = sessionStorage.getItem("loggedInUserEmail");
    if (!email) {
      navigate("/logga-in");
      return;
    }
    emailRef.current = email;
    fetchAll();
  }, [navigate, fetchAll]);

  const cancelBookingByWorkout = async (workoutIdentifier: string) => {
    try {
      const email = emailRef.current;
      if (!email) throw new Error("Ingen användare inloggad");

      const res = await fetch(
        `${BOOKINGS_BASE}/${email}/${workoutIdentifier}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Avbokning lyckades!");
      await fetchAll({ silent: true });
    } catch {
      toast.error("Det gick inte att avboka. Försök igen.");
    }
  };

  return (
    <div className="relative overflow-x-auto rounded-2xl shadow-md p-2">
      <Toast />

      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
          <Spinner />
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 shadow"
        >
          <p>{error}</p>
          <button
            onClick={() => fetchAll({ silent: false })}
            className="mt-2 text-sm underline hover:text-red-600"
          >
            Försök igen
          </button>
        </div>
      )}

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
          {bookings.map((b, index) => (
            <WorkoutItem
              key={b.workoutIdentifier}
              workout={{
                id: b.workoutIdentifier,
                title: b.title,
                location: b.location,
                startTime: b.startTime,
                instructor: b.instructor,
              }}
              index={index}
              isBooked={true}
              onCancel={() => cancelBookingByWorkout(b.workoutIdentifier)}
              onViewDetails={openDetails}
            />
          ))}
        </tbody>
      </table>

      <WorkoutDetailsModal
        workoutId={selectedId}
        isOpen={isModalOpen}
        onClose={closeDetails}
      />
    </div>
  );
}
