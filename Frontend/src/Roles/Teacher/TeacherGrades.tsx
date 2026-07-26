import { useState, useEffect, type FormEvent } from "react";
import { Save, BookOpen, Users, Award, MessageSquare, Calendar, AlertCircle } from "lucide-react";

// --- INTERFACES ---
interface StudentGrade {
  studentId: string;
  name: string;
  grade: number | "";
  observations: string;
}

// --- DATOS SIMULADOS ---
const mockCourses = [
  { id: "CS1", name: "1101 - Cálculo" },
  { id: "CS2", name: "1102 - Cálculo" },
  { id: "CS3", name: "1001 - Física I" },
];

const mockPeriods = [
  { id: "1", name: "Primer Periodo (2026-I)" },
  { id: "2", name: "Segundo Periodo (2026-I)" },
];

// Simulamos los estudiantes inscritos por curso
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

const TeacherGrades = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  // --- ESTADOS DEL FORMULARIO ---
  const [selectedCourse, setSelectedCourse] = useState<string>(mockCourses[0].id);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(mockPeriods[0].id);
  const [gradesList, setGradesList] = useState<StudentGrade[]>([]);

  // --- EFECTO: Cargar alumnos al cambiar el curso ---
  useEffect(() => {
    if (selectedCourse) {
      const students = mockStudentsDb[selectedCourse] || [];
      
      // Inicializamos la lista de calificaciones vacía para el nuevo curso
      const initialGrades = students.map(s => ({
        studentId: s.id,
        name: s.name,
        grade: "" as number | "",
        observations: ""
      }));
      
      setGradesList(initialGrades);
    }
  }, [selectedCourse, selectedPeriod]); // Si cambia el periodo, idealmente recargas de BD si ya hay notas

  // --- MANEJADORES ---
  const handleGradeChange = (studentId: string, value: string) => {
    // Permite escribir decimales válidos entre 1.0 y 5.0
    let numericValue: number | "" = parseFloat(value);
    
    if (value === "") numericValue = "";
    else if (numericValue > 5.0) numericValue = 5.0;
    else if (numericValue < 0) numericValue = 0;

    setGradesList(prev => 
      prev.map(s => s.studentId === studentId ? { ...s, grade: numericValue } : s)
    );
  };

  const handleObservationChange = (studentId: string, text: string) => {
    setGradesList(prev => 
      prev.map(s => s.studentId === studentId ? { ...s, observations: text } : s)
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validación básica: Que todos tengan nota
    const missingGrades = gradesList.filter(s => s.grade === "");
    if (missingGrades.length > 0) {
      alert(`Faltan calificaciones para ${missingGrades.length} estudiante(s). Por favor complete todas las notas.`);
      return;
    }

    setIsSaving(true);

    const payload = {
      classroomSubjectId: selectedCourse,
      academicPeriodId: selectedPeriod,
      grades: gradesList
    };

    console.log("Guardando calificaciones en la BD:", payload);

    setTimeout(() => {
      alert("¡Calificaciones guardadas exitosamente!");
      setIsSaving(false);
    }, 1200);
  };

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all";

  // --- RENDERIZADOR DE ESTADO VISUAL ---
  const getGradeStyle = (grade: number | "") => {
    if (grade === "") return "border-blue-900/20";
    if (grade < 3.0) return "border-red-500 bg-red-50 text-red-900";
    if (grade >= 4.5) return "border-green-500 bg-green-50 text-green-900";
    return "border-blue-500 bg-blue-50 text-blue-900";
  };

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Registro de Calificaciones</h2>
        <p className="text-blue-900/70 font-medium">
          Seleccione el grupo y el periodo para asentar las notas definitivas de sus estudiantes. Rango válido: 1.0 a 5.0.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* --- CAJA 1: SELECTORES PRINCIPALES --- */}
        <div className={bentoCardClass}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
                <BookOpen className="w-4 h-4"/> Grupo a calificar:
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
                <Calendar className="w-4 h-4"/> Periodo Académico:
              </label>
              <select 
                className={selectClass} 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                required
              >
                {mockPeriods.map(p => <option key={p.id} value={p.id} className="bg-white">{p.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* --- CAJA 2: LISTA DE ESTUDIANTES PARA NOTAS --- */}
        <div className={bentoCardClass}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-blue-900/80 pb-2 mb-4 gap-4">
            <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2 m-0">
              <Users className="w-5 h-5"/> Planilla de Notas ({gradesList.length})
            </h3>
            
            <div className="flex gap-4 text-xs font-bold text-blue-900/70 bg-blue-900/5 px-3 py-1.5 rounded-lg">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> &ge; 4.5 Excelente</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> &ge; 3.0 Aprobado</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> &lt; 3.0 Reprobado</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {gradesList.length > 0 ? (
              // Encabezado visual para pantallas grandes
              <div className="hidden lg:grid grid-cols-12 gap-4 px-4 pb-2 border-b-2 border-blue-900/10 text-xs font-black uppercase tracking-widest text-blue-900/50">
                <div className="col-span-1 text-center">N°</div>
                <div className="col-span-5">Apellidos y Nombres</div>
                <div className="col-span-2 text-center">Nota Definitiva</div>
                <div className="col-span-4">Observaciones del Docente</div>
              </div>
            ) : null}

            {gradesList.length > 0 ? gradesList.map((student, index) => (
              <div 
                key={student.studentId} 
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 lg:p-2 rounded-xl border-2 border-blue-900/10 bg-white/40 hover:border-blue-900/30 transition-colors"
              >
                {/* Nombre del estudiante */}
                <div className="lg:col-span-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                    {index + 1}
                  </div>
                  <h4 className="font-bold text-blue-950 text-sm">{student.name}</h4>
                  {student.grade !== "" && (student.grade as number) < 3.0 && (
                     <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" title="Riesgo Académico" />
                  )}
                </div>

                {/* Input de Nota */}
                <div className="lg:col-span-2 flex justify-center">
                  <div className="relative w-full max-w-[100px]">
                    <Award className="absolute left-2 top-1.5 w-4 h-4 text-blue-900/40" />
                    <input 
                      type="number" 
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      placeholder="0.0"
                      className={`w-full bg-transparent border-2 border-dashed outline-none py-1 pl-8 pr-2 rounded-lg font-black text-center transition-all ${getGradeStyle(student.grade)}`}
                      value={student.grade}
                      onChange={(e) => handleGradeChange(student.studentId, e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Observaciones */}
                <div className="lg:col-span-4">
                  <div className="relative w-full">
                    <MessageSquare className="absolute left-0 top-1.5 w-4 h-4 text-blue-900/40" />
                    <input 
                      type="text" 
                      placeholder="Añadir comentario..."
                      className={`${inputClass} pl-6 text-sm py-1 border-b`}
                      value={student.observations}
                      onChange={(e) => handleObservationChange(student.studentId, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-12 flex flex-col items-center text-center text-blue-900/40">
                <Users className="w-12 h-12 mb-2 opacity-50" />
                <p className="font-bold text-lg">No hay alumnos matriculados en este grupo.</p>
              </div>
            )}
          </div>
        </div>

        {/* BOTÓN "SELLO" DE GUARDADO */}
        {gradesList.length > 0 && (
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
              {isSaving ? "Guardando Planilla..." : "Sellar Calificaciones"}
            </button>
          </div>
        )}

      </form>
    </div>
  );
};

export default TeacherGrades;