import { useState, useEffect, type ChangeEvent, type SubmitEvent } from "react";
import { Save, CalendarRange, Plus, Edit2, CalendarDays, X, CheckCircle2 } from "lucide-react";
import { ModalComponent } from "@/shared/Basics/ModalComponent";

// --- INTERFACES BASADAS EN EL BACKEND ---
export interface AcademicPeriod {
  id?: number;
  name: string;
  year: number | "";
  startDate: string; 
  endDate: string;
}

const defaultFormData: AcademicPeriod = {
  name: "",
  year: new Date().getFullYear(),
  startDate: "",
  endDate: ""
};

const AcademicPeriodManager = () => {
  // --- ESTADOS ---
  const [periods, setPeriods] = useState<AcademicPeriod[]>([]), 
    [isFormOpen, setIsFormOpen] = useState(false),
    [editingData, setEditingData] = useState<AcademicPeriod | null>(null),
    [formData, setFormData] = useState<AcademicPeriod>(defaultFormData),
    [isSaving, setIsSaving] = useState(false);

  // --- ESTADOS PARA EL MODAL ---
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
    errorCode: null as number | null
  });

  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- FUNCIÓN PARA CARGAR LOS PERIODOS ---
  const fetchPeriods = async () => {
    try {
      const response = await fetch(`${apiUrl}/academic-periods`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPeriods(data);
      }
    } catch (error) {
      console.error("Error al cargar los periodos académicos:", error);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  // --- MANEJADORES DE VISTA ---
  const handleOpenCreate = () => {
    setEditingData(null);
    setFormData(defaultFormData);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (period: AcademicPeriod) => {
    setEditingData(period);
    setFormData(period);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingData(null);
  };

  // --- MANEJADORES DE FORMULARIO ---
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "year" ? parseInt(value) || "" : value 
    }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const method = editingData ? 'PUT' : 'POST';
      
      // ¡CORRECCIÓN AQUÍ! Usamos editingData.id para editar el periodo correcto
      const url = editingData 
        ? `${apiUrl}/academic-periods/${editingData.id}` 
        : `${apiUrl}/academic-periods`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData) 
      });

      if (!response.ok) {
        const error = new Error("Error al procesar el periodo académico");
        (error as any).status = response.status; 
        throw error;
      }

      await fetchPeriods();
      handleCloseForm();

      setModalConfig({
        isOpen: true,
        type: "success",
        title: "¡Éxito!",
        message: editingData ? "Periodo académico actualizado correctamente." : "Periodo académico creado correctamente.",
        errorCode: null
      });

    } catch (error: any) {
      console.error(error);
      
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Algo salió mal",
        message: "El periodo académico no pudo ser procesado. Por favor, inténtelo de nuevo.",
        errorCode: error.status || null
      });
    } finally {
      setIsSaving(false);
    }
  };

  // --- CLASES ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all placeholder:text-blue-900/40";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      <div className="mb-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-blue-950 mb-2">Periodos Académicos</h2>
          <p className="text-blue-900/70 font-medium">
            Gestione los ciclos lectivos, semestres o años escolares de la institución.
          </p>
        </div>
        
        {!isFormOpen && (
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-blue-900 text-white font-bold hover:bg-blue-800 px-5 py-2.5 rounded-xl transition-all shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
          >
            <Plus className="w-5 h-5" /> Nuevo Periodo
          </button>
        )}
      </div>

      {!isFormOpen && (
        <div className={bentoCardClass}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-blue-900/50">
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Nombre del Periodo</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Año</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Fecha de Inicio</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Fecha de Fin</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-center">Estado</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {periods.map((p) => {
                  const today = new Date();
                  const start = new Date(p.startDate);
                  const end = new Date(p.endDate);
                  const isActive = today >= start && today <= end;

                  return (
                    <tr key={p.id} className="border-b border-blue-900/10 hover:bg-blue-900/5 transition-colors">
                      <td className="py-4 px-2 font-bold flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-blue-900/60" /> {p.name}
                      </td>
                      <td className="py-4 px-2 font-medium text-blue-900/80">{p.year}</td>
                      <td className="py-4 px-2 font-medium">{p.startDate}</td>
                      <td className="py-4 px-2 font-medium">{p.endDate}</td>
                      <td className="py-4 px-2 text-center">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-[10px] font-black uppercase tracking-wider rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> En curso
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-[10px] font-black uppercase tracking-wider rounded-full">
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button 
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 text-blue-900 hover:bg-blue-900/20 rounded-lg transition-colors inline-flex"
                          title="Editar Periodo"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {periods.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-blue-900/50 font-medium">
                      No hay periodos académicos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex justify-between items-center mb-2 px-2">
            <h3 className="text-xl font-bold text-blue-950">
              {editingData ? "Editando Periodo Académico" : "Configurando Nuevo Periodo"}
            </h3>
            <button 
              type="button"
              onClick={handleCloseForm}
              className="flex items-center gap-2 text-blue-900 font-bold hover:bg-blue-900/10 px-4 py-2 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" /> Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className={bentoCardClass}>
              <h3 className={bentoTitleClass}><CalendarRange className="w-5 h-5"/> Identificación</h3>
              
              <div className="flex flex-col gap-4 mt-2">
                <div>
                  <label className={labelClass}>Nombre del Periodo:</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Ej: Primer Semestre, Ciclo A, 2026-I..." 
                    className={inputClass} 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div>
                  <label className={labelClass}>Año Lectivo:</label>
                  <input 
                    type="number" 
                    name="year" 
                    placeholder="Ej: 2026" 
                    className={inputClass} 
                    value={formData.year} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className={bentoCardClass}>
              <h3 className={bentoTitleClass}><CalendarDays className="w-5 h-5"/> Cronograma</h3>
              
              <div className="flex flex-col gap-4 mt-2">
                <div>
                  <label className={labelClass}>Fecha de Inicio:</label>
                  <input 
                    type="date" 
                    name="startDate" 
                    className={inputClass} 
                    value={formData.startDate} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div>
                  <label className={labelClass}>Fecha de Finalización:</label>
                  <input 
                    type="date" 
                    name="endDate" 
                    className={inputClass} 
                    value={formData.endDate} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-end mt-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className={`flex items-center gap-3 px-8 py-3 border-4 border-blue-900 text-blue-950 font-black text-xl rounded-2xl transition-all uppercase tracking-widest ${
                isSaving 
                  ? "opacity-50 cursor-not-allowed bg-blue-900/10" 
                  : "hover:bg-blue-900 hover:text-white shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
              }`}
            >
              <Save className="w-6 h-6" />
              {isSaving ? "Guardando..." : (editingData ? "Guardar Cambios" : "Crear Periodo")}
            </button>
          </div>

        </form>
      )}

      {/* MODAL REUTILIZABLE */}
      <ModalComponent
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        errorCode={modalConfig.errorCode}
      />
    </div>
  );
};

export default AcademicPeriodManager;