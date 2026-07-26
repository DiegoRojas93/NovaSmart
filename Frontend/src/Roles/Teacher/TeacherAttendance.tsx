import { useState, useEffect, type FormEvent } from "react";
import { Save, Calendar, Users, CheckSquare, MessageSquare, Check, X, Clock, FileText } from "lucide-react";

// --- INTERFACES ---
type AttendanceStatus = "PRESENTE" | "AUSENTE" | "LLEGO_TARDE" | "JUSTIFICADO";

interface StudentAttendance {
  studentId: string;
  name: string;
  status: AttendanceStatus;
  observations: string;
}

// --- DATOS SIMULADOS ---
const mockCourses = [
  { id: "CS1", name: "1101 - Cálculo (07:00 - 09:00)" },
  { id: "CS2", name: "1102 - Cálculo (09:30 - 11:30)" },
  { id: "CS3", name: "1001 - Física I (12:00 - 14:00)" },
];

const mockStudentsDb: Record<string, { id: string, name: string }[]> = {
  "CS1": [
    { id: "S1", name: "Álvarez, María Camila" },
    { id: "S2", name: "Bermúdez, Carlos Andrés" },
    { id: "S3", name: "Castro, Luis Fernando" },
    { id: "S4", name: "Díaz, Ana Sofía" },
    { id: "S5", name: "Gómez, Santiago" },
  ],
  "CS2": [
    { id: "S6", name: "Herrera, Laura" },
    { id: "S7", name: "Jiménez, Pedro" },
  ],
  "CS3": []
};

