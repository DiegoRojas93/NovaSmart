import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";

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
      navigate(`/users/${data.userId}`, { replace: true });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error al intentar iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-brand-primary-6 px-4 py-10 relative overflow-hidden">
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary-5/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-brand-secundary-4/10 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md border border-brand-secundary-7/30 relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Cabecera del formulario */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary-5 flex items-center justify-center shadow-[0_0_15px_rgba(0,223,130,0.4)] mb-4">
            <span className="text-brand-primary-1 font-black text-3xl">N</span>
          </div>
          <h1 className="text-3xl font-black text-brand-primary-2 text-center tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-brand-secundary-6 text-sm mt-1 font-medium text-center">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        {error && (
          <div className="bg-status-danger/10 border border-status-danger/30 text-status-danger px-4 py-3 rounded-xl relative mb-6 text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="font-bold text-sm text-brand-primary-2 uppercase tracking-wide">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Ej: DRojas"
              className="w-full bg-brand-primary-6/50 border-2 border-brand-secundary-7/30 rounded-xl px-4 py-3 text-brand-primary-1 font-medium focus:outline-none focus:border-brand-primary-5 focus:bg-white transition-colors"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="font-bold text-sm text-brand-primary-2 uppercase tracking-wide">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="w-full bg-brand-primary-6/50 border-2 border-brand-secundary-7/30 rounded-xl px-4 py-3 text-brand-primary-1 font-medium focus:outline-none focus:border-brand-primary-5 focus:bg-white transition-colors"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full text-brand-primary-1 font-black py-4 px-4 rounded-xl transition-all transform flex justify-center items-center gap-2 text-lg ${
              loading 
                ? "bg-brand-secundary-7 cursor-not-allowed opacity-70" 
                : "bg-brand-primary-5 hover:bg-brand-primary-4 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,223,130,0.2)]"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-brand-primary-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </>
            ) : (
              "Entrar a NovaSmart"
            )}
          </button>
        </form>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-secundary-7/20 text-sm font-semibold">
          <Link to="/" className="text-brand-secundary-6 hover:text-brand-primary-4 transition-colors">
            &larr; Volver al Home
          </Link>
          <Link to="/" className="text-brand-primary-3 hover:text-brand-primary-4 transition-colors">
            ¿Olvidaste tu clave?
          </Link>
        </div>

      </div>
    </section>
  );
};