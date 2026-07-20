import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useNavigate } from "react-router";

export const Login = () => {
  // 1. Estados para los campos del formulario y el manejo de UI
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // 2. Manejador de cambios en los inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Manejador del envío del formulario
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        // Si el backend lanza excepción (ej. credenciales inválidas), entra aquí
        throw new Error("Usuario o contraseña incorrectos");
      }

      const data = await response.json();
      
      // 4. ¡EL PASO MÁS IMPORTANTE! Guardar el token en el navegador
      localStorage.setItem("token", data.token);

      console.log("Login exitoso, token guardado.");

      // 5. Redirigir al usuario a su panel principal (ajusta la ruta según tu app)
      navigate("/institution/1", { replace: true });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error al intentar iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border-t-4 border-amber-400">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-1 font-medium text-gray-700">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Ingresa tu usuario"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full text-white font-bold py-2 px-4 rounded transition-colors ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>

        </form>
      </div>
    </section>
  );
};