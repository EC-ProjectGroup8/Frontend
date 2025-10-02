import { useState } from "react";
import { Modal } from "../components/Modal";

export default function ModalTest() {
   const pageTitle = "Modal Test Page";
   const [open, setOpen] = useState(false);

   const descId = "modal-desc";

   return (
      <div>
         <h1>Modal Test Page</h1>
         <h1>{pageTitle}</h1>
         <button onClick={() => setOpen(true)}>Open Modal</button>

         <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
            heading="Test Modal"
            ariaDescribedById={descId}
         >
            <p id={descId}>
               This is a test modal body. Press ESC or click outside to close.
            </p>
            <div>
               <button onClick={() => setOpen(false)}>Close</button>
            </div>
         </Modal>
      </div>
   );
}
