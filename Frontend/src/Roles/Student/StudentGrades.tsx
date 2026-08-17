import { useState, useEffect, useCallback } from "react";
import { Award, BookOpen, TrendingUp, TrendingDown, MessageSquare, AlertTriangle, Search, Loader2 } from "lucide-react";

// --- INTERFACES ---
interface StudentGrade {
  id: string;
  subject: string;
  teacher: string;
  grade: number;
  observations: string | null;
}

interface Props {
  institutionId: number;
  studentId: number;
}

const StudentGrades = ({ institutionId, studentId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS ---
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [animateBars, setAnimateBars] = useState(false);

  // --- OBTENER DATOS DEL BACKEND ---
  const fetchGrades = useCallback(async () => {
    if (!institutionId || !studentId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/student-grades/${institutionId}/${studentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGrades(data);
      }
    } catch (error) {
      console.error("Error cargando el boletín:", error);
    } finally {
      setIsLoading(false);
      // Pequeño retraso para que las barras de progreso se animen desde cero
      setTimeout(() => setAnimateBars(true), 100);
    }
  }, [institutionId, studentId, apiUrl]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  // --- LÓGICA DE FILTRADO Y DERIVACIÓN DE DATOS ---
  const currentGrades = grades.filter(g => g.subject.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const calculateAverage = () => {
    if (grades.length === 0) return "0.0";
    const sum = grades.reduce((acc, curr) => acc + curr.grade, 0);
    return (sum / grades.length).toFixed(1);
  };

  const average = parseFloat(calculateAverage());
  const passedSubjects = grades.filter(g => g.grade >= 3.0).length;
  const failedSubjects = grades.length - passedSubjects;

  // --- ESTILOS DE NOTAS ---
  const getGradeStyle = (grade: number) => {
    if (grade >= 4.5) return { bg: "bg-green-100", border: "border-green-300", text: "text-green-800", label: "Excelente", bar: "bg-green-500" };
    if (grade >= 3.0) return { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800", label: "Aprobado", bar: "bg-blue-500" };
    return { bg: "bg-red-100", border: "border-red-300", text: "text-red-800", label: "Reprobado", bar: "bg-red-500" };
  };

  // --- PANTALLA DE CARGA ---
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-blue-900/50">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h3 className="text-xl font-black">Generando boletín...</h3>
        <p className="font-medium">Calculando tus promedios definitivos</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA (Animada) */}
      <div className="mb-2 border-b-4 border-blue-900/20 pb-4 flex flex-col gap-2">
        <h2 className="text-4xl font-black text-blue-950 mb-1 animate-in fade-in slide-in-from-left-4 duration-700">
          Mis Calificaciones
        </h2>
        <p className="text-blue-900/70 font-bold animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
          Consulta tu boletín oficial de notas definitivas y las observaciones de tus docentes correspondientes a este periodo académico.
        </p>
      </div>

      {grades.length > 0 ? (
        <>
          {/* --- SECCIÓN 1: KPIs GLOBALES DEL ESTUDIANTE --- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* KPI Promedio (Animación de entrada 1) */}
            <div className="border-2 border-blue-900/20 bg-white/50 rounded-2xl p-5 flex flex-col gap-1 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 animate-in fade-in zoom-in-95 fill-mode-both" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-black uppercase tracking-widest">Promedio General</span>
                <Award className={`w-5 h-5 ${average >= 4.0 ? "text-yellow-500" : average >= 3.0 ? "text-blue-500" : "text-red-500"}`} />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-blue-950">{average.toFixed(1)}</span>
                <span className="text-sm font-bold text-blue-900/50 mb-1">/ 5.0</span>
              </div>
            </div>

            {/* KPI Aprobadas (Animación de entrada 2) */}
            <div className="border-2 border-blue-900/20 bg-white/50 rounded-2xl p-5 flex flex-col gap-1 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 animate-in fade-in zoom-in-95 fill-mode-both" style={{ animationDelay: '200ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-black uppercase tracking-widest">Materias Aprobadas</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-green-700">{passedSubjects}</span>
                <span className="text-sm font-bold text-blue-900/50 mb-1">de {grades.length}</span>
              </div>
            </div>

            {/* KPI Reprobadas (Animación de entrada 3) */}
            <div className={`border-2 rounded-2xl p-5 flex flex-col gap-1 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 animate-in fade-in zoom-in-95 fill-mode-both ${failedSubjects > 0 ? "border-red-900/30 bg-red-50/50" : "border-blue-900/20 bg-white/50"}`} style={{ animationDelay: '300ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-black uppercase tracking-widest">En Riesgo (Reprobadas)</span>
                {failedSubjects > 0 ? <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" /> : <TrendingDown className="w-5 h-5 text-blue-900/30" />}
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-4xl font-black ${failedSubjects > 0 ? "text-red-700" : "text-blue-950"}`}>{failedSubjects}</span>
                <span className="text-sm font-bold text-blue-900/50 mb-1">materias</span>
              </div>
            </div>

          </div>

          {/* --- SECCIÓN 2: DETALLE DE MATERIAS (BOLETÍN) --- */}
          <div className="border-2 border-blue-900/30 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative shadow-sm">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-blue-900/10 pb-4 mb-2">
              <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2">
                <BookOpen className="w-5 h-5"/> Boletín Detallado
              </h3>
              
              {/* Buscador de Materias */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-blue-900/40 peer-focus:text-blue-900 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filtrar por materia..."
                  className="peer w-full bg-white border-2 border-blue-900/20 focus:border-blue-900 outline-none text-blue-950 py-2 pl-9 pr-3 rounded-xl text-sm font-bold transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {currentGrades.length > 0 ? currentGrades.map((record, idx) => {
                const style = getGradeStyle(record.grade);
                const percentage = (record.grade / 5.0) * 100;

                return (
                  <div 
                    key={record.id} 
                    className="flex flex-col md:flex-row gap-6 p-4 md:p-5 border-2 border-blue-900/10 rounded-2xl bg-white hover:border-blue-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-in slide-in-from-bottom-4 fill-mode-both"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    
                    {/* Nota Central (Destacada a la izquierda) */}
                    <div className="flex flex-row md:flex-col items-center justify-between md:justify-center w-full md:w-32 shrink-0 md:border-r-2 border-blue-900/5 md:pr-6">
                      <div className="flex flex-col items-start md:items-center">
                        <span className={`text-4xl font-black leading-none ${style.text}`}>{record.grade.toFixed(1)}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-md border ${style.bg} ${style.border} ${style.text}`}>
                          {style.label}
                        </span>
                      </div>

                      {/* Mini Barra de Progreso Circular/Lineal */}
                      <div className="w-24 md:w-full mt-0 md:mt-3 flex items-center justify-end md:justify-center">
                        <div className="w-full h-2 bg-blue-900/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${style.bar}`} 
                            style={{ width: animateBars ? `${percentage}%` : '0%' }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Información de la materia y observaciones */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h4 className="text-xl font-black text-blue-950">{record.subject}</h4>
                        <span className="text-xs font-bold text-blue-900/60 uppercase tracking-widest bg-blue-900/5 px-2 py-1 rounded-md w-fit border border-blue-900/10">
                          Prof. {record.teacher}
                        </span>
                      </div>
                      
                      <div className="flex gap-3 items-start bg-blue-900/5 p-4 rounded-xl border border-blue-900/10 shadow-sm mt-1">
                        <MessageSquare className="w-5 h-5 text-blue-900/40 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-blue-950/80 leading-relaxed italic">
                          "{record.observations || "Sin observaciones registradas."}"
                        </p>
                      </div>
                    </div>

                  </div>
                );
              }) : (
                <div className="py-12 flex flex-col items-center text-center text-blue-900/40 border-2 border-blue-900/20 border-dashed rounded-3xl bg-blue-900/5 animate-in zoom-in-95">
                  <Search className="w-12 h-12 mb-3 opacity-50" />
                  <p className="font-black text-xl">Sin resultados</p>
                  <p className="text-sm font-medium mt-1">No tienes materias que coincidan con la búsqueda.</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* --- ESTADO VACÍO (Sin notas en absoluto) --- */
        <div className="py-20 flex flex-col items-center text-center text-blue-900/40 border-2 border-blue-900/10 border-dashed rounded-3xl mt-4 bg-white/30 animate-in zoom-in-95">
          <Award className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-2xl font-black mb-1">Boletín no disponible</h3>
          <p className="font-medium max-w-md">Aún no hay calificaciones definitivas publicadas para este periodo académico.</p>
        </div>
      )}

    </div>
  );
};

export default StudentGrades;