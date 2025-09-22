import React from "react";
import { formatDateTime } from "@/lib/utils/formatDateTimeUtil";
import type { WorkoutResponseModel } from "@/types/workout";

type WorkoutItemProps = {
  workout: WorkoutResponseModel;
  index: number;
  onBook: (workoutId: string) => void;
};

const WorkoutItemComponent: React.FC<WorkoutItemProps> = ({ workout, index, onBook }) => {
  return (
    <tr
      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50 transition-colors`}
      data-testid={`workout-row-${workout.id}`}
    >
      <td className="px-6 py-4 text-gray-800">{workout.title}</td>
      <td className="px-6 py-4 text-gray-700">{workout.location}</td>
      <td className="px-6 py-4 text-gray-700">{formatDateTime(workout.startTime)}</td>
      <td className="px-6 py-4 text-gray-700">{workout.instructor}</td>
      <td className="px-6 py-4">
        <button
          className="bg-gradient-to-r from-indigo-500 to-purple-600 
                     text-white font-semibold px-4 py-2 rounded-xl 
                     shadow-md hover:shadow-lg hover:scale-105 active:scale-95 
                     transition-all duration-200 cursor-pointer"
          onClick={() => onBook(workout.id)}
          aria-label={`Book workout ${workout.title}`}
        >
          Book
        </button>
      </td>
    </tr>
  );
};

export const WorkoutItem = React.memo(WorkoutItemComponent);
export default WorkoutItem;
