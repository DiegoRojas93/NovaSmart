import { useState } from "react";
import { FileText, Clock, Award, MessageSquare, CheckCircle2, ChevronDown, ChevronUp, Download, Eye, AlertCircle } from "lucide-react";

// --- INTERFACES ---
interface SubmittedTask {
  id: string;
  subject: string;
  title: string;
  submittedAt: string;
  fileName: string;
  status: "EN_REVISION" | "CALIFICADO";
  grade: number | null;
  feedback: string | null;
}

// --- DATOS SIMULADOS ---
const mockSubmittedTasks: SubmittedTask[] = [
  { 
    id: "ST1", 
    subject: "Física I", 
    title: "Taller de Cinemática 1D", 
    submittedAt: "20 de Julio, 14:30", 
    fileName: "Camilo_Fisica_Taller1.pdf",
    status: "CALIFICADO",
    grade: 4.5,
    feedback: "Excelente procedimiento. Solo tuviste un error menor en las unidades del punto 4, pero el concepto está claro."
  },
  { 
    id: "ST2", 
    subject: "Inglés", 
    title: "Essay: My Future Career", 
    submittedAt: "18 de Julio, 20:15", 
    fileName: "Essay_Camilo.docx",
    status: "CALIFICADO",
    grade: 2.8,
    feedback: "Faltó cumplir con el mínimo de 300 palabras y hay varios errores gramaticales con el uso del futuro (Will/Going to). Revisar la unidad 3."
  },
  { 
    id: "ST3", 
    subject: "Cálculo", 
    title: "Ejercicios de Límites", 
    submittedAt: "Hoy, 08:45", 
    fileName: "Limites_Solucion_Final.pdf",
    status: "EN_REVISION",
    grade: null,
    feedback: null
  },
];

