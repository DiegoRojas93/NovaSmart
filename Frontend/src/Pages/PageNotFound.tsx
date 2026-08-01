import { Link } from "react-router"; // Agregamos react-router-dom para el botón de regreso

const PageNotFound = () => (
  <div className="min-h-screen w-full flex flex-col justify-center items-center bg-brand-primary-1 relative overflow-hidden px-6">
    
    {/* Fondo brillante central usando la variable de index.css */}
    <div className="absolute inset-0 bg-main-glow opacity-80 pointer-events-none"></div>

    <div className="text-center relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
      
      {/* Texto 404 gigante con degradado */}
      <h1 className="text-[150px] sm:text-[200px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-brand-primary-5 to-brand-primary-3 drop-shadow-[0_0_40px_rgba(0,223,130,0.3)]">
        404
      </h1>
      
      <div className="bg-brand-primary-2/80 backdrop-blur-md border border-brand-secundary-1 rounded-3xl p-8 sm:p-12 mt-[-20px] shadow-2xl flex flex-col items-center max-w-lg">
        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Página no encontrada
        </h3>
        
        <p className="text-brand-secundary-7 text-lg font-medium mb-8 text-center">
          Lo sentimos, la ruta a la que intentas acceder no existe, ha sido movida o no tienes permisos para verla.
        </p>

        <Link 
          to="/" 
          className="bg-brand-primary-5 hover:bg-brand-primary-4 text-brand-primary-1 font-black text-lg px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(0,223,130,0.3)] transition-all transform hover:-translate-y-1 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver al Inicio
        </Link>
      </div>
      
    </div>
  </div>
);

export default PageNotFound;