import { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router";

import HeaderComponent from "../shared/PagesComponents/HeaderComponent";
import Aurora from "@/components/Aurora";
import FooterComponent from "@/shared/PagesComponents/FooterComponent";

export const Contact = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efectos del Tema
  const toogleTheme = () => setDarkMode(!darkMode);
  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  // Variables de estilo
  const themeBg = darkMode ? "bg-brand-primary-1" : "bg-brand-primary-6";
  const themeText = darkMode ? "text-white" : "text-brand-primary-1";
  const themeTextMuted = darkMode ? "text-brand-secundary-7" : "text-brand-secundary-6";

  const cardBg = darkMode ? "bg-brand-primary-2 border-brand-secundary-1" : "bg-white border-brand-secundary-7/30";
  const inputBg = darkMode ? "bg-brand-primary-1/50 border-brand-secundary-1 text-white" : "bg-brand-primary-6/50 border-brand-secundary-7/30 text-brand-primary-1";

  // Estados del Scroll
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) setIsHidden(true);
      else setIsHidden(false);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Manejador del Formulario
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simular envío a la API
    setTimeout(() => {
      alert("¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.");
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className={`w-full min-h-screen overflow-x-hidden font-sans transition-colors duration-500 ${themeBg} ${themeText}`}>
      

      <HeaderComponent themeTextMuted={ themeTextMuted } isHidden={ isHidden } darkMode={ darkMode } toogleTheme={toogleTheme} />

      {/* SECCIÓN PRINCIPAL: CONTACTO */}
      <section className="relative min-h-screen w-full flex items-center justify-center pt-32 pb-20 px-6">

        <div className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen transition-opacity duration-500">
          <Aurora
            colorStops={["#00df82","#00df82","#00df82"]} 
            blend={1}
            amplitude={1.0}
            speed={1}
          />
        </div>
        
        {/* Luces de fondo sutiles */}
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-brand-primary-5/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10">
          
          {/* Columna Izquierda: Info */}
          <div className="flex flex-col justify-center">
            <span className="w-max px-4 py-1.5 rounded-full bg-brand-primary-5/10 text-brand-primary-5 border border-brand-primary-5/20 text-xs font-bold tracking-widest uppercase mb-4">
              ¿Tienes dudas?
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Hablemos sobre tu <br/><span className="text-brand-primary-5">Institución</span>
            </h2>
            <p className={`text-lg mb-10 ${themeTextMuted}`}>
              Estamos aquí para ayudarte. Ya sea que quieras implementar NovaSmart en tu colegio, o necesites soporte técnico con tu cuenta, nuestro equipo te responderá rápidamente.
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary-5/20 flex items-center justify-center text-brand-primary-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className={`text-sm font-bold uppercase tracking-widest ${themeTextMuted}`}>Soporte y Ventas</p>
                  <p className="text-xl font-bold">contacto@novasmart.edu</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary-5/20 flex items-center justify-center text-brand-primary-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className={`text-sm font-bold uppercase tracking-widest ${themeTextMuted}`}>Llámanos</p>
                  <p className="text-xl font-bold">+57 (601) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario de Contacto */}
          <div className={`p-8 md:p-10 rounded-[2.5rem] border shadow-2xl ${cardBg}`}>
            <h3 className="text-2xl font-black mb-6">Envíanos un mensaje</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-sm uppercase tracking-wide opacity-80">Tu Nombre</label>
                  <input type="text" required placeholder="Ej: Juan Pérez" className={`w-full border-2 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-brand-primary-5 transition-colors ${inputBg}`} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-sm uppercase tracking-wide opacity-80">Correo Electrónico</label>
                  <input type="email" required placeholder="correo@ejemplo.com" className={`w-full border-2 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-brand-primary-5 transition-colors ${inputBg}`} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-sm uppercase tracking-wide opacity-80">¿Cómo podemos ayudarte?</label>
                <select required className={`w-full border-2 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-brand-primary-5 transition-colors ${inputBg}`}>
                  <option value="" disabled selected>Selecciona una opción...</option>
                  <option value="ventas">Quiero implementar NovaSmart en mi colegio</option>
                  <option value="soporte">Necesito soporte técnico (Estudiante/Acudiente)</option>
                  <option value="docente">Soy docente y tengo una consulta</option>
                  <option value="otro">Otro motivo</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-sm uppercase tracking-wide opacity-80">Tu Mensaje</label>
                <textarea required rows={4} placeholder="Escribe tu mensaje aquí..." className={`w-full border-2 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-brand-primary-5 transition-colors resize-none ${inputBg}`}></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-2 w-full font-black py-4 px-4 rounded-xl transition-all transform flex justify-center items-center gap-2 text-lg text-brand-primary-1 ${
                  isSubmitting 
                    ? "bg-brand-secundary-6 cursor-not-allowed opacity-70" 
                    : "bg-brand-primary-5 hover:bg-brand-primary-4 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,223,130,0.2)]"
                }`}
              >
                {isSubmitting ? "Enviando mensaje..." : "Enviar Mensaje"}
              </button>
            </form>
          </div>

        </div>
      </section>

      <FooterComponent themeTextMuted={ themeTextMuted } darkMode={ darkMode } />
    </div>
  );
};