const StudentSubmittedTasks = () => {
  // --- ESTADOS ---
  const [tasks] = useState<SubmittedTask[]>(mockSubmittedTasks);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(mockSubmittedTasks[0]?.id || null);
  const [filter, setFilter] = useState<"TODAS" | "CALIFICADAS" | "EN_REVISION">("TODAS");

  // --- LÓGICA DE FILTRADO ---
  const filteredTasks = tasks.filter(task => {
    if (filter === "CALIFICADAS") return task.status === "CALIFICADO";
    if (filter === "EN_REVISION") return task.status === "EN_REVISION";
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedTaskId(prev => prev === id ? null : id);
  };

  // --- CLASES CSS ESTILO CUADERNO ---
  const filterBtnClass = "px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all border-2";

  const getGradeStyle = (grade: number | null) => {
    if (grade === null) return "text-blue-900/40 bg-blue-900/5";
    if (grade >= 4.5) return "text-green-700 bg-green-100 border-green-200";
    if (grade >= 3.0) return "text-blue-700 bg-blue-100 border-blue-200";
    return "text-red-700 bg-red-100 border-red-200";
  };

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Historial de Entregas</h2>
        <p className="text-blue-900/70 font-medium">
          Consulta los trabajos que ya has enviado, confirma su estado y revisa las calificaciones de tus profesores.
        </p>
      </div>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-3 pb-4 border-b-2 border-blue-900/10">
        <button 
          onClick={() => setFilter("TODAS")}
          className={`${filterBtnClass} ${filter === "TODAS" ? "bg-blue-900 text-white border-blue-900 shadow-sm" : "bg-transparent border-blue-900/20 text-blue-900/60 hover:border-blue-900/50"}`}
        >
          Todas
        </button>
        <button 
          onClick={() => setFilter("CALIFICADAS")}
          className={`${filterBtnClass} ${filter === "CALIFICADAS" ? "bg-green-600 text-white border-green-600 shadow-sm" : "bg-transparent border-green-600/20 text-green-700/60 hover:border-green-600/50"}`}
        >
          Calificadas
        </button>
        <button 
          onClick={() => setFilter("EN_REVISION")}
          className={`${filterBtnClass} ${filter === "EN_REVISION" ? "bg-yellow-500 text-white border-yellow-500 shadow-sm" : "bg-transparent border-yellow-500/30 text-yellow-700/60 hover:border-yellow-500/60"}`}
        >
          En Revisión
        </button>
      </div>

      {/* LISTADO DE TAREAS */}
      <div className="flex flex-col gap-6 mt-2">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => {
          const isExpanded = expandedTaskId === task.id;

          return (
            <div 
              key={task.id} 
              className={`border-2 rounded-3xl bg-transparent transition-all overflow-hidden ${
                isExpanded ? "border-blue-900 shadow-[6px_6px_0_rgba(30,58,138,0.2)]" : "border-blue-900/20 hover:border-blue-900/50"
              }`}
            >
              {/* --- CABECERA DE LA TAREA (Clickeable) --- */}
              <div 
                onClick={() => toggleExpand(task.id)}
                className={`p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${
                  isExpanded ? "bg-blue-900/5" : "hover:bg-blue-900/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    task.status === "CALIFICADO" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {task.status === "CALIFICADO" ? <Award className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-900/10 text-blue-900">
                        {task.subject}
                      </span>
                      {task.status === "CALIFICADO" ? (
                        <span className="flex items-center gap-1 text-[10px] font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-md uppercase">
                          Calificado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-md uppercase">
                          En Revisión
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-blue-950 leading-tight mb-1">{task.title}</h3>
                    <p className="text-xs font-bold text-blue-900/50 uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Entregado: {task.submittedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t-2 border-blue-900/10 pt-4 md:border-0 md:pt-0">
                  {/* Vista Rápida de la Nota */}
                  {task.status === "CALIFICADO" && (
                    <div className="text-center md:text-right px-4">
                      <span className="block text-[10px] font-bold text-blue-900/50 uppercase tracking-widest">Nota</span>
                      <span className={`text-2xl font-black ${task.grade && task.grade >= 3.0 ? "text-green-600" : "text-red-600"}`}>
                        {task.grade?.toFixed(1)}
                      </span>
                    </div>
                  )}
                  
                  <button className="p-2 rounded-full bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* --- CONTENIDO EXPANDIDO (Feedback y Archivo) --- */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t-2 border-blue-900/10 border-dashed animate-in slide-in-from-top-2 duration-300">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Columna Izquierda: Feedback del Profesor */}
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Comentarios del Docente
                      </h4>
                      
                      {task.status === "CALIFICADO" ? (
                        <div className={`p-4 rounded-xl border-2 ${getGradeStyle(task.grade)} shadow-sm`}>
                          <p className="text-sm font-bold leading-relaxed">
                            {task.feedback}
                          </p>
                        </div>
                      ) : (
                        <div className="p-6 rounded-xl border-2 border-blue-900/10 border-dashed bg-white/50 text-center flex flex-col items-center">
                          <Clock className="w-8 h-8 text-blue-900/30 mb-2" />
                          <p className="text-sm font-bold text-blue-900/50">Tu profesor aún está revisando esta entrega.</p>
                        </div>
                      )}
                    </div>

                    {/* Columna Derecha: Archivo Entregado */}
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Tu Archivo Enviado
                      </h4>
                      
                      <div className="flex items-center justify-between p-4 bg-white border-2 border-blue-900/10 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                          <span className="font-bold text-sm text-blue-950 truncate" title={task.fileName}>
                            {task.fileName}
                          </span>
                        </div>
                        <button className="p-2 bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white rounded-lg transition-colors shrink-0" title="Descargar mi envío">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        }) : (
          <div className="py-16 flex flex-col items-center text-center text-blue-900/40 border-2 border-blue-900/10 border-dashed rounded-3xl">
            <AlertCircle className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-2xl font-black mb-1">Sin coincidencias</h3>
            <p className="font-medium max-w-sm">No tienes trabajos entregados que coincidan con este filtro.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentSubmittedTasks;