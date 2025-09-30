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
   const modalId = useId();



   // Disable scrolling on the body while the modal is open
   useEffect(() => {
      if (!isOpen) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
         document.body.style.overflow = prev;
      };
   }, [isOpen]);



   // Handle focus management and keyboard interactions when the modal opens
   useEffect(() => {
      if (!isOpen) return;
      // Store the element focused before the modal opened to restore it on close
      const prev = document.activeElement as HTMLElement | null;

      // Set focus to the first focusable element in the modal
      const setInitialFocus = () => {
         const root = modalRef.current;
         if (!root) return;
         
         const nodeList = root.querySelectorAll(FOCUSABLE_SELECTOR); 
         const focusables: HTMLElement[] = Array.from(nodeList).filter(
            (el): el is HTMLElement =>
               el instanceof HTMLElement && !el.hasAttribute("disabled")
         );
         (focusables[0] ?? root)?.focus();
      };

      
      // Listen for key presses: close on Escape, trap focus with Tab
      const onKey = (e: KeyboardEvent) => {
         if (e.key === "Escape") { 
            onClose();
            return;
         }
         if (e.key === "Tab") {
            const root = modalRef.current;
            if (!root) return;
            
            // Get all focusable elements within the modal
            const nodeList = root.querySelectorAll(FOCUSABLE_SELECTOR);
            const focusables: HTMLElement[] = Array.from(nodeList).filter(
               (el): el is HTMLElement =>
                  el instanceof HTMLElement && !el.hasAttribute("disabled")
            );
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            // Determine the currently focused element
            const active = (document.activeElement as HTMLElement) || null;
            
            if (e.shiftKey) {               
               // If shifting back from the first element, focus the last
               if (
                  active === first ||
                  !active || 
                  !focusables.includes(active)
               ) {
                  last.focus();
                  e.preventDefault();
               }
            } else {
               // If tabbing forward from the last element, focus the first
               if (active === last || !active || !focusables.includes(active)) {
                  first.focus();
                  e.preventDefault();
               }
            }
         }
      };

      // Add the keydown event listener to the window
      window.addEventListener("keydown", onKey);

      // Delay initial focus until after rendering
      const raf = requestAnimationFrame(setInitialFocus);

      // Cleanup: remove event listener, cancel animation frame, restore previous focus
      return () => {
         window.removeEventListener("keydown", onKey);
         cancelAnimationFrame(raf);
         prev?.focus();
      };
   }, [isOpen, onClose]);


   // Return null if the modal is not open
   if (!isOpen) return null;

   
   // Skip rendering on the server-side
   if (typeof document === "undefined") return null;


   // Locate the portal root element in the DOM
   const portalRoot = document.getElementById("portal-root");


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
            <header className="modal-header">
               {heading && (
                  <h2 id={modalId} className="modal-title">
                     {heading}
                  </h2>
               )}
               <button
                  className="modal-close"
                  onClick={onClose}
                  type="button"
                  aria-label="Close"
               >
                  &times;
               </button>
            </header>
            <div className="modal-body">{children}</div>
         </div>
      </div>
   );

   // Use a portal if the root exists; otherwise, render inline
   return portalRoot ? createPortal(content, portalRoot) : content;
}
