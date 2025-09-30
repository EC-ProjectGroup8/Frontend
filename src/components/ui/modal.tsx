import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";


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
   const modalId = useId(); // Add unique id for modal heading. Used in aria-labelledby


   // Lock background scrolling when modal is open
   useEffect(() => {
      if (!isOpen) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
         document.body.style.overflow = prev;
      };
   }, [isOpen]);


   // Handle ESC and making sure focus stay in modal
   useEffect(() => {
      if (!isOpen) return;

      const root = modalRef.current;

      // By ChatGPT
      // Collect focusable elements inside the modal (buttons, links, inputs etc.)
      // NodeList → real Array<HTMLElement> so TS knows about .focus()
      const nodeList = root?.querySelectorAll(
         'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const focusables: HTMLElement[] = nodeList
         ? Array.from(nodeList).filter(
               (el): el is HTMLElement =>
                  el instanceof HTMLElement && !el.hasAttribute("disabled")
            )
         : [];


      // Press ESC to close modal
      const onKey = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            onClose();
            return;
         }

         // Trap focus (Tab/Shift+Tab) inside the modal
         if (e.key === "Tab" && focusables.length > 0) {
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = (document.activeElement as HTMLElement) || null;

            if (e.shiftKey) {
               // Shift+tab on the first focusable element -> move focus to the last inside modal
               if (active === first || !active || !focusables.includes(active)) {
                  last.focus();
                  e.preventDefault();
               }
            } else {
               // Tab while on the last focusable element -> move focus back to the first inside modal
               if (active === last || !active || !focusables.includes(active)) {
                  first.focus();
                  e.preventDefault();
               }
            }
         }
      };

      // Listen for keyboard events while modal is open
      window.addEventListener("keydown", onKey);

      // Set the initial focus inside the modal, fallback to modal container
      (focusables[0] ?? modalRef.current)?.focus();

      return () => {
         window.removeEventListener("keydown", onKey);
      };
   }, [isOpen, onClose]);


   // Don't render anything if modal is closed
   if (!isOpen) return null;

   // SSR guard: avoid touching `document` on the server
   if (typeof document === "undefined") return null;
   
   const portalRoot = document.getElementById("portal-root");


   const content = (
      <div
         className="modal-overlay"
         onClick={(e) => e.target === e.currentTarget && onClose()}
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

   // Render modal into #portal-root so it always appears above everything else
   return portalRoot ? createPortal(content, portalRoot) : content;
}