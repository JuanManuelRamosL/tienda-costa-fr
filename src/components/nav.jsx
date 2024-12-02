"use client";

import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import useStore from "../../store";
import "./Nav.css";

export default function Nav() {
  const { data: session } = useSession();
  const setUser = useStore((state) => state.setUser);
  const user = useStore((state) => state.user);
  const clearUser = useStore((state) => state.clearUser);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      createUserOnBackend(session.user); // Llama a la función para enviar los datos al backend
    } else {
      clearUser();
    }
  }, [session, setUser, clearUser]);

  const createUserOnBackend = async (user) => {
    try {
      const response = await axios.post(
        "https://tienda-costa-bakend.vercel.app/api/users",
        {
          name: user.name,
          email: user.email,
          password: "defaultPassword", // Puedes definir un valor por defecto o generarlo automáticamente
          photo: user.image,
        }
      );
      console.log("Usuario creado exitosamente:", response.data);
    } catch (error) {
      console.error(
        "Error al crear el usuario:",
        error.response?.data || error.message
      );
    }
  };

  const signOutStore = () => {
    setUser(null);
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-links">
          <Link href="/" className="links">
            <svg
              width="33px"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21V13.6C9 13.0399 9 12.7599 9.109 12.546C9.20487 12.3578 9.35785 12.2049 9.54601 12.109C9.75993 12 10.04 12 10.6 12H13.4C13.9601 12 14.2401 12 14.454 12.109C14.6422 12.2049 14.7951 12.3578 14.891 12.546C15 12.7599 15 13.0399 15 13.6V21M2 9.5L11.04 2.72C11.3843 2.46181 11.5564 2.33271 11.7454 2.28294C11.9123 2.23902 12.0877 2.23902 12.2546 2.28295C12.4436 2.33271 12.6157 2.46181 12.96 2.72L22 9.5M4 8V17.8C4 18.9201 4 19.4802 4.21799 19.908C4.40974 20.2843 4.7157 20.5903 5.09202 20.782C5.51985 21 6.0799 21 7.2 21H16.8C17.9201 21 18.4802 21 18.908 20.782C19.2843 20.5903 19.5903 20.2843 19.782 19.908C20 19.4802 20 18.9201 20 17.8V8L13.92 3.44C13.2315 2.92361 12.8872 2.66542 12.5091 2.56589C12.1754 2.47804 11.8246 2.47804 11.4909 2.56589C11.1128 2.66542 10.7685 2.92361 10.08 3.44L4 8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Inicio
          </Link>
        </div>
        <Link href="/carrito">
          <svg
            width="35px"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="svg"
          >
            <path
              d="M5.00014 14H18.1359C19.1487 14 19.6551 14 20.0582 13.8112C20.4134 13.6448 20.7118 13.3777 20.9163 13.0432C21.1485 12.6633 21.2044 12.16 21.3163 11.1534L21.9013 5.88835C21.9355 5.58088 21.9525 5.42715 21.9031 5.30816C21.8597 5.20366 21.7821 5.11697 21.683 5.06228C21.5702 5 21.4155 5 21.1062 5H4.50014M2 2H3.24844C3.51306 2 3.64537 2 3.74889 2.05032C3.84002 2.09463 3.91554 2.16557 3.96544 2.25376C4.02212 2.35394 4.03037 2.48599 4.04688 2.7501L4.95312 17.2499C4.96963 17.514 4.97788 17.6461 5.03456 17.7462C5.08446 17.8344 5.15998 17.9054 5.25111 17.9497C5.35463 18 5.48694 18 5.75156 18H19M7.5 21.5H7.51M16.5 21.5H16.51M8 21.5C8 21.7761 7.77614 22 7.5 22C7.22386 22 7 21.7761 7 21.5C7 21.2239 7.22386 21 7.5 21C7.77614 21 8 21.2239 8 21.5ZM17 21.5C17 21.7761 16.7761 22 16.5 22C16.2239 22 16 21.7761 16 21.5C16 21.2239 16.2239 21 16.5 21C16.7761 21 17 21.2239 17 21.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <div className="user-section">
          {session?.user ? (
            <div className="user-info">
              <Link href="/usuario">
                <img
                  src={session.user.image}
                  alt="User Image"
                  className="user-avatar"
                />
              </Link>
              <button onClick={() => signOut()} className="logout-btn">
                Cerrar Sesión
              </button>
            </div>
          ) : user ? (
            <div className="user-info">
              <Link href="/usuario">
                <img
                  src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
                  alt="User Image"
                  className="user-avatar"
                />
              </Link>
              <button onClick={() => signOutStore()} className="logout-btn">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <button onClick={() => signIn()} className="login-btn">
              Iniciar Sesión
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

// {/* User Section in Mobile Menu */}
//     {session?.user ? (
//       <div className="mobile-user-section">
//         <Link href="/usuario">
//           <img
//             src={session.user.image}
//             alt="User Image"
//             className="user-avatar"
//           />
//         </Link>
//         <button onClick={() => signOut()} className="logout-btn">
//           Logout
//         </button>
//       </div>
//     ) : (
//       <button onClick={() => signIn()} className="login-btn">
//         Login
//       </button>
//     )}
//   </div>
// )}
