"use client"
import  useStore  from "../../../store"; // Importa el estado global
import styles from "./UserProfile.module.css"; // Estilos para la página de perfil

export default function UserProfile() {
  const  user  = useStore((state) => state.user); // Obtiene el usuario del estado global

  if (!user) {
    // Si no hay usuario en el estado, muestra un mensaje
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Perfil de Usuario</h1>
        <p className={styles.message}>No has iniciado sesión.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Perfil de Usuario</h1>
      <div className={styles.profileCard}>
        <img
          src={user.image || "/default-avatar.png"} // Imagen de avatar con fallback
          alt="Avatar"
          className={styles.avatar}
        />
        <div className={styles.info}>
          <h2 className={styles.name}>{user.name || "Nombre no especificado"}</h2>
          <p className={styles.email}>{user.email || "Correo no especificado"}</p>
       
        </div>
      </div>
    </div>
  );
}
