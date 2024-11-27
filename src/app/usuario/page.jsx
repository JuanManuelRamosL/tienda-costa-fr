"use client";

import { useEffect } from "react";
import useStore from "../../../store"; // Importa el estado global
import styles from "./UserProfile.module.css"; // Estilos para la página de perfil
import { signOut, useSession } from "next-auth/react";

export default function UserProfile() {
  const user = useStore((state) => state.user);
  const { data: session } = useSession();
  const setUser = useStore((state) => state.setUser);
  const clearUser = useStore((state) => state.clearUser);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      clearUser();
    }
  }, [session, setUser, clearUser]);

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
        <div className={styles.containerDatosUser}>
          <img
            src={user.image || "/default-avatar.png"}
            alt="Avatar"
            className={styles.avatar}
          />
          <div className={styles.info}>
            <h2 className={styles.name}>
              {user.name || "Nombre no especificado"}
            </h2>
            <p className={styles.email}>
              {user.email || "Correo no especificado"}
            </p>
          </div>
        </div>
        <div className={styles.containerButtonCerrarSesion}>
          <button
            className={styles.buttonCerrarSesion}
            onClick={() => signOut()}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
