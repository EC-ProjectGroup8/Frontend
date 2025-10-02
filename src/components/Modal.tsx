import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

// CSS-selector för alla fokusbara element i modalen
const FOCUSABLE_SELECTOR =
   'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Props för Modal-komponenten
type ModalProps = {
   isOpen: boolean;
   onClose: () => void;
   heading?: string;
   ariaLabel?: string;
   children: React.ReactNode;
   className?: string;
   ariaDescribedById?: string;
};

// Modal-komponenten med fokusfångst, ESC-stängning och portal
export function Modal({
   isOpen,
   onClose,
   heading,
   ariaLabel,
   children,
   className,
   ariaDescribedById,
}: ModalProps) {
   const modalRef = useRef<HTMLDivElement>(null);
   const headingRef = useRef<HTMLHeadingElement>(null);
   const modalId = useId();

   // Inaktivera rullning på brödtexten medan modalfönstret är öppet
   useEffect(() => {
      if (!isOpen) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
         document.body.style.overflow = prev;
      };
   }, [isOpen]);

   // Hantera fokus och tangentbordsnavigering när modalen är öppen
   useEffect(() => {
      if (!isOpen) return;      
      const prev = document.activeElement as HTMLElement | null;

      // Funktion för att sätta initialt fokus på modalen
      const setInitialFocus = () => {
         if (headingRef.current) {
            headingRef.current.focus();
         } else {
            modalRef.current?.focus();
         }
      };

      // Funktion för att hantera tangenttryckningar
      const onKey = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            onClose();
            return;
         }
         if (e.key === "Tab") {
            const root = modalRef.current;
            if (!root) return;

            // Hitta alla fokuserbara element i modalen
            const nodeList = root.querySelectorAll(FOCUSABLE_SELECTOR);
            const focusables: HTMLElement[] = Array.from(nodeList).filter(
               (el): el is HTMLElement =>
                  el instanceof HTMLElement && !el.hasAttribute("disabled")
            );
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            // Identifiera det aktiva elementet
            const active = (document.activeElement as HTMLElement) || null;

            if (e.shiftKey) {
               // Om du tabbar bakåt från det första elementet, fokusera det sista
               if (
                  active === first ||
                  !active ||
                  !focusables.includes(active)
               ) {
                  last.focus();
                  e.preventDefault();
               }
            } else {
               // Om du tabbar framåt från det sista elementet, fokusera det första
               if (active === last || !active || !focusables.includes(active)) {
                  first.focus();
                  e.preventDefault();
               }
            }
         }
      };

      // Lägg till event listener för tangenttryckningar
      window.addEventListener("keydown", onKey);

      // Använd requestAnimationFrame för att säkerställa att fokus sätts efter renderingen
      const raf = requestAnimationFrame(setInitialFocus);

      // Rensa upp event listener och återställ fokus när modalen stängs
      return () => {
         window.removeEventListener("keydown", onKey);
         cancelAnimationFrame(raf);
         prev?.focus();
      };
   }, [isOpen, onClose]);

   // Om modalen inte är öppen, rendera ingenting
   if (!isOpen) return null;

   // Om vi inte är i en browser-miljö (t.ex. SSR), rendera ingenting
   if (typeof document === "undefined") return null;

   // Hitta portal-roten i DOM:en
   const portalRoot = document.getElementById("portal-root");

   
   // Modalens innehåll med overlay och fokusfångst
   const content = (
      <div
         className="modal-overlay"
         onMouseDown={(e) => e.target === e.currentTarget && onClose()}
         role="presentation"
      >
         <div
            ref={modalRef}
            className={`modal ${className || ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={heading ? modalId : undefined}
            aria-label={!heading ? ariaLabel : undefined}
            aria-describedby={ariaDescribedById}
            tabIndex={-1}
         >
            <button
               className="modal-close"
               onClick={onClose}
               type="button"
               aria-label="Close"
            >
               {/* SVG för stängningsikonen */}
               <svg
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  aria-hidden="true"
               >                  
                  <path
                     d="M18 6L6 18M6 6l12 12"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                  />
               </svg>
            </button>
            <header className="modal-header">
               {heading && (
                  <h2 id={modalId} className="modal-title" tabIndex={-1}>
                     {heading}
                  </h2>
               )}
            </header>
            <div className="modal-body">{children}</div>
         </div>
      </div>
   );

   // Rendera modalen i portalen om den finns, annars direkt
   return portalRoot ? createPortal(content, portalRoot) : content;
}