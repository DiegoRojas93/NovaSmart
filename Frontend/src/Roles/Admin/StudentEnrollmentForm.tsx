import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Save, Plus, Trash2, Calendar, Clock, User, X, Search, MapPin, Info, Edit2, BookOpen } from "lucide-react";
import { ModalComponent } from "@/shared/Basics/ModalComponent"; // Ajusta la ruta

interface Props {
  institutionId: number;
}

// --- INTERFACES ---
export interface EnrollmentSummary {
  id: number;
  studentName: string;
  periodName: string;
  classroomName: string;
}

export interface EnrollmentFormData {
  id?: number | null;
  studentId: string;
  academicPeriodId: string;
  classroomId: string;
}

interface PreviewBlock {
  day_of_week: number;
  subject_name: string;
  start_time: string;
  end_time: string;
  teacher_name: string;
}

const defaultFormData: EnrollmentFormData = {
  studentId: "",
  academicPeriodId: "",
  classroomId: "",
};

const DAYS_MAP: Record<number, string> = {
  1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado", 7: "Domingo"
};

const EnrollmentManager = ({ institutionId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS ---
  const [enrollmentsList, setEnrollmentsList] = useState<EnrollmentSummary[]>([]);
  const [formOptions, setFormOptions] = useState({
    students: [] as { id: string; name: string }[],
    periods: [] as { id: string; name: string }[],
    classrooms: [] as { id: string; name: string }[],
  });
  const [previewSchedule, setPreviewSchedule] = useState<PreviewBlock[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<EnrollmentFormData>(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false, type: "success" as "success" | "error", title: "", message: "",
  });
  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  // --- CARGA INICIAL DE DATOS ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem("token")}` };
      
      const [tableRes, optionsRes] = await Promise.all([
        fetch(`${apiUrl}/enrollments/all/${institutionId}`, { headers }),
        fetch(`${apiUrl}/enrollments/options/${institutionId}`, { headers })
      ]);

      if (tableRes.ok) setEnrollmentsList(await tableRes.json());
      if (optionsRes.ok) setFormOptions(await optionsRes.json());

    } catch (error) {
      console.error("Error al cargar matrículas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [institutionId]);

  // --- CARGAR PREVISUALIZACIÓN DEL HORARIO ---
  useEffect(() => {
    const fetchPreview = async () => {
      if (!formData.classroomId || !formData.academicPeriodId) {
        setPreviewSchedule([]);
        return;
      }
      try {
        const res = await fetch(`${apiUrl}/enrollments/preview/${institutionId}/${formData.classroomId}/${formData.academicPeriodId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) setPreviewSchedule(await res.json());
      } catch (error) {
        console.error("Error cargando previsualización:", error);
      }
    };
    fetchPreview();
  }, [formData.classroomId, formData.academicPeriodId, institutionId]);

  // --- MANEJO DE VISTAS ---
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setIsFormOpen(true);
  };

  const handleOpenEdit = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/enrollments/${institutionId}/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error();
      const data: EnrollmentFormData = await res.json();
      setEditingId(id);
      setFormData({
        studentId: String(data.studentId),
        academicPeriodId: String(data.academicPeriodId),
        classroomId: String(data.classroomId),
      });
      setIsFormOpen(true);
    } catch (error) {
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "No se pudo cargar la matrícula." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  // --- MANEJADORES DEL FORMULARIO ---
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const response = await fetch(`${apiUrl}/enrollments/${institutionId}`, {
        method,
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: editingId, ...formData })
      });

      if (!response.ok) throw new Error();

      await fetchData();
      handleCloseForm();
      setModalConfig({ isOpen: true, type: "success", title: "¡Éxito!", message: editingId ? "Matrícula actualizada." : "Estudiante matriculado." });
    } catch (error) {
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "Error al guardar la matrícula." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar esta matrícula? Se perderá el acceso a las calificaciones de este curso.")) return;
    try {
      const res = await fetch(`${apiUrl}/enrollments/${institutionId}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error();
      fetchData();
      setModalConfig({ isOpen: true, type: "success", title: "Eliminado", message: "Matrícula eliminada." });
    } catch (error) {
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "No se pudo eliminar la matrícula." });
    }
  };

  const filteredEnrollments = enrollmentsList.filter(e => 
    e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.classroomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- ESTILOS CSS ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative overflow-hidden transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";
  const searchInputClass = "w-full md:max-w-xs bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-2 pl-8 font-medium transition-all placeholder:text-blue-900/40";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-blue-950 mb-2">
            {isFormOpen ? (editingId ? "Editar Matrícula" : "Nueva Matrícula") : "Gestión de Matrículas"}
          </h2>
          <p className="text-blue-900/70 font-medium">
            {isFormOpen 
              ? "Asigne el estudiante a un aula para heredar automáticamente el horario de clases." 
              : "Administre en qué curso y periodo está inscrito cada estudiante."}
          </p>
        </div>
        
        {!isFormOpen ? (
          <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-900 text-white font-bold hover:bg-blue-800 px-5 py-2.5 rounded-xl transition-all shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1">
            <Plus className="w-5 h-5" /> Matricular Estudiante
          </button>
        ) : (
          <button onClick={handleCloseForm} className="flex items-center gap-2 text-blue-900 font-bold hover:bg-blue-900/10 px-4 py-2 rounded-xl transition-colors">
            <X className="w-5 h-5" /> Cancelar
          </button>
        )}
      </div>

      {/* VISTA 1: TABLA */}
      {!isFormOpen && (
        <>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-900/50" />
            <input type="text" placeholder="Buscar por estudiante o curso..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={searchInputClass} />
          </div>

          <div className={bentoCardClass}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-blue-900/50">
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Estudiante</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Curso / Aula</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Periodo</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={4} className="text-center py-10 font-bold text-blue-900/50 animate-pulse">Cargando matrículas...</td></tr>
                  ) : filteredEnrollments.length > 0 ? (
                    filteredEnrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="border-b border-blue-900/10 hover:bg-blue-900/5 transition-colors">
                        <td className="py-4 px-2 font-bold flex items-center gap-2"><User className="w-4 h-4 text-blue-900/60" /> {enrollment.studentName}</td>
                        <td className="py-4 px-2 font-medium text-blue-900/80"><BookOpen className="w-4 h-4 inline mr-1 text-blue-900/40"/>{enrollment.classroomName}</td>
                        <td className="py-4 px-2 font-medium"><span className="bg-blue-900/10 text-blue-900 px-2 py-1 rounded-md text-xs font-bold uppercase">{enrollment.periodName}</span></td>
                        <td className="py-4 px-2 text-right">
                          <button onClick={() => handleOpenEdit(enrollment.id)} className="p-2 text-blue-900 hover:bg-blue-900/20 rounded-lg transition-colors inline-flex" title="Editar"><Edit2 className="w-5 h-5" /></button>
                          <button onClick={() => handleDelete(enrollment.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors inline-flex ml-2" title="Eliminar"><Trash2 className="w-5 h-5" /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="text-center py-10 font-medium text-blue-900/50">No se encontraron matrículas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* VISTA 2: FORMULARIO */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* FORMULARIO DATOS */}
            <div className={`${bentoCardClass} h-fit`}>
              <h3 className={bentoTitleClass}><User className="w-6 h-6"/> 1. Datos de Inscripción</h3>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Estudiante:</label>
                  <select name="studentId" className={selectClass} value={formData.studentId} onChange={handleChange} required>
                    <option value="">Seleccione un alumno...</option>
                    {formOptions.students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className={labelClass}>Periodo Académico:</label>
                  <select name="academicPeriodId" className={selectClass} value={formData.academicPeriodId} onChange={handleChange} required>
                    <option value="">Seleccione el periodo...</option>
                    {formOptions.periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Curso / Aula:</label>
                  <select name="classroomId" className={selectClass} value={formData.classroomId} onChange={handleChange} required>
                    <option value="">Seleccione el curso a matricular...</option>
                    {formOptions.classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-900/5 rounded-xl border border-blue-900/20 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900/80 font-medium leading-relaxed">
                  Al asignar un curso, el estudiante quedará automáticamente registrado en todas las materias y horarios vinculados a dicha aula.
                </p>
              </div>
            </div>

            {/* PREVISUALIZACIÓN HORARIO */}
            <div className={bentoCardClass}>
              <h3 className={bentoTitleClass}><Calendar className="w-6 h-6"/> 2. Previsualización del Horario</h3>
              
              {!formData.classroomId || !formData.academicPeriodId ? (
                <div className="flex-1 flex flex-col items-center justify-center text-blue-900/40 min-h-[200px]">
                  <MapPin className="w-12 h-12 mb-2 opacity-50" />
                  <p className="font-bold text-center px-4">Seleccione un periodo y un curso para previsualizar la carga académica.</p>
                </div>
              ) : previewSchedule.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-blue-900/40 min-h-[200px]">
                  <p className="font-bold text-center px-4">El curso seleccionado no tiene horarios asignados en este periodo.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px] pr-2">
                  {previewSchedule.map((block, idx) => (
                    <div key={idx} className="p-3 bg-white/50 border border-blue-900/20 rounded-xl flex flex-col gap-1">
                      <div className="flex justify-between items-center border-b border-blue-900/10 pb-1 mb-1">
                        <span className="font-extrabold text-blue-950 text-sm uppercase tracking-wider">{DAYS_MAP[block.day_of_week]}</span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900/70 bg-blue-900/10 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3" /> {block.start_time.substring(0, 5)} - {block.end_time.substring(0, 5)}
                        </span>
                      </div>
                      <p className="font-black text-blue-950">{block.subject_name}</p>
                      <p className="text-xs font-medium text-blue-900/80">Docente: {block.teacher_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button type="submit" disabled={isSaving} className={`flex items-center gap-3 px-8 py-3 border-4 border-blue-900 text-blue-950 font-black text-xl rounded-2xl transition-all uppercase tracking-widest ${isSaving ? "opacity-50 cursor-not-allowed bg-blue-900/10" : "hover:bg-blue-900 hover:text-white shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"}`}>
              <Save className="w-6 h-6" /> {isSaving ? "Guardando..." : (editingId ? "Guardar Cambios" : "Confirmar Matrícula")}
            </button>
          </div>
        </form>
      )}

      <ModalComponent isOpen={modalConfig.isOpen} onClose={closeModal} type={modalConfig.type} title={modalConfig.title} message={modalConfig.message} />
    </div>
  );
};

export default EnrollmentManager;