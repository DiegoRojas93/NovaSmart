import Aurora from "@/components/Aurora";
import FooterComponent from "@/shared/PagesComponents/FooterComponent";
import { useState, useEffect } from "react";
import { Link } from "react-router"; 

export const About = () => {
  const [darkMode, setDarkMode] = useState(true);

  // Efectos del Tema
  const toogleTheme = () => setDarkMode(!darkMode);
  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  // Variables de estilo
  const themeBg = darkMode ? "bg-brand-primary-1" : "bg-brand-primary-6";
  const themeText = darkMode ? "text-white" : "text-brand-primary-1";
  const themeTextMuted = darkMode ? "text-brand-secundary-7" : "text-brand-secundary-6";
  const glassNav = darkMode 
    ? "bg-brand-primary-1/40 border-brand-secundary-1/50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]" 
    : "bg-white/40 border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.05)]";
  const cardBg = darkMode ? "bg-brand-primary-2/80 border-brand-secundary-1 shadow-black/40" : "bg-white/80 border-brand-secundary-7/30 shadow-brand-secundary-6/10";

  // Estados del Scroll para ocultar el Header
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

  return (
    <div className={`w-full min-h-screen overflow-x-hidden font-sans transition-colors duration-500 ${themeBg} ${themeText}`}>
      
      
      {/* SECCIÓN PRINCIPAL: ACERCA DE */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-main-glow">

        <div className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen transition-opacity duration-500">
          <Aurora
            colorStops={["#00df82","#00df82","#00df82"]} 
            blend={1}
            amplitude={1.0}
            speed={1}
          />
        </div>

        <div className={`absolute inset-0 z-0 pointer-events-none ${darkMode ? 'bg-brand-primary-1/60' : 'bg-white/60'}`}></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center">
          
          <span className="px-4 py-1.5 rounded-full bg-brand-primary-5/10 text-brand-primary-5 border border-brand-primary-5/20 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            Nuestra Historia
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-center">
            Transformando la educación <br/> a través de la <span className="text-brand-primary-5">Tecnología</span>
          </h2>
          <p className={`text-lg max-w-3xl text-center mb-16 leading-relaxed ${themeTextMuted}`}>
            En NovaSmart, creemos que los profesores deben dedicar su tiempo a enseñar, no a llenar papeleo. Nacimos con el propósito de conectar a rectores, docentes, estudiantes y acudientes en un ecosistema digital simple, rápido y seguro.
          </p>

          {/* CUADRÍCULA DE VALORES / MISIÓN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            
            {/* Misión */}
            <div className={`p-8 rounded-3xl border backdrop-blur-md transition-transform hover:-translate-y-2 ${cardBg}`}>
              <div className="w-12 h-12 rounded-xl bg-brand-primary-5/20 flex items-center justify-center mb-6 border border-brand-primary-5/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand-primary-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-2xl font-black mb-4">Nuestra Misión</h3>
              <p className={`text-base leading-relaxed ${themeTextMuted}`}>
                Automatizar y centralizar la gestión escolar de las instituciones educativas, proveyendo herramientas tecnológicas de primer nivel que reduzcan la carga administrativa y mejoren la comunicación.
              </p>
            </div>

            {/* Visión */}
            <div className={`p-8 rounded-3xl border backdrop-blur-md transition-transform hover:-translate-y-2 ${cardBg}`}>
              <div className="w-12 h-12 rounded-xl bg-brand-primary-5/20 flex items-center justify-center mb-6 border border-brand-primary-5/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand-primary-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h3 className="text-2xl font-black mb-4">Nuestra Visión</h3>
              <p className={`text-base leading-relaxed ${themeTextMuted}`}>
                Ser la plataforma LMS (Sistema de Gestión del Aprendizaje) líder en Hispanoamérica, reconocida por su escalabilidad, seguridad, y por crear ecosistemas educativos 100% interconectados.
              </p>
            </div>

            {/* Seguridad */}
            <div className={`p-8 rounded-3xl border backdrop-blur-md transition-transform hover:-translate-y-2 ${cardBg}`}>
              <div className="w-12 h-12 rounded-xl bg-brand-primary-5/20 flex items-center justify-center mb-6 border border-brand-primary-5/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand-primary-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-2xl font-black mb-4">Compromiso Total</h3>
              <p className={`text-base leading-relaxed ${themeTextMuted}`}>
                La información de tu colegio es crítica. Diseñamos NovaSmart con estándares de seguridad avanzados, garantizando que notas, asistencias y datos personales estén protegidos 24/7.
              </p>
            </div>

          </div>
        </div>
      </section>

      <FooterComponent themeTextMuted={ themeTextMuted } darkMode={ darkMode } />
    </div>
  );
};