import { useState } from "react";
import { Award, BookOpen, Calendar, TrendingUp, TrendingDown, MessageSquare, AlertTriangle, UserCircle, ChevronDown, ChevronUp, FileText, UserX, Clock } from "lucide-react";

// --- INTERFACES ---
interface TaskDetail {
  id: string;
  title: string;
  grade: number | null;
  date: string;
}

interface AttendanceDetail {
  id: string;
  date: string;
  type: "AUSENTE" | "LLEGO_TARDE";
}

interface StudentGrade {
  id: string;
  subject: string;
  teacher: string;
  grade: number;
  observations: string | null;
  tasks: TaskDetail[];
  absences: AttendanceDetail[];
}

// --- DATOS SIMULADOS ---
const mockChildren = [
  { id: "ST1", name: "Camilo Andrés Gómez Silva", course: "1101" },
  { id: "ST2", name: "Ana Sofía Gómez Silva", course: "802" }
];

const mockPeriods = [
  { id: "P1", name: "Primer Periodo (2026-I)" },
  { id: "P2", name: "Segundo Periodo (2026-I)" },
];

const mockGradesDb: Record<string, Record<string, StudentGrade[]>> = {
  "ST1": {
    "P1": [
      { 
        id: "G1", subject: "Cálculo", teacher: "Luis Fernando Ramírez", grade: 4.2, observations: "Buen desempeño y participación en clase.",
        tasks: [
          { id: "T1", title: "Taller de Funciones", grade: 4.5, date: "15 Jul" },
          { id: "T2", title: "Quiz de Límites", grade: 3.8, date: "22 Jul" }
        ],
        absences: []
      },
      { 
        id: "G2", subject: "Física I", teacher: "Carlos Pérez", grade: 3.5, observations: "Aprobado, pero debe mejorar en la entrega puntual de trabajos.",
        tasks: [
          { id: "T3", title: "Laboratorio Cinemática", grade: 4.0, date: "10 Jul" },
          { id: "T4", title: "Taller Vectores", grade: 2.0, date: "18 Jul" } // Aquí el padre ve por qué bajó la nota
        ],
        absences: [
          { id: "A1", date: "12 Jul", type: "AUSENTE" }
        ]
      },
      { 
        id: "G4", subject: "Inglés", teacher: "Ana Gómez", grade: 2.5, observations: "Reprueba el periodo por inasistencias y no presentar el examen final.",
        tasks: [
          { id: "T5", title: "Reading Comprehension", grade: 3.0, date: "05 Jul" },
          { id: "T6", title: "Examen Final", grade: 1.0, date: "25 Jul" }
        ],
        absences: [
          { id: "A2", date: "08 Jul", type: "LLEGO_TARDE" },
          { id: "A3", date: "14 Jul", type: "AUSENTE" },
          { id: "A4", date: "20 Jul", type: "AUSENTE" }
        ]
      },
    ],
    "P2": []
  },
  "ST2": {
    "P1": [
      { 
        id: "G5", subject: "Matemáticas", teacher: "Pedro Gómez", grade: 2.8, observations: "Se distrae fácilmente en clase.",
        tasks: [{ id: "T7", title: "Taller Álgebra", grade: 2.8, date: "12 Jul" }],
        absences: []
      }
    ],
    "P2": []
  }
};

