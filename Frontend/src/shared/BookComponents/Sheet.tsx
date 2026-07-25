import { useState } from "react";
import FormInscription from "../../Roles/Admin/FormInscription"; // El formulario
import Dashboard from "../../Roles/Admin/Dashboard";
import InConstruction from "../../Roles/Admin/InConstruction";

interface SliderProps {
  sections: string[];
}

const Sheet = ({ sections }: SliderProps) => {

  const [activeTab, setActiveTab] = useState(0);

  // Mapeo dinámico: decide qué componente cargar según el nombre de la sección
  const renderSectionContent = (sectionName: string) => {
    switch (sectionName) {

      // Admin

      case "Formulario de inscripción":
        return <FormInscription />; 
      case "Dasboard":
        return <Dashboard />;
      case "Formulario de actualización":
        return <InConstruction />;
      default:
        return <div className="p-4 text-blue-900/70 font-medium">Aún no hay contenido asignado para esta sección.</div>;
    }
  };

  if (!sections || sections.length === 0) {
    return <div className="text-blue-900/70 italic text-center mt-10">Esta vista no tiene secciones configuradas.</div>;
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden text-blue-950">
      
      {/* 1. TABS (PESTAÑAS) */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex flex-wrap gap-2 border-b-2 border-blue-900/30 pb-2">
          {sections.map((sectionName, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`text-base md:text-lg font-bold px-4 py-2 rounded-t-lg transition-all ${
                activeTab === index
                  ? "bg-blue-900 text-white shadow-[2px_-2px_0_rgba(30,58,138,0.3)]"
                  : "text-blue-900/60 hover:bg-blue-900/10 hover:text-blue-900"
              }`}
            >
              {sectionName}
            </button>
          ))}
        </div>
      </div>

      {/* 2. PISTA DEL SLIDER */}
      <div className="w-full flex-1 relative overflow-hidden">
        <div
          className="h-full flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ 
            width: `${sections.length * 100}%`, 
            transform: `translateX(-${(activeTab / sections.length) * 100}%)` 
          }}
        >
          
          {/* 3. VISTAS INTERNAS DINÁMICAS */}
          {sections.map((sectionName, index) => (
            <div 
              key={index} 
              style={{ width: `${100 / sections.length}%` }} 
              className="h-full flex-shrink-0 overflow-y-auto no-scrollbar pr-4 pb-10"
            >
              {renderSectionContent(sectionName)}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Sheet;