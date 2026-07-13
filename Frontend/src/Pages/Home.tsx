import { useState, useEffect } from "react";
import { Link } from "react-router";

import image1 from "../Assets/Padres profes alumnos.jpg";

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toogleTheme = () => {
    setDarkMode(!darkMode);
  }

  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  return (
    <>
      <section className="bg-main-glow text-brand-secundary-7 h-screen w-screen flex flex-col">
        <header className="w-full max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-heading-text text-3xl font-bold">NovaSmart</h1>
            <span className="text-base-text text-sm">Automatizando la educación</span>
          </div>

          <nav className="flex flex-wrap items-center gap-3">
            <Link to="/about" className="text-base-text px-4 py-2 rounded-md hover:bg-white/10 transition">Acerca de nosotros</Link>
            <Link to="/contact" className="text-base-text px-4 py-2 rounded-md hover:bg-white/10 transition">Contactanos</Link>
            <Link to="/register" className="text-base-text px-4 py-2 rounded-md hover:bg-white/10 transition">Registerate</Link>
            <Link to="/login" className="text-base-text px-4 py-2 rounded-md hover:bg-white/10 transition">Inicia sesión</Link>

            <button
              type="button"
              onClick={toogleTheme}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <span className="text-base-text">{darkMode ?  "Dark Mode" : "Light Mode"}</span>
              <span className="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full bg-brand-primary-5">
                <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform  ${darkMode ? "translate-x-5" : "translate-x-2"}`} />
              </span>
            </button>
          </nav>
        </header>

        <article className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <h2 className="text-heading-text text-4xl font-semibold mb-4">Automatiza tu institución educativa con NovaSmart</h2>
            <p className="text-base-text text-lg mb-6">
              Gestiona tus procesos educativos de manera eficiente y moderna con nuestra plataforma inteligente. Desde la administración de estudiantes hasta la planificación de clases, NovaSmart te ofrece todas las herramientas que necesitas para optimizar tu institución educativa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="text-base-text px-6 py-3 rounded-md hover:bg-brand-primary-600 transition">
                  Inicia sesión
              </Link>
              <Link
                to="/Home/Register"
                className="text-base-text bg-status-danger px-6 py-3 rounded-md border border-border-strong transition">
                  Registra tu instittución
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className={`${ darkMode ? "bg-brand-primary-1" : "bg-brand-secundary-7" } text-brand-secundary-7 min-h-screen w-screen flex flex-col justify-evenly items-center`}>
        <article className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-status-warning text-4xl">Una plataforma</h1>
          <h2 className="text-status-warning text-3xl">Todos los colegios</h2>
          <div className="flex flex-col gap-1">
            <p className="text-muted-text text-xl">Sistmeas conectados entre si</p>
            <p className="text-muted-text text-xl">Gestiona tu colegio de manera eficiente</p>
            <span className="text-muted-text text-lg">Notas, asistencias, trabajos y archivos</span>
          </div>
        </article>
        <article className="flex flex-col gap-16">

          <div className="flex w-screen ml-32">
            <div className={`${ darkMode ? "bg-brand-primary-6" : "bg-brand-secundary-2" } mx-left max-w-md overflow-hidden rounded-xl shadow-md md:max-w-2xl`}>
              <div className="md:flex">
                <div className="md:shrink-0">
                  <img
                    className="h-48 w-full object-cover md:h-full md:w-48"
                    src={ image1 }
                    alt="Modern building architecture"
                  />
                </div>
                <div className="p-8">
                  <div className={`${ darkMode ? "text-brand-primary-2": "text-brand-primary-6" } text-sm font-semibold tracking-wide uppercase`}>Optimizado para todos los Roles</div>
                  <p className={`${ darkMode ? "text-brand-primary-3": "text-brand-secundary-7" } mt-1 block text-lg leading-tight font-medium hover:underline`}>
                    Desde administradores hasta docentes y estudiantes y acudientes
                  </p>
                  <p className={`${ darkMode ? "text-brand-secundary-6": "brand-secundary-7" } mt-2 `}>
                    Optimizado para todos los roles de la institución educativa, desde administradores hasta docentes y estudiantes y acudientes. Nuestra plataforma ofrece una experiencia intuitiva y eficiente para cada usuario, asegurando que todos puedan aprovechar al máximo las herramientas disponibles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-screen ml-32">
            <div className={`${ darkMode ? "bg-brand-primary-6" : "bg-brand-secundary-2" } mx-left max-w-md overflow-hidden rounded-xl shadow-md md:max-w-2xl`}>
              <div className="md:flex">
                <div className="md:shrink-0">
                  <img
                    className="h-48 w-full object-cover md:h-full md:w-48"
                    src={ image1 }
                    alt="Modern building architecture"
                  />
                </div>
                <div className="p-8">
                  <div className={`${ darkMode ? "text-brand-primary-2": "text-brand-primary-6" } text-sm font-semibold tracking-wide uppercase`}>Optimizado para todos los Roles</div>
                  <p className={`${ darkMode ? "text-brand-primary-3": "text-brand-secundary-7" } mt-1 block text-lg leading-tight font-medium hover:underline`}>
                    Desde administradores hasta docentes y estudiantes y acudientes
                  </p>
                  <p className={`${ darkMode ? "text-brand-secundary-6": "brand-secundary-7" } mt-2 `}>
                    Optimizado para todos los roles de la institución educativa, desde administradores hasta docentes y estudiantes y acudientes. Nuestra plataforma ofrece una experiencia intuitiva y eficiente para cada usuario, asegurando que todos puedan aprovechar al máximo las herramientas disponibles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        

        </article>
      </section>

      <footer className="w-full bg-brand-secundary-1 text-brand-secundary-7 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h3 className="text-brand-secundary-7 text-xl font-bold">NovaSmart</h3>
            <p className="text-brand-secundary-7 max-w-md mt-2">
              Tecnología educativa para instituciones modernas. Simplifica la gestión académica y mejora la experiencia de estudiantes y docentes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full md:w-auto">
            <div>
              <h4 className="text-brand-secundary-6 font-semibold mb-2">Enlaces</h4>
              <nav className="flex flex-col gap-2 text-sm">
                <Link to="/about" className="text-brand-secundary-7 hover:text-base-text transition">Acerca de</Link>
                <Link to="/contact" className="text-brand-secundary-7 hover:text-base-text transition">Contacto</Link>
                <Link to="/register" className="text-brand-secundary-7 hover:text-base-text transition">Regístrate</Link>
                <Link to="/login" className="text-brand-secundary-7 hover:text-base-text transition">Inicia sesión</Link>
              </nav>
            </div>
            <div>
              <h4 className="text-brand-secundary-6 font-semibold mb-2">Contacto</h4>
              <p className="text-sm text-brand-secundary-7">support@novasmart.edu</p>
              <p className="text-sm text-brand-secundary-7">+57 55 1234 5678</p>
              <p className="text-sm mt-2 text-brand-secundary-7">Av. Educación 123, Ciudad de Bogotá</p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 border-t border-white/10 pt-4 text-sm text-base-text text-center">
          © {new Date().getFullYear()} NovaSmart. Todos los derechos reservados.
        </div>
      </footer>
    </>
  );
};

export default Home;
