import type { ReactNode } from "react";

interface Props {
  title: string;
  children?: ReactNode; 
}

const Sheets = ( { title, children }: Props ) => {
  return (
    <div className="animate-page-turn relative w-full h-full">
      
      {/* Hojas inferiores y pestañas (Bookmark) */}
      <div className="absolute top-1 -right-1 w-full h-full bg-brand-primary-6/70 rounded-2xl shadow-sm"></div>
      <div className="absolute top-2 -right-2 w-full h-full bg-brand-primary-6/40 rounded-2xl shadow-sm"></div>

      <div className="absolute top-12 -right-6 w-8 h-12 bg-status-warning rounded-r-lg shadow-sm border border-black/5"></div>
      <div className="absolute top-28 -right-6 w-8 h-12 bg-status-info rounded-r-lg shadow-sm border border-black/5"></div>
      <div className="absolute top-44 -right-6 w-8 h-12 bg-status-danger rounded-r-lg shadow-sm border border-black/5"></div>

      {/* Hoja principal interactiva */}
      <div className="relative bg-brand-primary-6 w-full h-full rounded-2xl shadow-md overflow-hidden flex flex-col border border-white/50">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #cbd5e1 31px, #cbd5e1 32px)', backgroundPositionY: '32px' }}></div>
        <div className="absolute top-0 bottom-0 left-8 md:left-10 w-0.5 bg-red-400/50 pointer-events-none"></div>

        {/* Contenido (El título y el Slider) */}
        <div className="p-8 pl-16 md:pl-20 relative z-10 w-full h-full overflow-hidden flex flex-col">
          <h1 className="text-4xl font-black tracking-tighter text-blue-950 underline decoration-4 decoration-blue-900/40 underline-offset-8 mb-6 shrink-0">
            { title }
          </h1>
          
          <div className="flex-1 w-full overflow-hidden">
            { children }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sheets;