import React from "react";
import { Modal } from "./Modal";
import Spinner from "@/components/Spinner/Spinner";
import { useFetch } from "@/hooks/useFetch";
import type { WorkoutResponseModel } from "@/types/workout";

type WorkoutDetails = WorkoutResponseModel & { description?: string };

type Props = {
   workoutId: string | null;
   isOpen: boolean;
   onClose: () => void;
};

const WorkoutDetailsModal: React.FC<Props> = ({
   workoutId,
   isOpen,
   onClose,
}) => {
   const shouldFetch = isOpen && !!workoutId;

   const endpoint = shouldFetch
      ? `https://workout-api-h8aae7hfcaghgvdb.swedencentral-01.azurewebsites.net/api/workout/${workoutId}`
      : null;

   const { data, loading, error } = useFetch<WorkoutDetails>(endpoint);

   if (!isOpen) return null;

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         heading={data?.title || "Detaljer"}
      >
         {loading ? (
            <div className="modal-laoding">
               <Spinner />
            </div>
         ) : error ? (
            <div className="modal-error">{`Kunde inte ladda: ${error}`}</div>
         ) : data ? (
            <div className="modal-content">
               <p>
                  <strong>Tid:</strong>{" "}
                  {new Date(data.startTime).toLocaleString()}
               </p>
               <p>
                  <strong>Plats:</strong> {data.location}
               </p>
               <p>
                  <strong>Instruktör:</strong> {data.instructor}
               </p>
               {data.description && (
                  <div className="modal-description">
                     <strong>Beskrivning:</strong>
                     <p>{data.description}</p>
                  </div>
               )}

               <div className="modal-actions">
                  <button
                     className="primary-button"
                     onClick={onClose}
                     type="button"
                  >
                     Stäng
                  </button>
               </div>
            </div>
         ) : (
            <div className="modal-empty">Inga detaljer att visa.</div>
         )}
      </Modal>
   );
};

export default WorkoutDetailsModal;
