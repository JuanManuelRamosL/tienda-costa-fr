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
            <label htmlFor="email">Email</label>
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
            <label htmlFor="password">Contraseña</label>
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
          <img
            src="https://img.icons8.com/?size=512&id=17949&format=png"
            alt="Google logo"
            className="google-logo"
          />
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}
