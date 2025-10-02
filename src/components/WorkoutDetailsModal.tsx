import React from "react";
import { Modal } from "./Modal";
import Spinner from "@/components/Spinner/Spinner";
import { useFetch } from "@/hooks/useFetch";
import type { WorkoutResponseModel } from "@/types/workout";

type WorkoutDetails = WorkoutResponseModel & {
   description?: string | null;
   Description?: string | null;
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

      // Logga endpoint för felsökning
      if (shouldFetch) {
         console.debug("WorkoutDetailsModal endpoint:", endpoint);
         }

   const { data, loading, error } = useFetch<WorkoutDetails>(endpoint);

   const description = data?.description || data?.Description || "Ingen beskrivning tillagd ännu.";

   // Hjälpfunktion för att formatera datum och tid på svenska
   const formatTimeDate = (dateString: string) => {
      const date = new Date(dateString);

      const weekday = date.toLocaleDateString("sv-SE", {
         weekday: "long",
         timeZone: "Europe/Stockholm",
      });

      const dayMonth = date.toLocaleDateString("sv-SE", {
         day: "numeric",
         month: "long",
         timeZone: "Europe/Stockholm",
      });

      const time = date.toLocaleTimeString("sv-SE", {
         hour: "2-digit",
         minute: "2-digit",
         hour12: false,
         timeZone: "Europe/Stockholm",
      });

      const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

      // Returnerar både full datumsträng och tid samt en11 aria-label
      return {
         fullDate: `${capitalize(weekday)}, ${dayMonth}`,
         time,
         ariaLabel: `${capitalize(weekday)}, ${dayMonth} klockan ${time}`,
      };
   };
   
   const dateTime = data ? formatTimeDate(data.startTime) : null;

   if (!isOpen) return null;

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         heading={data?.title || "Detaljer"}
      >
         {loading ? (
            <div className="modal-loading" role="status" aria-live="polite">
               <Spinner />
               <span className="sr-only">Laddar träningsinfomration...</span>
            </div>
         ) : error ? (
            <div className="modal-error" role="alert">
               Kunde inte ladda: {error}
            </div>
         ) : data && dateTime ? (
            <div className="modal-content">            
               <div className="modal-row">
                  <i className="fa-solid fa-chalkboard-user icon" aria-hidden="true" />      
                  <span>
                     <span className="sr-only">Instruktör:</span>                  
                     {data.instructor}
                  </span>
               </div>

               <div className="modal-row" aria-label={dateTime.ariaLabel}>
                  <i className="fa-solid fa-clock icon" aria-hidden="true" />
                  <span aria-hidden="true">
                     {dateTime.fullDate}
                     <span className="dot">•</span>
                     <strong>{dateTime.time}</strong>
                  </span>                  
               </div>

               <div className="modal-row">
                  <i className="fa-solid fa-location-dot icon" aria-hidden="true" />
                  <span>
                     <span className="sr-only">Plats:</span>
                     {data.location}
                  </span>
               </div>

               <div className="modal-description">
                  <h3 className="sr-only">Beskrivning</h3>
                  <p>{description}</p>
                  {/* <p>{desc ?? "Ingen beskrivning tillagd ännu."}</p> */}
               </div>

               <div className="modal-actions">
                  <button
                     className="primary-button"
                     onClick={onClose}
                     type="button"
                     aria-label="Stäng detaljer om träningspass"
                  >
                     Stäng
                  </button>
               </div>
            </div>
         ) : (
            <div className="modal-empty" role="status">
               Inga detaljer att visa.
            </div>
         )}
      </Modal>
   );
};

export default WorkoutDetailsModal;
