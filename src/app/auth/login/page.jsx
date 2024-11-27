"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./loguin.css";
import useUserStore from "../../../../store"; // Cambia esta ruta a la ubicación de tu store

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { data: session, status } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      // Guarda los datos de sesión en el estado global cuando la sesión esté autenticada
      setUser(session.user);
      router.push("/");
    }
  }, [status, session, setUser, router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("ruta de deploy register pendiente", {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        setUser(response.data); // Guarda los datos del usuario en el estado global
        router.push("/"); // Redirige al dashboard u otra página
      } else {
        console.error("Error en el registro");
      }
    } catch (error) {
      console.error("Error en la solicitud de registro:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      setUser({ username, email }); // Guarda los datos en el estado global
      router.push("/dashboard"); // Redirige a otra página
    } else {
      console.log("Error en el login");
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="login-container">
      <h1 className="login-title">
        {isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
      </h1>
      <div className="login-box">
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="username">Nombre de Usuario</label>
              <input
                id="username"
                type="text"
                value={username}
                placeholder="Ingresa tu nombre de usuario"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">
              Email{" "}
              <svg
                width="25px"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="Ingresa tu Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              Contraseña
              <svg
                width="25px"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 10V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V10M12 14.5V16.5M8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C17.7202 10 16.8802 10 15.2 10H8.8C7.11984 10 6.27976 10 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Ingresa tu contraseña"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            {isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
          </button>
        </form>

        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="toggle-register"
        >
          {isRegistering
            ? "¿Ya tienes una cuenta? Inicia sesión aquí."
            : "¿No tienes una cuenta? Regístrate aquí."}
        </button>

        <button onClick={handleGoogleLogin} className="google-login-button">
          <svg
            width="35"
            height="35"
            viewBox="0 0 256 262"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
          >
            <path
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              fill="#4285F4"
            />
            <path
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              fill="#34A853"
            />
            <path
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
              fill="#FBBC05"
            />
            <path
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              fill="#EB4335"
            />
          </svg>
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}
