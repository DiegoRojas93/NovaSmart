import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Save, Plus, Trash2, Calendar, Clock, User, X, Search, BookOpen } from "lucide-react";
import { ModalComponent } from "@/shared/Basics/ModalComponent"; 

interface Props {
  institutionId: number;
}

export interface ScheduleSummary {
  id: number;
  teacherName: string;
  subjectName: string;
  classroomName: string;
  periodName: string;
}

export interface TimeBlock {
  id: number | string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleFormData {
  id?: number | null;
  assignment: {
    teacherId: string;
    academicPeriodId: string;
    subjectId: string;
    classroomId: string;
  };
  schedules: TimeBlock[];
}

const defaultAssignment = {
  teacherId: "",
  academicPeriodId: "",
  subjectId: "",
  classroomId: "",
};

const defaultTimeBlocks: TimeBlock[] = [
  { id: Date.now(), dayOfWeek: "1", startTime: "07:00", endTime: "09:00" }
];

const ScheduleManager = ({ institutionId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS ---
  const [schedulesList, setSchedulesList] = useState<ScheduleSummary[]>([]);
  
  // ESTADO PARA LOS SELECTS (Viene de BD)
  const [formOptions, setFormOptions] = useState({
    teachers: [] as {id: string, name: string}[],
    subjects: [] as {id: string, name: string}[],
    classrooms: [] as {id: string, name: string}[],
    periods: [] as {id: string, name: string}[]
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [baseAssignment, setBaseAssignment] = useState(defaultAssignment);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(defaultTimeBlocks);
  const [isSaving, setIsSaving] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });
  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  // --- CARGAR DATOS DEL BACKEND ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem("token")}` };
      
      // 1. Cargar la lista de la tabla
      const tableResponse = await fetch(`${apiUrl}/schedules/all/${institutionId}`, { headers });
      if (tableResponse.ok) setSchedulesList(await tableResponse.json());

      // 2. Cargar las opciones para los selects
      const optionsResponse = await fetch(`${apiUrl}/schedules/options/${institutionId}`, { headers });
      if (optionsResponse.ok) setFormOptions(await optionsResponse.json());

    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [institutionId]);

  // --- MANEJO DE VISTAS ---
  const handleOpenCreate = () => {
    setEditingId(null);
    setBaseAssignment(defaultAssignment);
    setTimeBlocks([{ id: Date.now(), dayOfWeek: "1", startTime: "07:00", endTime: "09:00" }]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = async (scheduleId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/schedules/${institutionId}/${scheduleId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      
      if (!response.ok) throw new Error("No se pudo cargar la información.");
      
      const data: ScheduleFormData = await response.json();
      setEditingId(data.id || scheduleId);
      
      // Convertimos los IDs a string para que hagan "match" con el select
      setBaseAssignment({
        teacherId: String(data.assignment.teacherId),
        academicPeriodId: String(data.assignment.academicPeriodId),
        subjectId: String(data.assignment.subjectId),
        classroomId: String(data.assignment.classroomId),
      });

      // Aseguramos que los bloques de tiempo tengan un ID único para React y formateamos hora
      const formattedBlocks = data.schedules.map((b, i) => ({
        id: b.id || Date.now() + i,
        dayOfWeek: String(b.dayOfWeek),
        startTime: b.startTime.substring(0, 5), // '07:00:00' -> '07:00'
        endTime: b.endTime.substring(0, 5)
      }));

      setTimeBlocks(formattedBlocks.length > 0 ? formattedBlocks : defaultTimeBlocks);
      setIsFormOpen(true);
    } catch (error) {
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "Error cargando los datos a editar." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  // --- MANEJADORES DEL FORMULARIO ---
  const handleBaseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBaseAssignment(prev => ({ ...prev, [name]: value }));
  };

  const addTimeBlock = () => setTimeBlocks([...timeBlocks, { id: Date.now(), dayOfWeek: "1", startTime: "07:00", endTime: "09:00" }]);
  const removeTimeBlock = (id: number | string) => {
    if (timeBlocks.length > 1) setTimeBlocks(timeBlocks.filter(block => block.id !== id));
  };
  const handleTimeBlockChange = (id: number | string, field: keyof TimeBlock, value: string) => {
    setTimeBlocks(timeBlocks.map(block => block.id === id ? { ...block, [field]: value } : block));
  };

  // --- GUARDAR (POST / PUT) ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const payload: ScheduleFormData = {
      id: editingId,
      assignment: baseAssignment,
      schedules: timeBlocks
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const response = await fetch(`${apiUrl}/schedules/${institutionId}`, {
        method: method,
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Error al guardar el horario');

      await fetchData(); // Recargamos tabla y opciones
      handleCloseForm();
      setModalConfig({ isOpen: true, type: "success", title: "¡Éxito!", message: editingId ? "Horario actualizado." : "Horario asignado." });
    } catch (error: any) {
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "No se pudo guardar el horario." });
    } finally {
      setIsSaving(false);
    }
  };

  // --- ELIMINAR (DELETE) ---
  const handleDelete = async (scheduleId: number) => {
    if (!window.confirm("¿Está seguro de eliminar este horario? Esta acción no se puede deshacer.")) return;

    try {
      const response = await fetch(`${apiUrl}/schedules/${institutionId}/${scheduleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });

      if (!response.ok) throw new Error('Error al eliminar');
      
      setModalConfig({ isOpen: true, type: "success", title: "Eliminado", message: "Horario eliminado correctamente." });
      fetchData();
    } catch (error) {
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "No se pudo eliminar el horario." });
    }
  };

  const filteredSchedules = schedulesList.filter(s => 
    s.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.classroomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative overflow-hidden transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all";
  const searchInputClass = "w-full md:max-w-xs bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-2 pl-8 font-medium transition-all placeholder:text-blue-900/40";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      <div className="mb-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-blue-950 mb-2">
            {isFormOpen ? (editingId ? "Editar Horario" : "Nuevo Horario") : "Gestión de Horarios"}
          </h2>
          <p className="text-blue-900/70 font-medium">
            {isFormOpen 
              ? "Configure los bloques de clase, docente y materia." 
              : "Administre las asignaciones de clases y horarios de los docentes."}
          </p>
        </div>
        
        {!isFormOpen ? (
          <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-900 text-white font-bold hover:bg-blue-800 px-5 py-2.5 rounded-xl transition-all shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1">
            <Plus className="w-5 h-5" /> Nueva Asignación
          </button>
        ) : (
          <button onClick={handleCloseForm} className="flex items-center gap-2 text-blue-900 font-bold hover:bg-blue-900/10 px-4 py-2 rounded-xl transition-colors">
            <X className="w-5 h-5" /> Cancelar
          </button>
        )}
      </div>

      {!isFormOpen && (
        <>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-900/50" />
            <input type="text" placeholder="Buscar por docente, materia o aula..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={searchInputClass} />
          </div>

          <div className={bentoCardClass}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-blue-900/50">
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Docente</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Asignatura</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Aula</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Periodo</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={5} className="text-center py-10 font-bold text-blue-900/50 animate-pulse">Cargando horarios asignados...</td></tr>
                  ) : filteredSchedules.length > 0 ? (
                    filteredSchedules.map((schedule) => (
                      <tr key={schedule.id} className="border-b border-blue-900/10 hover:bg-blue-900/5 transition-colors">
                        <td className="py-4 px-2 font-bold flex items-center gap-2"><User className="w-4 h-4 text-blue-900/60" /> {schedule.teacherName}</td>
                        <td className="py-4 px-2 font-medium text-blue-900/80"><span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-blue-900/40"/> {schedule.subjectName}</span></td>
                        <td className="py-4 px-2 font-medium text-blue-900/80">{schedule.classroomName}</td>
                        <td className="py-4 px-2 font-medium"><span className="bg-blue-900/10 text-blue-900 px-2 py-1 rounded-md text-xs font-bold uppercase">{schedule.periodName}</span></td>
                        <td className="py-4 px-2 text-right">
                          <button onClick={() => handleOpenEdit(schedule.id)} className="p-2 text-blue-900 hover:bg-blue-900/20 rounded-lg transition-colors inline-flex" title="Editar Horario"><Calendar className="w-5 h-5" /></button>
                          <button onClick={() => handleDelete(schedule.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors inline-flex ml-2" title="Eliminar Horario"><Trash2 className="w-5 h-5" /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="text-center py-10 font-medium text-blue-900/50">No se encontraron horarios registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={bentoCardClass}>
            <h3 className={bentoTitleClass}><User className="w-6 h-6"/> 1. Parámetros de la Clase</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label className={labelClass}>Docente Titular:</label>
                <select name="teacherId" className={selectClass} value={baseAssignment.teacherId} onChange={handleBaseChange} required>
                  <option value="" className="bg-white text-gray-400">Seleccione un docente...</option>
                  {formOptions.teachers.map(t => <option key={t.id} value={t.id} className="bg-white">{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Periodo Académico:</label>
                <select name="academicPeriodId" className={selectClass} value={baseAssignment.academicPeriodId} onChange={handleBaseChange} required>
                  <option value="" className="bg-white text-gray-400">Seleccione un periodo...</option>
                  {formOptions.periods.map(p => <option key={p.id} value={p.id} className="bg-white">{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Asignatura (Materia):</label>
                <select name="subjectId" className={selectClass} value={baseAssignment.subjectId} onChange={handleBaseChange} required>
                  <option value="" className="bg-white text-gray-400">Seleccione una materia...</option>
                  {formOptions.subjects.map(s => <option key={s.id} value={s.id} className="bg-white">{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Aula / Laboratorio:</label>
                <select name="classroomId" className={selectClass} value={baseAssignment.classroomId} onChange={handleBaseChange} required>
                  <option value="" className="bg-white text-gray-400">Seleccione el espacio físico...</option>
                  {formOptions.classrooms.map(c => <option key={c.id} value={c.id} className="bg-white">{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={bentoCardClass}>
            <div className="flex justify-between items-center border-b-2 border-blue-900/80 pb-1 mb-2">
              <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2"><Calendar className="w-6 h-6"/> 2. Bloques de Tiempo</h3>
              <button type="button" onClick={addTimeBlock} className="text-sm font-bold bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white px-3 py-1 rounded-lg transition-colors flex items-center gap-1"><Plus className="w-4 h-4"/> Agregar Bloque</button>
            </div>
            
            <div className="flex flex-col gap-4">
              {timeBlocks.map((block) => (
                <div key={block.id} className="flex flex-col md:flex-row gap-4 items-end bg-blue-900/5 p-4 rounded-2xl border border-blue-900/20 relative">
                  <div className="absolute -left-3 -top-3 w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md"><Clock className="w-3 h-3" /></div>
                  <div className="flex-1">
                    <label className={labelClass}>Día de la semana:</label>
                    <select className={selectClass} value={block.dayOfWeek} onChange={(e) => handleTimeBlockChange(block.id, "dayOfWeek", e.target.value)} required>
                      <option value="1" className="bg-white">Lunes</option>
                      <option value="2" className="bg-white">Martes</option>
                      <option value="3" className="bg-white">Miércoles</option>
                      <option value="4" className="bg-white">Jueves</option>
                      <option value="5" className="bg-white">Viernes</option>
                      <option value="6" className="bg-white">Sábado</option>
                      <option value="7" className="bg-white">Domingo</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Inicio:</label>
                    <input type="time" className={inputClass} value={block.startTime} onChange={(e) => handleTimeBlockChange(block.id, "startTime", e.target.value)} required />
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Fin:</label>
                    <input type="time" className={inputClass} value={block.endTime} onChange={(e) => handleTimeBlockChange(block.id, "endTime", e.target.value)} required />
                  </div>
                  <button type="button" onClick={() => removeTimeBlock(block.id)} disabled={timeBlocks.length === 1} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button type="submit" disabled={isSaving} className={`flex items-center gap-3 px-8 py-3 border-4 border-blue-900 text-blue-950 font-black text-xl rounded-2xl transition-all uppercase tracking-widest ${isSaving ? "opacity-50 cursor-not-allowed bg-blue-900/10" : "hover:bg-blue-900 hover:text-white shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"}`}>
              <Save className="w-6 h-6" /> {isSaving ? "Guardando..." : (editingId ? "Guardar Cambios" : "Guardar Horario")}
            </button>
          </div>
        </form>
      )}

      <ModalComponent isOpen={modalConfig.isOpen} onClose={closeModal} type={modalConfig.type} title={modalConfig.title} message={modalConfig.message} />
    </div>
  );
};

export default ScheduleManager;