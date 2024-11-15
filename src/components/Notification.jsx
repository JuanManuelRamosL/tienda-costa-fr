import { useEffect } from "react";
import styles from "./notification.module.css";

export default function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Oculta la notificación después de 3 segundos
    return () => clearTimeout(timer); // Limpia el temporizador
  }, [onClose]);

  return (
    <div className={styles.notification}>
      <p>{message}</p>
    </div>
  );
}
