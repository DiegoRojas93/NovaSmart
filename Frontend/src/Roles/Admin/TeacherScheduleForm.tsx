import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Save, Plus, Trash2, Calendar, Clock, User, X } from "lucide-react";

// --- INTERFACES ---
export interface TimeBlock {
  id: number | string; // Puede ser string si viene de la BD
  dayOfWeek: string; 
  startTime: string; 
  endTime: string;
}

export interface ScheduleFormData {
  id?: string; // ID de la tabla pivote (classroom_subject_id) si estamos editando
  assignment: {
    teacherId: string;
    academicPeriodId: string;
    subjectId: string;
    classroomId: string;
  };
  schedules: TimeBlock[];
}

interface Props {
  initialData?: ScheduleFormData | null; // Si se pasa, activa el Modo Edición
  onCancel?: () => void; // Función para cerrar la edición
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

const TeacherScheduleForm = ({ initialData, onCancel }: Props) => {
  const isEditing = !!initialData;
  const [isSaving, setIsSaving] = useState(false);

  // --- ESTADOS DEL FORMULARIO ---
  const [baseAssignment, setBaseAssignment] = useState(defaultAssignment);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(defaultTimeBlocks);

  // --- EFECTO PARA MODO EDICIÓN ---
  useEffect(() => {
    if (initialData) {
      setBaseAssignment(initialData.assignment);
      setTimeBlocks(initialData.schedules.length > 0 ? initialData.schedules : defaultTimeBlocks);
    } else {
      setBaseAssignment(defaultAssignment);
      setTimeBlocks(defaultTimeBlocks);
    }
  }, [initialData]);

  // --- MANEJADORES ---
  const handleBaseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBaseAssignment(prev => ({ ...prev, [name]: value }));
  };

  const addTimeBlock = () => {
    setTimeBlocks([...timeBlocks, { id: Date.now(), dayOfWeek: "1", startTime: "07:00", endTime: "09:00" }]);
  };

  const removeTimeBlock = (id: number | string) => {
    if (timeBlocks.length > 1) {
      setTimeBlocks(timeBlocks.filter(block => block.id !== id));
    }
  };

  const handleTimeBlockChange = (id: number | string, field: keyof TimeBlock, value: string) => {
    setTimeBlocks(timeBlocks.map(block => block.id === id ? { ...block, [field]: value } : block));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      id: initialData?.id, // Enviamos el ID si estamos editando
      assignment: baseAssignment,
      schedules: timeBlocks
    };

    console.log(isEditing ? "Actualizando Horario:" : "Creando Horario:", payload);