const GuardianGrades = () => {
  // --- ESTADOS ---
  const [selectedStudentId, setSelectedStudentId] = useState<string>(mockChildren[0].id);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(mockPeriods[0].id);
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);

  // --- DERIVACIÓN DE DATOS ---
  const currentGrades = mockGradesDb[selectedStudentId]?.[selectedPeriod] || [];
  
  const calculateAverage = () => {
    if (currentGrades.length === 0) return 0;
    const sum = currentGrades.reduce((acc, curr) => acc + curr.grade, 0);
    return (sum / currentGrades.length).toFixed(1);
  };

  const average = parseFloat(calculateAverage() as string);
  const passedSubjects = currentGrades.filter(g => g.grade >= 3.0).length;
  const failedSubjects = currentGrades.length - passedSubjects;
  const selectedStudent = mockChildren.find(c => c.id === selectedStudentId);

  const toggleExpand = (id: string) => {
    setExpandedSubjectId(prev => prev === id ? null : id);
  };

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const selectClass = "w-full sm:w-auto bg-white border-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 px-4 py-2 font-black rounded-xl transition-all appearance-none cursor-pointer";

  const getGradeStyle = (grade: number) => {
    if (grade >= 4.5) return { bg: "bg-green-100", border: "border-green-300", text: "text-green-800", label: "Excelente" };
    if (grade >= 3.0) return { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800", label: "Aprobado" };
    return { bg: "bg-red-100", border: "border-red-300", text: "text-red-800", label: "Reprobado" };
  };

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2 border-b-4 border-blue-900/20 pb-4">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Seguimiento Académico</h2>
        <p className="text-blue-900/70 font-medium">
          Seleccione a su acudido para consultar sus notas definitivas. Haga clic en cada materia para ver el detalle de tareas y asistencia.
        </p>
      </div>

      {/* CONTROLES DE SELECCIÓN */}
      <div className="flex flex-col sm:flex-row gap-4 mb-2 bg-blue-900/5 p-4 rounded-2xl border border-blue-900/10">
        <div className="flex-1">
          <label className="text-[11px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
            <UserCircle className="w-4 h-4"/> Seleccionar Estudiante:
          </label>
          <select 
            className={`${selectClass} w-full`} 
            value={selectedStudentId} 
            onChange={(e) => { setSelectedStudentId(e.target.value); setExpandedSubjectId(null); }}
          >
            {mockChildren.map(child => <option key={child.id} value={child.id}>{child.name} (Curso {child.course})</option>)}
          </select>
        </div>
        
        <div className="sm:w-1/3">
          <label className="text-[11px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
            <Calendar className="w-4 h-4"/> Periodo:
          </label>
          <select 
            className={`${selectClass} w-full`} 
            value={selectedPeriod} 
            onChange={(e) => { setSelectedPeriod(e.target.value); setExpandedSubjectId(null); }}
          >
            {mockPeriods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {currentGrades.length > 0 ? (
        <>
          {/* --- SECCIÓN 1: KPIs DEL PERIODO --- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border-2 border-blue-900/20 bg-white/50 rounded-2xl p-5 flex flex-col gap-1 transition-colors">
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest">Promedio General</span>
                <Award className={`w-5 h-5 ${average >= 4.0 ? "text-yellow-500" : average >= 3.0 ? "text-blue-500" : "text-red-500"}`} />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-blue-950">{average}</span>
                <span className="text-sm font-bold text-blue-900/50 mb-1">/ 5.0</span>
              </div>
            </div>

            <div className={`border-2 rounded-2xl p-5 flex flex-col gap-1 transition-colors ${failedSubjects > 0 ? "border-red-900/30 bg-red-50/50" : "border-blue-900/20 bg-white/50"}`}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest">En Riesgo (Reprobadas)</span>
                {failedSubjects > 0 ? <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" /> : <TrendingDown className="w-5 h-5 text-blue-900/30" />}
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-4xl font-black ${failedSubjects > 0 ? "text-red-700" : "text-blue-950"}`}>{failedSubjects}</span>
                <span className="text-sm font-bold text-blue-900/50 mb-1">materias</span>
              </div>
            </div>
          </div>

          {/* --- SECCIÓN 2: DETALLE DE MATERIAS (ACORDEÓN) --- */}
          <div className={bentoCardClass}>
            <div className="flex justify-between items-center border-b-2 border-blue-900/80 pb-2 mb-4">
              <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2">
                <BookOpen className="w-5 h-5"/> Desglose por Materias
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {currentGrades.map((record) => {
                const style = getGradeStyle(record.grade);
                const isExpanded = expandedSubjectId === record.id;
                const totalAbsences = record.absences.length;

                return (
                  <div key={record.id} className={`flex flex-col border-2 rounded-2xl transition-all overflow-hidden ${isExpanded ? "border-blue-900/40 bg-white shadow-md" : "border-blue-900/10 bg-white/40 hover:border-blue-900/30"}`}>
                    
                    {/* CABECERA DE LA MATERIA (Clickeable) */}
                    <div 
                      onClick={() => toggleExpand(record.id)}
                      className="flex flex-col md:flex-row gap-4 p-4 cursor-pointer items-center justify-between"
                    >
                      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto flex-1">
                        {/* Nota Principal */}
                        <div className={`flex flex-col items-center justify-center w-full md:w-20 shrink-0 py-2 rounded-xl border-2 ${style.bg} ${style.border}`}>
                          <span className={`text-2xl font-black ${style.text}`}>{record.grade.toFixed(1)}</span>
                        </div>

                        {/* Info Materia */}
                        <div className="flex-1 w-full text-center md:text-left">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1 justify-center md:justify-start">
                            <h4 className="text-lg font-black text-blue-950">{record.subject}</h4>
                            <span className="text-[10px] font-bold text-blue-900/60 uppercase tracking-widest bg-blue-900/5 px-2 py-0.5 rounded-md">
                              Prof. {record.teacher}
                            </span>
                          </div>
                          
                          {/* Mini indicadores de alertas */}
                          <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
                            {totalAbsences > 0 && (
                              <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-md">
                                <UserX className="w-3 h-3" /> {totalAbsences} Falla{totalAbsences > 1 ? 's' : ''}
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-blue-900/50 flex items-center gap-1">
                              <FileText className="w-3 h-3" /> {record.tasks.length} Entregables
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="p-2 rounded-full bg-blue-900/5 text-blue-900 hover:bg-blue-900 hover:text-white transition-colors hidden md:block shrink-0">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* CONTENIDO DESPLEGABLE (Tareas y Asistencia) */}
                    {isExpanded && (
                      <div className="p-4 md:p-6 border-t-2 border-blue-900/10 bg-blue-50/30 animate-in slide-in-from-top-2 duration-300">
                        
                        {/* Observación del profesor */}
                        <div className="flex gap-2 items-start bg-white p-3 rounded-xl border border-blue-900/10 shadow-sm mb-6">
                          <MessageSquare className="w-4 h-4 text-blue-900/40 mt-0.5 shrink-0" />
                          <p className="text-sm font-medium text-blue-950/80 italic">
                            <strong className="not-italic text-blue-900 font-bold block mb-1 text-xs uppercase">Observación General del Periodo:</strong>
                            {record.observations || "Sin observaciones registradas."}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          
                          {/* Columna 1: Tareas / Notas parciales */}
                          <div>
                            <h5 className="text-xs font-black text-blue-900/70 uppercase tracking-widest mb-3 flex items-center gap-2 border-b-2 border-blue-900/10 pb-1">
                              <FileText className="w-4 h-4" /> Trabajos Evaluados
                            </h5>
                            <div className="flex flex-col gap-2">
                              {record.tasks.length > 0 ? record.tasks.map(task => (
                                <div key={task.id} className="flex items-center justify-between bg-white p-2 px-3 rounded-lg border border-blue-900/10">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-blue-950">{task.title}</span>
                                    <span className="text-[10px] font-bold text-blue-900/40">{task.date}</span>
                                  </div>
                                  <span className={`text-sm font-black px-2 py-1 rounded-md ${task.grade && task.grade >= 3.0 ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"}`}>
                                    {task.grade ? task.grade.toFixed(1) : "N/A"}
                                  </span>
                                </div>
                              )) : (
                                <p className="text-xs font-bold text-blue-900/40 italic">No hay notas de trabajos registrados.</p>
                              )}
                            </div>
                          </div>

                          {/* Columna 2: Asistencia */}
                          <div>
                            <h5 className="text-xs font-black text-blue-900/70 uppercase tracking-widest mb-3 flex items-center gap-2 border-b-2 border-blue-900/10 pb-1">
                              <UserX className="w-4 h-4" /> Registro de Novedades (Fallas)
                            </h5>
                            <div className="flex flex-col gap-2">
                              {record.absences.length > 0 ? record.absences.map(abs => (
                                <div key={abs.id} className="flex items-center gap-3 bg-white p-2 px-3 rounded-lg border border-red-900/10">
                                  {abs.type === "AUSENTE" ? (
                                    <UserX className="w-4 h-4 text-red-500 shrink-0" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
                                  )}
                                  <div className="flex flex-col">
                                    <span className="text-xs font-black text-blue-950 uppercase">{abs.type === "AUSENTE" ? "Inasistencia" : "Llegada Tarde"}</span>
                                    <span className="text-[10px] font-bold text-blue-900/50">{abs.date}</span>
                                  </div>
                                </div>
                              )) : (
                                <div className="flex items-center gap-2 bg-green-50/50 p-2 px-3 rounded-lg border border-green-900/10 text-green-700">
                                  <span className="text-xs font-bold">Sin novedades de asistencia.</span>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* --- ESTADO VACÍO --- */
        <div className="py-20 flex flex-col items-center text-center text-blue-900/40 border-2 border-blue-900/10 border-dashed rounded-3xl mt-4 bg-white/30">
          <Award className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-2xl font-black mb-1">Sin información</h3>
          <p className="font-medium max-w-md">No hay calificaciones registradas para {selectedStudent?.name.split(" ")[0]} en este periodo.</p>
        </div>
      )}

    </div>
  );
};

export default GuardianGrades;