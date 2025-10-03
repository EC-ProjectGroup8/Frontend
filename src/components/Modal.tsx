import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR =
   'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

type ModalProps = {
   isOpen: boolean;
   onClose: () => void;
   heading?: string;
   ariaLabel?: string;
   children: React.ReactNode;
   className?: string;
   ariaDescribedById?: string;
};

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
   const previousFocusRef = useRef<HTMLElement | null>(null); // För att spara tidigare fokus
   const modalId = useId(); // Unikt ID för modaltiteln
   const headingId = `modal-${modalId}-heading`;

   // Hantera body scroll lock
   useEffect(() => {
      if (!isOpen) return;

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
         document.body.style.overflow = previousOverflow;
      };
   }, [isOpen]);

   // Hantera fokus och tangentbordsnavigering
   useEffect(() => {
      if (!isOpen) return;

      // Spara det tidigare fokuserade elementet
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Sätt fokus på modalen efter rendering
      const timeoutId = setTimeout(() => {
         modalRef.current?.focus();
      }, 0);

      const handleKeyDown = (e: KeyboardEvent) => {
         // Stäng modalen vid Escape
         if (e.key === "Escape") {
            onClose();
            return;
         }

         // Tab-tangenten hanterar fokus-looping
         if (e.key === "Tab") {
            const modal = modalRef.current;
            if (!modal) return;

            const focusableElements = Array.from(
               modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
            ).filter((el) => !el.hasAttribute("disabled"));

            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            const activeElement = document.activeElement as HTMLElement;

            if (e.shiftKey) {
               // Shift+Tab: från första till sista
               if (activeElement === firstElement) {
                  lastElement.focus();
                  e.preventDefault();
               }
            } else {
               // Tab: från sista till första
               if (activeElement === lastElement) {
                  firstElement.focus();
                  e.preventDefault();
               }
            }               
         }
      };
      
      document.addEventListener("keydown", handleKeyDown);

      window.addEventListener("keydown", handleKeyDown);

      return () => {
         clearTimeout(timeoutId);
         document.removeEventListener("keydown", handleKeyDown);
         previousFocusRef.current?.focus(); // Återställ fokus till tidigare element
      };
   }, [isOpen, onClose]);

   if (!isOpen) return null;
   if (typeof document === "undefined") return null;

   // Stäng modalen om användaren klickar på overlayen
   const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
         onClose();
      }
   };
      
   const content = (
      <div
         className="modal-overlay"
         onClick={handleOverlayClick}
         role="presentation"
      >
         <div
            ref={modalRef}
            className={`modal ${className || ""}`.trim()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={heading ? headingId : undefined}
            aria-label={heading ? undefined : ariaLabel}
            aria-describedby={ariaDescribedById}
            tabIndex={-1}
         >
            <button
               className="modal-close"
               onClick={onClose}
               type="button"
               aria-label="Stäng dialogruta"
            >
               {/* SVG för stängningsikonen */}
               <svg
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  aria-hidden="true"
                  focusable="false"
               >                  
                  <path
                     d="M18 6L6 18M6 6l12 12"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                  />
               </svg>
            </button>

            {heading && (
               <header className="modal-header">
                  <h2 id={headingId} className="modal-title">
                     {heading}
                  </h2>
            </header>
            )}
            
            <div className="modal-body">{children}</div>
         </div>
      </div>
   );

   const portalRoot = document.getElementById("portal-root");
   return portalRoot ? createPortal(content, portalRoot) : content;
}