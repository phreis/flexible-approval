'use client';
// Modal as a separate component
import { useEffect, useRef } from 'react';

type Props = {
  openModal: boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

export default function Modal({ openModal, closeModal, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={ref} onCancel={closeModal}>
      {children}
      <button onClick={closeModal}>Close</button>
    </dialog>
  );
}