    // Simulación de guardado
    setTimeout(() => {
      alert(isEditing ? "¡Horario actualizado exitosamente!" : "¡Horario asignado exitosamente al docente!");
      
      if (!isEditing) {
        // Limpiamos parcialmente si es nuevo
        setBaseAssignment(prev => ({ ...prev, subjectId: "", classroomId: "" }));
        setTimeBlocks([{ id: Date.now(), dayOfWeek: "1", startTime: "07:00", endTime: "09:00" }]);
      } else if (onCancel) {
        onCancel();
      }

      setIsSaving(false);
    }, 1000);
  };

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all";

  // DATOS SIMULADOS
  const mockTeachers = [{ id: "1", name: "Ana Gómez" }, { id: "2", name: "Carlos Pérez" }];
  const mockPeriods = [{ id: "1", name: "2026-I" }, { id: "2", name: "2026-II" }];
  const mockSubjects = [{ id: "1", name: "Cálculo (MAT-101)" }, { id: "2", name: "Física (FIS-201)" }];
  const mockClassrooms = [{ id: "1", name: "101 - Bloque A" }, { id: "2", name: "Lab Sistemas - Bloque C" }];

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA DINÁMICA */}
      <div className="mb-2 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-blue-950 mb-2">
            {isEditing ? "Edición de Horario" : "Asignación de Horarios Docentes"}
          </h2>
          <p className="text-blue-900/70 font-medium">
            {isEditing 
              ? "Modifique los bloques de tiempo o reasigne la materia/aula." 
              : "Configure los bloques de clase para un profesor específico."}
          </p>
        </div>

        {isEditing && onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 text-blue-900 font-bold hover:bg-blue-900/10 px-4 py-2 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" /> Cancelar
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">

        {/* --- PASO 1: ASIGNACIÓN BASE --- */}
        <div className={bentoCardClass}>
          <h3 className={bentoTitleClass}><User className="w-6 h-6"/> 1. Parámetros de la Clase</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className={labelClass}>Docente Titular:</label>
              <select name="teacherId" className={selectClass} value={baseAssignment.teacherId} onChange={handleBaseChange} required>
                <option value="" className="bg-white text-gray-400">Seleccione un docente...</option>
                {mockTeachers.map(t => <option key={t.id} value={t.id} className="bg-white">{t.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className={labelClass}>Periodo Académico:</label>
              <select name="academicPeriodId" className={selectClass} value={baseAssignment.academicPeriodId} onChange={handleBaseChange} required>
                <option value="" className="bg-white text-gray-400">Seleccione un periodo...</option>
                {mockPeriods.map(p => <option key={p.id} value={p.id} className="bg-white">{p.name}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Asignatura (Materia):</label>
              <select name="subjectId" className={selectClass} value={baseAssignment.subjectId} onChange={handleBaseChange} required>
                <option value="" className="bg-white text-gray-400">Seleccione una materia...</option>
                {mockSubjects.map(s => <option key={s.id} value={s.id} className="bg-white">{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Aula / Laboratorio:</label>
              <select name="classroomId" className={selectClass} value={baseAssignment.classroomId} onChange={handleBaseChange} required>
                <option value="" className="bg-white text-gray-400">Seleccione el espacio físico...</option>
                {mockClassrooms.map(c => <option key={c.id} value={c.id} className="bg-white">{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* --- PASO 2: BLOQUES DE HORARIO --- */}
        <div className={bentoCardClass}>
          <div className="flex justify-between items-center border-b-2 border-blue-900/80 pb-1 mb-2">
            <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2">
              <Calendar className="w-6 h-6"/> 2. Bloques de Tiempo
            </h3>
            <button 
              type="button" 
              onClick={addTimeBlock}
              className="text-sm font-bold bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4"/> Agregar Bloque
            </button>
          </div>
          <p className="text-sm text-blue-900/70 font-medium mb-2">Define los días y horas exactas en las que el docente impartirá esta clase.</p>

          <div className="flex flex-col gap-4">
            {timeBlocks.map((block) => (
              <div key={block.id} className="flex flex-col md:flex-row gap-4 items-end bg-blue-900/5 p-4 rounded-2xl border border-blue-900/20 relative group">
                
                <div className="absolute -left-3 -top-3 w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                  <Clock className="w-3 h-3" />
                </div>
                
                <div className="flex-1">
                  <label className={labelClass}>Día de la semana:</label>
                  <select 
                    className={selectClass} 
                    value={block.dayOfWeek} 
                    onChange={(e) => handleTimeBlockChange(block.id, "dayOfWeek", e.target.value)} 
                    required
                  >
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
                  <label className={labelClass}>Hora de Inicio:</label>
                  <input 
                    type="time" 
                    className={inputClass} 
                    value={block.startTime} 
                    onChange={(e) => handleTimeBlockChange(block.id, "startTime", e.target.value)} 
                    required 
                  />
                </div>

                <div className="flex-1">
                  <label className={labelClass}>Hora de Fin:</label>
                  <input 
                    type="time" 
                    className={inputClass} 
                    value={block.endTime} 
                    onChange={(e) => handleTimeBlockChange(block.id, "endTime", e.target.value)} 
                    required 
                  />
                </div>
                
                <button 
                  type="button" 
                  onClick={() => removeTimeBlock(block.id)}
                  disabled={timeBlocks.length === 1}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Eliminar bloque de horario"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- BOTÓN DE GUARDADO DINÁMICO --- */}
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
            {isSaving ? "Guardando..." : (isEditing ? "Guardar Cambios" : "Guardar Horario")}
          </button>
        </div>

      </form>
    </div>
  );
};

export default TeacherScheduleForm;