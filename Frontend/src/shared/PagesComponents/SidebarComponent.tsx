import { LogOut, Construction } from 'lucide-react';

// 1. DEFINIMOS Y EXPORTAMOS LAS INTERFACES AQUÍ
export interface PageData {
  Sections: string[];
}

export interface SidebarPage {
  id: number;
  pages?: Record<string, PageData>;
  page?: Record<string, PageData>;
}

interface Props {
  institutionName?: string;
  logoUrl?: string
  isSidebarOpen: boolean;
  onHandleLogout: ( route?: string ) => void;
  pages: SidebarPage[];
  currentView: string; 
  onSelectView: (view: string) => void;
}

const SidebarComponent = ({ institutionName, logoUrl, isSidebarOpen, onHandleLogout, pages, currentView, onSelectView }: Props) => {
  return (
    <aside 
      className={` ${isSidebarOpen ? "w-64" : "w-0"} h-full bg-brand-primary-2 z-30 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out`}
    >
      <div className="w-64 p-4 h-full flex flex-col justify-around overflow-y-auto text-white">
        <div>
          <div className="w-20 h-20 mx-auto -mt-12 mb-4 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden border-4 border-amber-400">
            <img 
              src={logoUrl} 
              alt="Logo de la Institución" 
              className="w-full h-full object-contain p-2" 
            />
          </div>
          <h1 className="text-2xl font-extrabold mb-4 text-center">{institutionName}</h1>
          <h2 className="text-xl font-bold mb-4 text-center">Menú</h2>
        </div>
        
        <ul>
          {
            pages.map((item) => {
              // Extraemos el objeto correcto (pages o page por si hay typos en el JSON)
              const pageObj = item.pages || item.page;
              if (!pageObj) return null;

              // Obtenemos el nombre real de la vista (Ej: "Inscripciónes")
              const viewName = Object.keys(pageObj)[0];

              return (
                <li 
                  key={item.id}
                  onClick={() => onSelectView(viewName)}
                  className={`mb-2 p-2 rounded cursor-pointer text-center ${currentView === viewName ? "bg-brand-primary-4 font-bold" : "hover:bg-brand-primary-4/50"}`}
                >
                  {viewName}
                </li>
              );
            })
          }
        </ul>

        <div className="w-full flex justify-evenly items-center">
          <button onClick={ () => onHandleLogout("/InConstruction") }>
            <Construction className='hover:text-amber-400 active:text-status-danger'/>
          </button>
          <LogOut onClick={ () => onHandleLogout() } className='hover:text-amber-400 active:text-status-danger cursor-pointer'/>
        </div>
      </div>
    </aside>
  )
}

export default SidebarComponent;