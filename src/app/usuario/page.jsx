"use client";

import { useEffect } from "react";
import useStore from "../../../store"; // Estado global
import styles from "./UserProfile.module.css"; // Estilos de la página
import { signOut, useSession } from "next-auth/react";

export default function UserProfile() {
  const user = useStore((state) => state.user);
  const purchases = useStore((state) => state.purchases); // Compras del usuario
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

      {/* Lista de Compras */}
      <h2 className={styles.subtitle}>Tus Compras</h2>
      <div className={styles.purchases}>
        {purchases && purchases.length > 0 ? (
          purchases.map((purchase, index) => (
            <div key={index} className={styles.purchaseCard}>
              <img
                src={purchase.image || "/placeholder.png"}
                alt={purchase.name}
                className={styles.purchaseImage}
              />
              <div className={styles.purchaseInfo}>
                <h3>{purchase.name}</h3>
                <p>Precio: ${purchase.price}</p>
                <p>Estado del Envío: {purchase.shippingStatus}</p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.message}>Aún no has realizado compras.</p>
        )}
      </div>
    </div>
  );
}
