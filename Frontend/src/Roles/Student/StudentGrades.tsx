import { useState } from "react";
import { Award, BookOpen, Calendar, TrendingUp, TrendingDown, MessageSquare, AlertTriangle } from "lucide-react";

// --- INTERFACES ---
interface StudentGrade {
  id: string;
  subject: string;
  teacher: string;
  grade: number;
  observations: string | null;
}

// --- DATOS SIMULADOS ---
const mockPeriods = [
  { id: "P1", name: "Primer Periodo (2026-I)" },
  { id: "P2", name: "Segundo Periodo (2026-I)" },
];

const mockGradesDb: Record<string, StudentGrade[]> = {
  "P1": [
    { id: "G1", subject: "Cálculo", teacher: "Luis Fernando Ramírez", grade: 4.2, observations: "Buen desempeño y participación en clase." },
    { id: "G2", subject: "Física I", teacher: "Carlos Pérez", grade: 3.5, observations: "Aprobado, pero debe mejorar en la entrega puntual de trabajos." },
    { id: "G3", subject: "Química", teacher: "Martha Silva", grade: 4.8, observations: "Excelente nivel académico, felicitaciones." },
    { id: "G4", subject: "Inglés", teacher: "Ana Gómez", grade: 2.5, observations: "Reprueba el periodo por inasistencias y no presentar el examen final." },
  ],
  "P2": [
    // Simulación de un periodo que apenas está comenzando (sin notas definitivas aún)
  ]
};

const StudentGrades = () => {
  // --- ESTADOS ---
  const [selectedPeriod, setSelectedPeriod] = useState<string>(mockPeriods[0].id);

  // --- DERIVACIÓN DE DATOS ---
  const currentGrades = mockGradesDb[selectedPeriod] || [];
  
  const calculateAverage = () => {
    if (currentGrades.length === 0) return 0;
    const sum = currentGrades.reduce((acc, curr) => acc + curr.grade, 0);
    return (sum / currentGrades.length).toFixed(1);
  };

  const average = parseFloat(calculateAverage() as string);
  const passedSubjects = currentGrades.filter(g => g.grade >= 3.0).length;
  const failedSubjects = currentGrades.length - passedSubjects;

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const selectClass = "w-full sm:w-auto bg-white border-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 px-4 py-2 font-black rounded-xl transition-all appearance-none cursor-pointer";

  // --- ESTILOS DE NOTAS ---
  const getGradeStyle = (grade: number) => {
    if (grade >= 4.5) return { bg: "bg-green-100", border: "border-green-300", text: "text-green-800", label: "Excelente" };
    if (grade >= 3.0) return { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800", label: "Aprobado" };
    return { bg: "bg-red-100", border: "border-red-300", text: "text-red-800", label: "Reprobado" };
  };

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA Y SELECTOR DE PERIODO */}
      <div className="mb-2 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-blue-900/20 pb-4">
        <div>
          <h2 className="text-3xl font-black text-blue-950 mb-2">Mis Calificaciones</h2>
          <p className="text-blue-900/70 font-medium">
            Consulta tu boletín oficial de notas definitivas y las observaciones de tus docentes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-900/50" />
          <select 
            className={selectClass} 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
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

            <div className="border-2 border-blue-900/20 bg-white/50 rounded-2xl p-5 flex flex-col gap-1 transition-colors">
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest">Materias Aprobadas</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-green-700">{passedSubjects}</span>
                <span className="text-sm font-bold text-blue-900/50 mb-1">de {currentGrades.length}</span>
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

          {/* --- SECCIÓN 2: DETALLE DE MATERIAS --- */}
          <div className={bentoCardClass}>
            <div className="flex justify-between items-center border-b-2 border-blue-900/80 pb-1 mb-4">
              <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2">
                <BookOpen className="w-5 h-5"/> Boletín Detallado
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {currentGrades.map((record) => {
                const style = getGradeStyle(record.grade);

                return (
                  <div key={record.id} className="flex flex-col md:flex-row gap-4 p-4 border-2 border-blue-900/10 rounded-2xl bg-white/40 hover:bg-white/80 transition-colors">
                    
                    {/* Nota (Destacada a la izquierda) */}
                    <div className={`flex flex-col items-center justify-center w-full md:w-28 shrink-0 p-3 rounded-xl border-2 ${style.bg} ${style.border}`}>
                      <span className={`text-3xl font-black ${style.text}`}>{record.grade.toFixed(1)}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${style.text}`}>{style.label}</span>
                    </div>

                    {/* Información de la materia y observaciones */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h4 className="text-lg font-black text-blue-950">{record.subject}</h4>
                        <span className="text-xs font-bold text-blue-900/60 uppercase tracking-widest bg-blue-900/5 px-2 py-1 rounded-md w-fit">
                          Prof. {record.teacher}
                        </span>
                      </div>
                      
                      <div className="flex gap-2 items-start bg-white p-3 rounded-xl border border-blue-900/10 shadow-sm mt-1">
                        <MessageSquare className="w-4 h-4 text-blue-900/40 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-blue-950/80 italic">
                          {record.observations || "Sin observaciones registradas."}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* --- ESTADO VACÍO (Sin notas en el periodo) --- */
        <div className="py-20 flex flex-col items-center text-center text-blue-900/40 border-2 border-blue-900/10 border-dashed rounded-3xl mt-4 bg-white/30">
          <Award className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-2xl font-black mb-1">Boletín no disponible</h3>
          <p className="font-medium max-w-md">Aún no hay calificaciones definitivas publicadas para este periodo académico.</p>
        </div>
      )}

    </div>
  );
};

export default StudentGrades;