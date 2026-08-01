import { Link } from "react-router"

interface Props {
  themeTextMuted?: string,
  isHidden: boolean,
  darkMode: boolean,
  toogleTheme: () => void
}

const HeaderComponent = ( { themeTextMuted, isHidden, darkMode, toogleTheme  }:Props ) => {

  const glassNav = darkMode 
    ? "bg-brand-primary-1/40 border-brand-secundary-1/50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]" 
    : "bg-white/40 border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.05)]";
  
  return (
    <header className={`fixed top-4 left-0 right-0 mx-auto w-[calc(100%-2rem)] max-w-6xl z-50 rounded-2xl border backdrop-blur-xl transition-all duration-500 ${glassNav} ${isHidden ? '-translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'}`}>
    <div className="px-5 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
      
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
        <Link to="/" className={`text-sm font-semibold hover:text-brand-primary-5 transition-colors ${themeTextMuted}`}>Home</Link>
        <Link to="/About" className={`text-sm font-semibold hover:text-brand-primary-5 transition-colors ${themeTextMuted}`}>Acerca de</Link>
        <Link to="/Contact" className={`text-sm font-semibold hover:text-brand-primary-5 transition-colors ${themeTextMuted}`}>Contacto</Link>
        <Link to="/FormInstitutions" className={`text-sm font-semibold hover:text-brand-primary-5 transition-colors ${themeTextMuted}`}>Regístrate</Link>
        <Link to="/Login" className="text-sm font-bold text-brand-primary-5 hover:text-brand-primary-4 transition-colors">Inicia sesión</Link>

        {/* BOTÓN DARK MODE */}
        <button
          type="button"
          onClick={toogleTheme}
          className={`ml-2 flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all ${darkMode ? 'bg-brand-secundary-2/80 border-brand-secundary-3' : 'bg-white/80 border-brand-secundary-7/30'}`}
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
  )
}


export default HeaderComponent