const TeacherAttendance = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  // --- ESTADOS DEL FORMULARIO ---
  const [selectedCourse, setSelectedCourse] = useState<string>(mockCourses[0].id);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]); // Fecha de hoy por defecto
  const [attendanceList, setAttendanceList] = useState<StudentAttendance[]>([]);

  // --- EFECTO: Cargar alumnos cuando cambia el curso ---
  useEffect(() => {
    if (selectedCourse) {
      // Simulamos la carga de estudiantes desde la base de datos
      const students = mockStudentsDb[selectedCourse] || [];
      
      // Por defecto, TODOS inician como "PRESENTE" para ahorrar tiempo
      const initialAttendance = students.map(s => ({
        studentId: s.id,
        name: s.name,
        status: "PRESENTE" as AttendanceStatus,
        observations: ""
      }));
      
      setAttendanceList(initialAttendance);
    }
  }, [selectedCourse]);

  // --- MANEJADORES ---
  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    setAttendanceList(prev => 
      prev.map(s => s.studentId === studentId ? { ...s, status: newStatus } : s)
    );
  };

  const handleObservationChange = (studentId: string, text: string) => {
    setAttendanceList(prev => 
      prev.map(s => s.studentId === studentId ? { ...s, observations: text } : s)
    );
  };

  const markAllAsPresent = () => {
    setAttendanceList(prev => prev.map(s => ({ ...s, status: "PRESENTE" })));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      classroomSubjectId: selectedCourse,
      attendanceDate: date,
      records: attendanceList
    };

    console.log("Guardando asistencia en la BD:", payload);

    setTimeout(() => {
      alert("¡Asistencia guardada exitosamente!");
      setIsSaving(false);
    }, 1000);
  };

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all";

  // --- COMPONENTES AUXILIARES ---
  const StatusButton = ({ studentId, currentStatus, targetStatus, icon: Icon, label, colorClass }: any) => {
    const isSelected = currentStatus === targetStatus;
    return (
      <button
        type="button"
        onClick={() => handleStatusChange(studentId, targetStatus)}
        className={`flex flex-col md:flex-row items-center justify-center gap-1.5 p-2 rounded-xl transition-all border-2 font-bold text-xs uppercase tracking-wider ${
          isSelected 
            ? `${colorClass.active} border-transparent shadow-sm scale-105` 
            : `border-blue-900/10 text-blue-900/40 hover:border-blue-900/30 bg-white/50`
        }`}
        title={label}
      >
        <Icon className="w-4 h-4" />
        <span className="hidden md:inline">{label}</span>
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Toma de Asistencia</h2>
        <p className="text-blue-900/70 font-medium">
          Seleccione la clase y registre la asistencia de sus alumnos. Por defecto, todos están marcados como presentes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* --- CAJA 1: SELECTORES PRINCIPALES --- */}
        <div className={bentoCardClass}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
                <Users className="w-4 h-4"/> Clase / Curso a evaluar:
              </label>
              <select 
                className={selectClass} 
                value={selectedCourse} 
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
              >
                {mockCourses.map(c => <option key={c.id} value={c.id} className="bg-white">{c.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="text-[11px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4"/> Fecha de la clase:
              </label>
              <input 
                type="date" 
                className={inputClass} 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]} // No permite fechas futuras
                required 
              />
            </div>
          </div>
        </div>

        {/* --- CAJA 2: LISTA DE ESTUDIANTES --- */}
        <div className={bentoCardClass}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-blue-900/80 pb-2 mb-4 gap-4">
            <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2 m-0">
              <CheckSquare className="w-5 h-5"/> Listado de Alumnos ({attendanceList.length})
            </h3>
            
            <button 
              type="button" 
              onClick={markAllAsPresent}
              className="text-xs font-black bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white px-4 py-2 rounded-xl transition-colors uppercase tracking-wider"
            >
              Restablecer (Todos Presentes)
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {attendanceList.length > 0 ? attendanceList.map((student, index) => (
              <div 
                key={student.studentId} 
                className={`flex flex-col xl:flex-row gap-4 p-4 rounded-2xl border-2 transition-colors ${
                  student.status === "AUSENTE" ? "border-red-900/30 bg-red-50/50" : 
                  student.status === "LLEGO_TARDE" ? "border-yellow-900/30 bg-yellow-50/50" : 
                  "border-blue-900/10 bg-white/40 hover:border-blue-900/30"
                }`}
              >
                {/* Nombre del estudiante */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                    {index + 1}
                  </div>
                  <h4 className="font-bold text-blue-950 text-base">{student.name}</h4>
                </div>

                {/* Botones de Estado */}
                <div className="grid grid-cols-4 gap-2 xl:w-1/2">
                  <StatusButton 
                    studentId={student.studentId} currentStatus={student.status} 
                    targetStatus="PRESENTE" icon={Check} label="Presente" 
                    colorClass={{ active: "bg-green-500 text-white" }} 
                  />
                  <StatusButton 
                    studentId={student.studentId} currentStatus={student.status} 
                    targetStatus="AUSENTE" icon={X} label="Ausente" 
                    colorClass={{ active: "bg-red-500 text-white" }} 
                  />
                  <StatusButton 
                    studentId={student.studentId} currentStatus={student.status} 
                    targetStatus="LLEGO_TARDE" icon={Clock} label="Tarde" 
                    colorClass={{ active: "bg-yellow-500 text-white" }} 
                  />
                  <StatusButton 
                    studentId={student.studentId} currentStatus={student.status} 
                    targetStatus="JUSTIFICADO" icon={FileText} label="Excusa" 
                    colorClass={{ active: "bg-blue-600 text-white" }} 
                  />
                </div>

                {/* Observaciones (Solo si no está presente) */}
                <div className={`xl:w-1/4 transition-opacity duration-300 ${student.status === 'PRESENTE' ? 'opacity-30 focus-within:opacity-100' : 'opacity-100'}`}>
                  <div className="relative">
                    <MessageSquare className="absolute left-0 top-1.5 w-4 h-4 text-blue-900/40" />
                    <input 
                      type="text" 
                      placeholder="Nota (Opcional)"
                      className={`${inputClass} pl-6 text-sm py-0 border-b`}
                      value={student.observations}
                      onChange={(e) => handleObservationChange(student.studentId, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-12 flex flex-col items-center text-center text-blue-900/40">
                <Users className="w-12 h-12 mb-2 opacity-50" />
                <p className="font-bold text-lg">No hay alumnos matriculados.</p>
                <p className="text-sm">Si esto es un error, contacte a coordinación.</p>
              </div>
            )}
          </div>
        </div>

        {/* BOTÓN "SELLO" DE GUARDADO */}
        {attendanceList.length > 0 && (
          <div className="flex justify-end mt-2 sticky bottom-4 z-50">
            <button 
              type="submit" 
              disabled={isSaving}
              className={`flex items-center gap-3 px-8 py-4 bg-white border-4 border-blue-900 text-blue-950 font-black text-xl rounded-2xl transition-all uppercase tracking-widest shadow-[6px_6px_0_rgba(30,58,138,0.3)] ${
                isSaving 
                  ? "opacity-50 cursor-not-allowed bg-blue-50" 
                  : "hover:bg-blue-900 hover:text-white hover:shadow-[2px_2px_0_rgba(30,58,138,0.3)] hover:translate-y-1 hover:translate-x-1"
              }`}
            >
              <Save className="w-6 h-6" />
              {isSaving ? "Guardando Registro..." : "Sellar Asistencia"}
            </button>
          </div>
        )}

      </form>
    </div>
  );
};

export default TeacherAttendance;