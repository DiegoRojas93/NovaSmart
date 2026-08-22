import { useState, useEffect } from "react";
import { Link } from "react-router"; 
import Folder from '../components/Folder'; 
import Aurora from '../components/Aurora';
import HeaderComponent from "../shared/PagesComponents/HeaderComponent";
import FooterComponent from "@/shared/PagesComponents/FooterComponent";

import image1 from "../Assets/Padres profes alumnos.jpg";
import image2 from "../Assets/Gestión academica.jpg";
import image3 from "../Assets/Niña.jpg";
import image5 from "../Assets/Colegio 1.jpg";
import image4 from "../Assets/Colegio 2.jpg";
import image6 from "../Assets/Gestión academica.jpg";

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);
  
  // --- ESTADOS PARA EL SCROLL DEL HEADER ---
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toogleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Efecto para el Dark Mode
  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  // Efecto para detectar la dirección del Scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Si bajamos el scroll más de 80px, ocultamos el header
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsHidden(true);
      } else {
        // Si subimos, lo volvemos a mostrar
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // --- VARIABLES BASADAS EN TU index.css ---
  const themeBg = darkMode ? "bg-brand-primary-1" : "bg-brand-primary-6";
  const themeText = darkMode ? "text-white" : "text-brand-primary-1";
  const themeTextMuted = darkMode ? "text-brand-secundary-7" : "text-brand-secundary-6";
    
  const cardBg = darkMode ? "bg-brand-primary-2 border-brand-secundary-1 shadow-black/40" : "bg-white border-brand-secundary-7/30 shadow-brand-secundary-6/10";

  return (
    <div className={`w-full overflow-x-hidden font-sans transition-colors duration-500 ${themeBg} ${themeText}`}>
      
      {/* --- NAVBAR FLOTANTE (PILL GLASSMORPHISM) --- */}
      <HeaderComponent themeTextMuted={ themeTextMuted } isHidden={ isHidden } darkMode={ darkMode } toogleTheme={toogleTheme} />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center pt-32 overflow-hidden">
        
        {/* EFECTO AURORA DE FONDO */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen transition-opacity duration-500">
          <Aurora
            colorStops={["#00df82","#00df82","#00df82"]} 
            blend={1}
            amplitude={1.0}
            speed={1}
          />
        </div>
        
        <div className={`absolute inset-0 z-0 pointer-events-none ${darkMode ? 'bg-brand-primary-1/60' : 'bg-white/40'}`}></div>

        <article className="relative z-10 flex flex-col items-center justify-center px-6 py-12 max-w-4xl text-center">
          <span className="px-4 py-1.5 rounded-full bg-brand-primary-5/10 text-brand-primary-5 border border-brand-primary-5/20 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(0,223,130,0.15)] backdrop-blur-sm">
            El futuro de la gestión escolar
          </span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            Automatiza tu institución con <span className="text-brand-primary-5">NovaSmart</span>
          </h2>
          <p className={`text-lg md:text-xl mb-10 max-w-2xl leading-relaxed font-medium ${darkMode ? 'text-brand-secundary-7' : 'text-brand-secundary-1'}`}>
            Gestiona tus procesos educativos de manera eficiente y moderna. Desde la administración de estudiantes hasta la planificación de clases, te ofrecemos todas las herramientas necesarias.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/Register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-primary-5 hover:bg-brand-primary-4 text-brand-primary-1 font-black text-lg shadow-lg shadow-brand-primary-5/20 transition-all transform hover:-translate-y-1 text-center"
            >
              Registra tu institución
            </Link>
            <Link
              to="/Login"
              className={`w-full sm:w-auto px-8 py-4 rounded-xl border-2 font-bold text-lg transition-all transform hover:-translate-y-1 text-center backdrop-blur-md ${darkMode ? 'border-brand-secundary-2 hover:bg-brand-secundary-1/80 text-brand-primary-6' : 'border-brand-secundary-7 hover:bg-white/80 text-brand-primary-1'}`}
            >
              Inicia sesión
            </Link>
          </div>
        </article>
      </section>

      {/* --- SECCIÓN DE CARACTERÍSTICAS (Diseño en Zig-Zag) --- */}
      <section className="relative w-full py-24 z-10">
        <div className="max-w-7xl mx-auto px-6">
          
          <article className="flex flex-col items-center text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Una plataforma, <span className="text-brand-primary-5">Todos los colegios</span>
            </h2>
            <div className={`flex flex-col gap-2 ${themeTextMuted} text-lg md:text-xl font-medium max-w-2xl`}>
              <p>Sistemas conectados entre sí para gestionar tu colegio de manera eficiente.</p>
              <p>Notas, asistencias, trabajos y archivos en un solo lugar.</p>
            </div>
          </article>

          <div className="flex flex-col gap-16 md:gap-24">
            
            {/* --- TARJETA 1 (Multi-Rol) --- */}
            <div className={`flex flex-col md:flex-row items-center gap-8 lg:gap-16 group p-6 md:p-8 rounded-[2.5rem] ${cardBg} transition-colors duration-500 border`}>
              
              {/* Contenedor del Folder 1 */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[400px] rounded-3xl relative flex items-center justify-center bg-brand-primary-5/5 border border-brand-primary-5/20 transition-colors duration-500">
                <div className={`absolute inset-0 z-10 mix-blend-overlay rounded-3xl ${darkMode ? 'bg-brand-primary-3/10' : 'bg-transparent'}`}></div>
                

                <div className="relative z-20">
                  <Folder 
                    size={2.5}
                    items={[ 
                      <img 
                        key="img1"
                        src={image1} 
                        alt="Estudiantes y profesores" 
                        className="w-full h-full object-cover rounded-[10px]" 
                      />,
                      <img 
                        key="img1"
                        src={image2} 
                        alt="Estudiantes y profesores" 
                        className="w-full h-full object-cover rounded-[10px]" 
                      />,
                      <img 
                        key="img1"
                        src={image3} 
                        alt="Estudiantes y profesores" 
                        className="w-full h-full object-cover rounded-[10px]" 
                      />
                    ]}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <span className="text-brand-primary-5 font-bold tracking-widest uppercase text-sm mb-2">Multi-Rol</span>
                <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  Optimizado para todos los Roles Educativos
                </h3>
                <p className={`text-lg mb-6 leading-relaxed ${themeTextMuted}`}>
                  Nuestra plataforma ofrece una experiencia intuitiva y eficiente para cada usuario: administradores, docentes, estudiantes y acudientes. Todos pueden aprovechar al máximo las herramientas disponibles.
                </p>
                <ul className={`flex flex-col gap-3 font-semibold ${themeText}`}>
                  <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-brand-primary-5 shadow-[0_0_8px_rgba(0,223,130,0.6)]"></span> Portales independientes y seguros.</li>
                  <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-brand-primary-5 shadow-[0_0_8px_rgba(0,223,130,0.6)]"></span> Monitoreo en tiempo real.</li>
                </ul>
              </div>
            </div>

            {/* --- TARJETA 2 (Escalabilidad) --- */}
            <div className={`flex flex-col md:flex-row-reverse items-center gap-8 lg:gap-16 group p-6 md:p-8 rounded-[2.5rem] ${cardBg} transition-colors duration-500 border`}>
              
              {/* Contenedor del Folder 2 */}
              <div className="w-full md:w-1/2 h-[300px] md:h-[400px] rounded-3xl relative flex items-center justify-center bg-brand-secundary-5/5 border border-brand-secundary-5/20 transition-colors duration-500">
                <div className={`absolute inset-0 z-10 mix-blend-overlay rounded-3xl ${darkMode ? 'bg-brand-secundary-3/10' : 'bg-transparent'}`}></div>
                

                <div className="relative z-20">
                  <Folder 
                    size={2.5}
                    items={[ 
                      <img 
                        key="img1"
                        src={image4} 
                        alt="Estudiantes y profesores" 
                        className="w-full h-full object-cover rounded-[10px]" 
                      />,
                      <img 
                        key="img1"
                        src={image5} 
                        alt="Estudiantes y profesores" 
                        className="w-full h-full object-cover rounded-[10px]" 
                      />,
                      <img 
                        key="img1"
                        src={image6} 
                        alt="Estudiantes y profesores" 
                        className="w-full h-full object-cover rounded-[10px]" 
                      />
                    ]}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <span className="text-brand-primary-5 font-bold tracking-widest uppercase text-sm mb-2">Escalabilidad</span>
                <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  Gestión Académica sin límites
                </h3>
                <p className={`text-lg mb-6 leading-relaxed ${themeTextMuted}`}>
                  Olvídate del papel y las hojas de cálculo. Maneja periodos académicos, inasistencias, notas de trabajos y consolidados finales con un par de clics, todo respaldado en la nube de forma segura.
                </p>
                <Link to="/about" className="inline-flex w-max items-center gap-2 text-brand-primary-5 font-bold hover:text-brand-primary-4 transition-colors">
                  Conocer más características &rarr;
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <FooterComponent themeTextMuted={ themeTextMuted } darkMode={ darkMode } />
    </div>
  );
};

export default Home;