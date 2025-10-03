import React, { useState } from "react";
import type { WorkoutResponseModel } from "@/types/workout";
import { toast } from "sonner";

type WorkoutItemProps = {
  workout: WorkoutResponseModel;
  index: number;
  isBooked: boolean;
  onBookingChanged?: () => void;
  onViewDetails?: (workoutId: string) => void;
  onCancel?: () => void;
};

const BOOKINGS_API_BASE =
  "https://bookingservice-api-e0e6hed3dca6egak.swedencentral-01.azurewebsites.net/api/Bookings";

const WorkoutItemComponent: React.FC<WorkoutItemProps> = ({
  workout,
  index,
  isBooked,
  onBookingChanged,
  onViewDetails,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const handleBookWorkout = async () => {
    const userEmail = sessionStorage.getItem("loggedInUserEmail");
    if (!userEmail) {
      setInlineError("Du måste vara inloggad för att kunna boka ett pass.");
      return;
    }
    setIsLoading(true);
    setInlineError(null);
    try {
      const response = await fetch(BOOKINGS_API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: userEmail,
          workoutIdentifier: workout.id,
        }),
      });
      if (!response.ok) {
        throw new Error("Kunde inte boka passet. Försök igen.");
      }
      onBookingChanged?.();
    } catch (err: unknown) {
      if (err instanceof Error) setInlineError(err.message);
      else setInlineError("Ett oväntat fel inträffade.");
    } finally {
      setIsLoading(false);
    }
  };

  const internalCancel = async () => {
    const userEmail = sessionStorage.getItem("loggedInUserEmail");
    if (!userEmail) {
      setInlineError("Kunde inte hitta användarinformation för avbokning.");
      return;
    }
    setIsLoading(true);
    setInlineError(null);
    try {
      const response = await fetch(
        `${BOOKINGS_API_BASE}/${userEmail}/${workout.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        toast.error("Det gick inte att avboka. Försök igen.");
        throw new Error("Kunde inte avboka passet. Försök igen.");
      }

      toast.success("Avbokning lyckades!");
      onBookingChanged?.();
    } catch (err: unknown) {
      if (err instanceof Error) setInlineError(err.message);
      else setInlineError("Ett oväntat fel inträffade.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelWorkout = async () => {
    if (onCancel) {
      onCancel();
      return;
    }

    await internalCancel();
  };

  const baseButtonClasses =
    "px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition-colors whitespace-nowrap";

  const buttonClasses = isBooked
    ? `${baseButtonClasses} bg-red-600 text-white hover:bg-red-700`
    : `${baseButtonClasses} bg-teal-600 text-white hover:bg-teal-700`;

  return (
    <tr
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } hover:bg-indigo-50 transition-colors`}
      onClick={() => onViewDetails && onViewDetails(workout.id)}
      style={{ cursor: onViewDetails ? "pointer" : undefined }}
      data-testid={`workout-row-${workout.id}`}
    >
      <td className="px-6 py-4 text-gray-800">{workout.title}</td>
      <td className="px-6 py-4 text-gray-700">{workout.location}</td>

      {/* Datum + tid i sv-SE */}
      <td className="px-6 py-4 text-gray-700">
        {(() => {
          const d = new Date(workout.startTime);
          const dateLabel = d.toLocaleDateString("sv-SE", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          const timeLabel = d.toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Europe/Stockholm",
          });
          const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

          return (
            <div className="flex items-center justify-between gap-6">
              <span className="text-gray-700">{cap(dateLabel)}</span>
              <span className="font-semibold">{timeLabel}</span>
            </div>
          );
        })()}
      </td>

      <td className="px-6 py-4 text-gray-700">{workout.instructor}</td>

      <td className="px-6 py-4">
        <button
          className={buttonClasses}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (isBooked) {
              handleCancelWorkout();
            } else {
              handleBookWorkout();
            }
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (isBooked) {
                handleCancelWorkout();
              } else {
                handleBookWorkout();
              }
            }
          }}
          disabled={isLoading}
          aria-label={
            isBooked
              ? `Avboka passet ${workout.title}`
              : `Boka passet ${workout.title}`
          }
        >
          {isLoading
            ? isBooked
              ? "Avbokar..."
              : "Bokar..."
            : isBooked
            ? "Avboka"
            : "Boka"}
        </button>

        {inlineError && (
          <p className="text-red-500 text-xs mt-1">{inlineError}</p>
        )}
      </td>
    </tr>
  );
};

export const WorkoutItem = React.memo(WorkoutItemComponent);
