import React, { useState } from "react";
import { formatDateTime } from "@/lib/utils/formatDateTimeUtil";
import type { WorkoutResponseModel } from "@/types/workout";

type WorkoutItemProps = {
  workout: WorkoutResponseModel;
  index: number;
  onBook: (workoutId: string) => void;
};

const WorkoutItemComponent: React.FC<WorkoutItemProps> = ({
  workout,
  index,
  onBook,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBookWorkout = async () => {
    // 1. Hämta e-post från sessionStorage
    const userEmail = sessionStorage.getItem("loggedInUserEmail");

    // 2. Kontrollera att användaren är inloggad
    if (!userEmail) {
      setError("Du måste vara inloggad för att kunna boka ett pass.");
      return; // Avbryt om ingen e-post finns
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://bookingservice-api-e0e6hed3dca6egak.swedencentral-01.azurewebsites.net/api/Bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: userEmail, // 3. Använd den hämtade e-posten
            workoutIdentifier: workout.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Kunde inte boka passet. Försök igen.");
      }

      setIsBooked(true);
      // Informera föräldern om bokningen
      onBook(workout.id);
    } catch (err: unknown) {
      // rätt hantering av unknown i TypeScript
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err) || "Ett oväntat fel inträffade.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <tr
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } hover:bg-indigo-50 transition-colors`}
      data-testid={`workout-row-${workout.id}`}
    >
      <td className="px-6 py-4 text-gray-800">{workout.title}</td>
      <td className="px-6 py-4 text-gray-700">{workout.location}</td>
      <td className="px-6 py-4 text-gray-700">
        {formatDateTime(workout.startTime)}
      </td>
      <td className="px-6 py-4 text-gray-700">{workout.instructor}</td>
      <td className="px-6 py-4">
        <button
          className="primary-button book-btn hover:shadow-md transition-all duration-200 ease-in-out active:scale-95 focus:scale-102 hover:scale-102 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleBookWorkout}
          aria-label={`Book workout ${workout.title}`}
          disabled={isLoading || isBooked}
        >
          {isLoading ? "Bokar..." : isBooked ? "Bokad!" : "Boka"}
        </button>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </td>
    </tr>
  );
};

export const WorkoutItem = React.memo(WorkoutItemComponent);
export default WorkoutItem;
