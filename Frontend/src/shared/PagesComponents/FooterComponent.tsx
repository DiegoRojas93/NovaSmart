import { Link } from "react-router"

interface Props {
  themeTextMuted?: string,
  darkMode: boolean
}

const FooterComponent = ( { themeTextMuted, darkMode  }:Props ) => {
  return (
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
              <Link to="/FormInstitutions" className="hover:text-brand-primary-5 transition">Regístrate</Link>
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
  )
}

export default FooterComponent
