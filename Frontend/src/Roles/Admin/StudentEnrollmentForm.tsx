import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Save, User, Calendar, MapPin, Clock, Info, X } from "lucide-react";

// --- INTERFACES ---
export interface EnrollmentFormData {
  id?: string; // ID de la tabla enrollments (solo para edición)
  studentId: string;
  academicPeriodId: string;
  classroomId: string;
}

interface Props {
  initialData?: EnrollmentFormData | null; 
  onCancel?: () => void; 
}

const defaultFormData: EnrollmentFormData = {
  studentId: "",
  academicPeriodId: "",
  classroomId: "",
};

const StudentEnrollmentForm = ({ initialData, onCancel }: Props) => {
  const isEditing = !!initialData;
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<EnrollmentFormData>(defaultFormData);

  // --- EFECTO PARA MODO EDICIÓN ---
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  // --- MANEJADORES ---
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      id: formData.id,
      ...formData
    };

    console.log(isEditing ? "Actualizando Matrícula:" : "Creando Matrícula:", payload);

    // Simulación de guardado
    setTimeout(() => {
      alert(isEditing ? "¡Cambio de curso registrado!" : "¡Estudiante matriculado en el curso exitosamente!");
      
      if (!isEditing) {
        setFormData(defaultFormData);
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

  // DATOS SIMULADOS
  const mockStudents = [{ id: "1", name: "Camilo Andrés Gómez (100222333)" }, { id: "2", name: "María José Silva (444555666)" }];
  const mockPeriods = [{ id: "1", name: "2026-I" }, { id: "2", name: "2026-II" }];
  const mockClassrooms = [{ id: "1", name: "Sexto 601 (Capacidad: 30)" }, { id: "2", name: "Sexto 602 (Capacidad: 35)" }];

  // Horario simulado que aparece al seleccionar un curso
  const previewSchedule = formData.classroomId ? [
    { id: 1, dia: "Lunes", materia: "Matemáticas", hora: "07:00 - 09:00", docente: "Ana Gómez" },
    { id: 2, dia: "Lunes", materia: "Historia", hora: "09:30 - 11:30", docente: "Luis Pérez" },
    { id: 3, dia: "Martes", materia: "Biología", hora: "07:00 - 09:00", docente: "Carlos Ruiz" },
  ] : [];

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA DINÁMICA */}
      <div className="mb-2 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-blue-950 mb-2">
            {isEditing ? "Reasignación de Curso" : "Asignación de Curso y Horario"}
          </h2>
          <p className="text-blue-900/70 font-medium">
            {isEditing 
              ? "Cambie al estudiante de curso. Su horario se actualizará automáticamente." 
              : "Inscriba al estudiante en un aula. El horario se heredará del pénsum del curso."}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* --- CAJA 1: MATRÍCULA --- */}
          <div className={`${bentoCardClass} h-fit`}>
            <h3 className={bentoTitleClass}><User className="w-6 h-6"/> 1. Datos de Inscripción</h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Estudiante:</label>
                <select name="studentId" className={selectClass} value={formData.studentId} onChange={handleChange} required>
                  <option value="" className="bg-white text-gray-400">Seleccione un alumno...</option>
                  {mockStudents.map(s => <option key={s.id} value={s.id} className="bg-white">{s.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className={labelClass}>Periodo Académico:</label>
                <select name="academicPeriodId" className={selectClass} value={formData.academicPeriodId} onChange={handleChange} required>
                  <option value="" className="bg-white text-gray-400">Seleccione el periodo...</option>
                  {mockPeriods.map(p => <option key={p.id} value={p.id} className="bg-white">{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Curso / Aula:</label>
                <select name="classroomId" className={selectClass} value={formData.classroomId} onChange={handleChange} required>
                  <option value="" className="bg-white text-gray-400">Seleccione el curso a matricular...</option>
                  {mockClassrooms.map(c => <option key={c.id} value={c.id} className="bg-white">{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-900/5 rounded-xl border border-blue-900/20 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900/80 font-medium leading-relaxed">
                Al asignar un curso, el estudiante quedará automáticamente registrado en todas las materias (`classroom_subjects`) y bloques de tiempo (`schedules`) vinculados a dicha aula.
              </p>
            </div>
          </div>

          {/* --- CAJA 2: PREVISUALIZACIÓN DEL HORARIO --- */}
          <div className={bentoCardClass}>
            <h3 className={bentoTitleClass}><Calendar className="w-6 h-6"/> 2. Previsualización del Horario</h3>
            
            {!formData.classroomId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-blue-900/40 min-h-[200px]">
                <MapPin className="w-12 h-12 mb-2 opacity-50" />
                <p className="font-bold text-center px-4">Seleccione un curso a la izquierda para previsualizar la carga académica del estudiante.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px] no-scrollbar pr-2">
                {previewSchedule.map(block => (
                  <div key={block.id} className="p-3 bg-white/50 border border-blue-900/20 rounded-xl flex flex-col gap-1">
                    <div className="flex justify-between items-center border-b border-blue-900/10 pb-1 mb-1">
                      <span className="font-extrabold text-blue-950 text-sm uppercase tracking-wider">{block.dia}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900/70 bg-blue-900/10 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3" /> {block.hora}
                      </span>
                    </div>
                    <p className="font-black text-blue-950">{block.materia}</p>
                    <p className="text-xs font-medium text-blue-900/80">Docente: {block.docente}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* --- BOTÓN DE GUARDADO --- */}
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
            {isSaving ? "Guardando..." : (isEditing ? "Guardar Cambios" : "Confirmar Matrícula")}
          </button>
        </div>

      </form>
    </div>
  );
};

export default StudentEnrollmentForm;