import React from "react";
import { Modal } from "./Modal";
import Spinner from "@/components/Spinner/Spinner";
import { useFetch } from "@/hooks/useFetch";
import type { WorkoutResponseModel } from "@/types/workout";

type WorkoutDetails = WorkoutResponseModel & {
   description?: string | null; // camelCase
   Description?: string | null; // PascalCase (om backend råkar skicka så)
};

// Props för WorkoutDetailsModal
type Props = {
   workoutId: string | null;
   isOpen: boolean;
   onClose: () => void;
};


// Modal för att visa detaljer om ett träningspass
const WorkoutDetailsModal: React.FC<Props> = ({
   workoutId,
   isOpen,
   onClose,
}) => {
   const shouldFetch = isOpen && !!workoutId; // Endast hämta data om modalen är öppen och vi har ett ID

   // Dynamiskt API-endpoint baserat på om vi ska hämta data
   const endpoint = shouldFetch
      ? `https://workout-api-h8aae7hfcaghgvdb.swedencentral-01.azurewebsites.net/api/workout/${workoutId}`
      : null;

   const { data, loading, error } = useFetch<WorkoutDetails>(endpoint);

   // 1) Om camelCase finns och inte är tomt -> använd den
   // 2) Annars kolla PascalCase på ett säkert sätt via unknown-cast
   const pascalMaybe = (data as unknown as { Description?: unknown } | null)
      ?.Description;

   // Bestäm beskrivning att visa: prioritera camelCase, fallback till PascalCase
   const desc =
      typeof data?.description === "string" && data.description.trim() !== ""
         ? data.description
         : typeof pascalMaybe === "string" && pascalMaybe.trim() !== ""
         ? pascalMaybe
         : undefined;

   if (!isOpen) return null;

   // Rendera modalen med olika tillstånd: laddar, fel, data eller tomt
   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         heading={data?.title || "Detaljer"}
      >
         {loading ? (
            <div className="modal-loading">
               <Spinner />
            </div>
         ) : error ? (
            <div className="modal-error">{`Kunde inte ladda: ${error}`}</div>
         ) : data ? (
            <div className="modal-content">
               <p>
               <p>
                  <strong>Instruktör:</strong> {data.instructor}
               </p>
                  <strong>Tid:</strong>{" "}
                  {new Date(data.startTime).toLocaleString()}
               </p>
               <p>
                  <strong>Plats:</strong> {data.location}
               </p>

               {/* Beskrivning: rendera alltid blocket, visa fallback-text om tomt */}
               <div className="modal-description">                                   
                  <p>{desc ?? "Ingen beskrivning tillagd ännu."}</p>
               </div>

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
