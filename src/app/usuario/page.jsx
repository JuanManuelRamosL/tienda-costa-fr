"use client";

import { useEffect, useState } from "react";
import useStore from "../../../store"; // Estado global
import styles from "./UserProfile.module.css"; // Estilos de la página
import { signOut, useSession } from "next-auth/react";

export default function UserProfile() {
  const user = useStore((state) => state.user);
  const purchases = useStore((state) => state.purchases); // Compras del usuario
  const { data: session } = useSession();
  const setUser = useStore((state) => state.setUser);
  const clearUser = useStore((state) => state.clearUser);

  const [userDetails, setUserDetails] = useState(null);
  const [userOrders, setUserOrders] = useState(null);
  
  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else if (user) {
      console.log("Usuario de forma local");
    } else {
      clearUser();
    }
  }, [session, setUser, clearUser, user]);

  useEffect(() => {
    const fetchUserDetails = async (email) => {
      try {
        const response = await fetch(`https://tienda-costa-bakend.vercel.app/api/users/email/${email}`);
        const data = await response.json();
        if (response.ok) {
          setUserDetails(data); // Guarda los detalles del usuario
          fetchUserOrders(data.id); // Hace la solicitud para los pedidos usando el id
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error al obtener los detalles del usuario:", error);
      }
    };

    const fetchUserOrders = async (userId) => {
      try {
        const response = await fetch(`https://tienda-costa-bakend.vercel.app/api/pedidos/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setUserOrders(data); // Guarda los pedidos del usuario
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error al obtener los pedidos del usuario:", error);
      }
    };

    if (user?.email) {
      console.log(user)
      fetchUserDetails(user.email); // Llama a la función para obtener el usuario
    }
  }, [user]);

  if (!user) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Perfil de Usuario</h1>
        <p className={styles.message}>No has iniciado sesión.</p>
      </div>
    );
  }
console.log(userOrders)
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Perfil de Usuario</h1>
      <div className={styles.profileCard}>
        <div className={styles.containerDatosUser}>
          <img
            src={user.image || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"}
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

  

    
      

      {/* Lista de Pedidos */}
      {userOrders && userOrders.length > 0 ? (
        <div className={styles.orders}>
          <h2 className={styles.subtitle}>Tus Pedidos</h2>
          {userOrders.map((order, index) => (
            <div key={index} className={styles.orderCard}>
              <h3>{order.producto}</h3>
{
  order.estado == null ? (
    <p>Estado : Recibido</p>
  ): <p>Estado: {order.estado}</p>
}
              <p>Cantidad: {order.cantidad}</p>
              <p>Direccion de envio: {order.direccion}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.message}>No tienes pedidos aún.</p>
      )}
    </div>
  );
}
