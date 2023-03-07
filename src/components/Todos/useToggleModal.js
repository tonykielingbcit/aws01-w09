import { useState } from "react";

export default function useToggle() {
  const [showModal, setShowModal] = useState(false);

  const modalToggler = () => {
    setShowModal(showModal => !showModal);
  };

  return { showModal, modalToggler };
}