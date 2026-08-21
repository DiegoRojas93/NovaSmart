import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router"; // o "react-router-dom" dependiendo de tu versión

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Ocurrió un error al procesar la solicitud");
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "No se pudo conectar con el servidor.");
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
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary-5 flex items-center justify-center shadow-[0_0_15px_rgba(0,223,130,0.4)] mb-4">
            <span className="text-brand-primary-1 font-black text-3xl">?</span>
          </div>
          <h1 className="text-3xl font-black text-brand-primary-2 text-center tracking-tight">
            Recuperar Cuenta
          </h1>
          <p className="text-brand-secundary-6 text-sm mt-2 font-medium text-center">
            Ingresa tu correo y te enviaremos tu usuario y un enlace para cambiar tu contraseña.
          </p>
        </div>

        {error && (
          <div className="bg-status-danger/10 border border-status-danger/30 text-status-danger px-4 py-3 rounded-xl mb-6 text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {success ? (
          <div className="flex flex-col items-center animate-in zoom-in">
            <div className="bg-green-100 text-green-700 p-4 rounded-xl border border-green-200 text-center font-medium mb-6">
              ¡Correo enviado! Revisa tu bandeja de entrada o la carpeta de spam para continuar.
            </div>
            <Link to="/" className="w-full text-center text-brand-primary-1 font-black py-4 px-4 rounded-xl bg-brand-primary-5 hover:bg-brand-primary-4 transition-all">
              Volver al inicio
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-bold text-sm text-brand-primary-2 uppercase tracking-wide">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@correo.com"
                className="w-full bg-brand-primary-6/50 border-2 border-brand-secundary-7/30 rounded-xl px-4 py-3 text-brand-primary-1 font-medium focus:outline-none focus:border-brand-primary-5 focus:bg-white transition-colors"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 w-full text-brand-primary-1 font-black py-4 px-4 rounded-xl transition-all transform flex justify-center items-center gap-2 text-lg ${
                loading ? "bg-brand-secundary-7 cursor-not-allowed opacity-70" : "bg-brand-primary-5 hover:bg-brand-primary-4 hover:-translate-y-1"
              }`}
            >
              {loading ? "Enviando..." : "Enviar Correo"}
            </button>
          </form>
        )}

        <div className="flex items-center justify-center mt-8 pt-6 border-t border-brand-secundary-7/20 text-sm font-semibold">
          <Link to="/" className="text-brand-secundary-6 hover:text-brand-primary-4 transition-colors">
            &larr; Volver al Login
          </Link>
        </div>
      </div>
    </section>
  );
};