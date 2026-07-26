import { useState, useEffect } from "react";
import { Link } from "react-router"; 
import image1 from "../Assets/Padres profes alumnos.jpg";

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toogleTheme = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  // --- VARIABLES BASADAS EN TU index.css ---
  const themeBg = darkMode ? "bg-brand-primary-1" : "bg-brand-primary-6";
  const themeText = darkMode ? "text-white" : "text-brand-primary-1";
  const themeTextMuted = darkMode ? "text-brand-secundary-7" : "text-brand-secundary-6";
  const glassNav = darkMode ? "bg-brand-primary-1/80 border-brand-secundary-1" : "bg-brand-primary-6/90 border-brand-secundary-7";
  const cardBg = darkMode ? "bg-brand-primary-2 border-brand-secundary-1 shadow-black/40" : "bg-white border-brand-secundary-7/30 shadow-brand-secundary-6/10";

  return (
    <div className={`w-full overflow-x-hidden font-sans transition-colors duration-500 ${themeBg} ${themeText}`}>
      
      {/* --- NAVBAR FLOTANTE (GLASSMORPHISM CON TUS COLORES) --- */}
      <header className={`fixed top-0 w-full z-50 backdrop-blur-md border-b ${glassNav} transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary-5 flex items-center justify-center shadow-[0_0_15px_rgba(0,223,130,0.4)]">
              <span className="text-brand-primary-1 font-black text-xl">N</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">NovaSmart</h1>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${themeTextMuted}`}>Automatizando la educación</span>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <Link to="/about" className={`text-sm font-semibold hover:text-brand-primary-5 transition-colors ${themeTextMuted}`}>Acerca de</Link>
            <Link to="/contact" className={`text-sm font-semibold hover:text-brand-primary-5 transition-colors ${themeTextMuted}`}>Contacto</Link>
            <Link to="/register" className={`text-sm font-semibold hover:text-brand-primary-5 transition-colors ${themeTextMuted}`}>Regístrate</Link>
            <Link to="/Login" className="text-sm font-bold text-brand-primary-5 hover:text-brand-primary-4 transition-colors">Inicia sesión</Link>

            {/* BOTÓN DARK MODE */}
            <button
              type="button"
              onClick={toogleTheme}
              className={`ml-2 flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all ${darkMode ? 'bg-brand-secundary-2 border-brand-secundary-3' : 'bg-white border-brand-secundary-7'}`}
            >
              <span className={`text-xs font-bold ${darkMode ? 'text-brand-primary-6' : 'text-brand-primary-2'}`}>
                {darkMode ? "Dark" : "Light"}
              </span>
              <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${darkMode ? 'bg-brand-primary-5' : 'bg-brand-secundary-6'}`}>
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transform transition-transform ${darkMode ? "translate-x-4.5" : "translate-x-1"}`} />
              </div>
            </button>
          </nav>

        </div>
      </header>

      {/* --- HERO SECTION (Usando bg-main-glow de tu CSS) --- */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center pt-24 overflow-hidden bg-main-glow">
        <article className="relative z-10 flex flex-col items-center justify-center px-6 py-12 max-w-4xl text-center">
          
          <span className="px-4 py-1.5 rounded-full bg-brand-primary-5/10 text-brand-primary-5 border border-brand-primary-5/20 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(0,223,130,0.15)]">
            El futuro de la gestión escolar
          </span>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            Automatiza tu institución con <span className="text-brand-primary-5">NovaSmart</span>
          </h2>
          
          <p className={`text-lg md:text-xl mb-10 max-w-2xl leading-relaxed font-medium ${themeTextMuted}`}>
            Gestiona tus procesos educativos de manera eficiente y moderna. Desde la administración de estudiantes hasta la planificación de clases, te ofrecemos todas las herramientas necesarias.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/Home/Register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-primary-5 hover:bg-brand-primary-4 text-brand-primary-1 font-black text-lg shadow-lg shadow-brand-primary-5/20 transition-all transform hover:-translate-y-1 text-center"
            >
              Registra tu institución
            </Link>
            <Link
              to="/Login"
              className={`w-full sm:w-auto px-8 py-4 rounded-xl border-2 font-bold text-lg transition-all transform hover:-translate-y-1 text-center ${darkMode ? 'border-brand-secundary-2 hover:bg-brand-secundary-1 text-brand-primary-6' : 'border-brand-secundary-7 hover:bg-white text-brand-primary-1'}`}
            >
              Inicia sesión
            </Link>
          </div>
        </article>
      </section>

      {/* --- SECCIÓN DE CARACTERÍSTICAS (Diseño en Zig-Zag) --- */}
      <section className="relative w-full py-24 z-10">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Título de la sección */}
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
            
            {/* TARJETA 1 (Imagen Izquierda) */}
            <div className={`flex flex-col md:flex-row items-center gap-8 lg:gap-16 group p-6 md:p-8 rounded-[2.5rem] ${cardBg} transition-colors duration-500 border`}>
              <div className="w-full md:w-1/2 overflow-hidden rounded-3xl relative">
                <div className={`absolute inset-0 z-10 mix-blend-overlay rounded-3xl ${darkMode ? 'bg-brand-primary-3/30' : 'bg-transparent'}`}></div>
                <img
                  className="w-full h-[300px] md:h-[400px] object-cover transform transition-transform duration-700 group-hover:scale-105"
                  src={image1}
                  alt="Estudiantes y profesores"
                />
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

            {/* TARJETA 2 (Imagen Derecha - Zig Zag) */}
            <div className={`flex flex-col md:flex-row-reverse items-center gap-8 lg:gap-16 group p-6 md:p-8 rounded-[2.5rem] ${cardBg} transition-colors duration-500 border`}>
              <div className="w-full md:w-1/2 overflow-hidden rounded-3xl relative">
                <div className={`absolute inset-0 z-10 mix-blend-overlay rounded-3xl ${darkMode ? 'bg-brand-primary-3/30' : 'bg-transparent'}`}></div>
                <img
                  className="w-full h-[300px] md:h-[400px] object-cover transform transition-transform duration-700 group-hover:scale-105"
                  src={image1}
                  alt="Gestión en la nube"
                />
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

      {/* --- FOOTER --- */}
      <footer className={`w-full py-12 mt-12 border-t transition-colors duration-500 ${darkMode ? 'bg-brand-primary-1 border-brand-secundary-1' : 'bg-white border-brand-secundary-7/30'}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-10">
          
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-primary-5 flex items-center justify-center">
                <span className="text-brand-primary-1 font-black text-sm">N</span>
              </div>
              <h3 className="text-2xl font-black">NovaSmart</h3>
            </div>
            <p className={`text-sm leading-relaxed ${themeTextMuted}`}>
              Tecnología educativa para instituciones modernas. Simplifica la gestión académica y mejora la experiencia de estudiantes y docentes.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-10 w-full md:w-auto">
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Enlaces</h4>
              <nav className={`flex flex-col gap-3 text-sm font-medium ${themeTextMuted}`}>
                <Link to="/about" className="hover:text-brand-primary-5 transition">Acerca de</Link>
                <Link to="/contact" className="hover:text-brand-primary-5 transition">Contacto</Link>
                <Link to="/register" className="hover:text-brand-primary-5 transition">Regístrate</Link>
                <Link to="/Login" className="hover:text-brand-primary-5 transition">Inicia sesión</Link>
              </nav>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-sm">Contacto</h4>
              <div className={`flex flex-col gap-3 text-sm font-medium ${themeTextMuted}`}>
                <p>support@novasmart.edu</p>
                <p>+57 55 1234 5678</p>
                <p className="mt-2">Av. Educación 123<br/>Bogotá, Colombia</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`max-w-7xl mx-auto px-6 mt-12 pt-8 border-t text-sm text-center font-medium ${themeTextMuted} ${darkMode ? 'border-brand-secundary-1' : 'border-brand-secundary-7/30'}`}>
          © {new Date().getFullYear()} NovaSmart. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Home;