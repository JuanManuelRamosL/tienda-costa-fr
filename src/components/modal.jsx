import React from "react";

const StockModal = ({ show, onClose }) => {
  if (!show) return null; // No renderizar el modal si no debe mostrarse

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
    >
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
    </div>
  );
};

export default StockModal;
