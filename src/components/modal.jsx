import Link from "next/link";
import React from "react";
import useStore from "../../store";
import styles from "./modal.module.css"

const StockModal = ({ show, onClose }) => {
  const user = useStore((state) => state.user);
  if (!show) return null; // No renderizar el modal si no debe mostrarse

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
    >
      {
        user ? (
        <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <h2 className="text-xl font-bold mb-4 text-red-600">
          ¡Stock insuficiente!
        </h2>
        <p className="text-gray-700 mb-6">
          Lo sentimos, no hay suficiente stock para completar esta compra.
        </p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Cerrar
        </button>
      </div>
        ):(
          <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <h2 className={styles.modalTitle}>
              ¡Debes iniciar sesión para continuar!
            </h2>
            <p className={styles.modalMessage}>
              Por favor, inicia sesión para completar esta compra.
            </p>
            <div className={styles.modalButtons}>
              <Link href="/auth/login" className={styles.modalLogin}>
                Iniciar Sesión
              </Link>
              <button onClick={onClose} className={styles.modalClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
        
        )}
      
    </div>
  );
};

export default StockModal;
