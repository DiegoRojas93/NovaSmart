import { useState, useEffect, useCallback } from "react";
import { FileText, Clock, Award, MessageSquare, CheckCircle2, ChevronDown, ChevronUp, Download, Eye, AlertCircle, Search, User, BookOpen, Loader2 } from "lucide-react";

// --- INTERFACES ---
interface SubmittedTask {
  id: string;
  subject: string;
  title: string;
  teacher: string;
  photo?: string;
  submittedAt: string;
  fileName: string;
  status: "EN_REVISION" | "CALIFICADO";
  grade: number | null;
  feedback: string | null;
}

interface Props {
  institutionId: number;
  studentId: number;
}

const StudentSubmittedTasks = ({ institutionId, studentId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS ---
  const [tasks, setTasks] = useState<SubmittedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  // Estados de Filtros
  const [filterStatus, setFilterStatus] = useState<"TODAS" | "CALIFICADAS" | "EN_REVISION">("TODAS");
  const [filterSubject, setFilterSubject] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // --- OBTENER DATOS DEL BACKEND ---
  const fetchTasks = useCallback(async () => {
    if (!institutionId || !studentId) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/student-submitted-tasks/${institutionId}/${studentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
        // Opcional: Expandir automáticamente la primera tarea si existe
        if (data.length > 0) {
          setExpandedTaskId(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error cargando el historial de tareas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [institutionId, studentId, apiUrl]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- DERIVADOS ---
  // Extraemos las materias únicas para la lista desplegable
  const uniqueSubjects = Array.from(new Set(tasks.map(t => t.subject)));

  // --- LÓGICA DE FILTRADO COMBINADO ---
  const filteredTasks = tasks.filter(task => {
    // 1. Filtro por Estado
    const matchesStatus = 
      filterStatus === "TODAS" ? true :
      filterStatus === "CALIFICADAS" ? task.status === "CALIFICADO" :
      task.status === "EN_REVISION";

    // 2. Filtro por Materia
    const matchesSubject = filterSubject === "ALL" ? true : task.subject === filterSubject;

    // 3. Búsqueda por Nombre de Tarea, Profesor o Archivo
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      task.title.toLowerCase().includes(term) ||
      task.teacher.toLowerCase().includes(term) ||
      (task.fileName && task.fileName.toLowerCase().includes(term));

    return matchesStatus && matchesSubject && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedTaskId(prev => prev === id ? null : id);
  };

  const getPhotoUrl = (photo?: string) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    return `${apiUrl}/files/${photo}`;
  };

  // --- ESTILOS COMPARTIDOS ---
  const filterBtnClass = "px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all border-2";

  const getGradeStyle = (grade: number | null) => {
    if (grade === null) return "text-blue-900/60 bg-blue-900/5 border-blue-900/20";
    if (grade >= 4.5) return "text-green-700 bg-green-500/10 border-green-500/30";
    if (grade >= 3.0) return "text-blue-700 bg-blue-500/10 border-blue-500/30";
    return "text-red-700 bg-red-500/10 border-red-500/30";
  };

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2 border-b-4 border-blue-900/20 pb-4">
        <h2 className="text-4xl font-black text-blue-950 mb-1 animate-in fade-in slide-in-from-left-4 duration-700">
          Historial de Entregas
        </h2>
        <p className="text-blue-900/70 font-bold animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
          Consulta los trabajos que ya has enviado, confirma su estado y revisa la retroalimentación de tus profesores.
        </p>
      </div>

      {/* PANEL DE BUSCADOR Y FILTROS AVANZADOS */}
      <div className="border-2 border-blue-900/30 rounded-3xl p-5 bg-transparent shadow-sm flex flex-col gap-4">
        
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          {/* BUSCADOR */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-blue-900/40 peer-focus:text-blue-900 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar por trabajo, profesor o archivo..."
              className="peer w-full bg-transparent border-2 border-blue-900/20 focus:border-blue-900 outline-none text-blue-950 py-2 pl-9 pr-3 rounded-xl text-sm font-bold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* FILTRO POR MATERIA */}
          <div className="relative w-full md:w-64 shrink-0">
            <BookOpen className="absolute left-3 top-2.5 w-4 h-4 text-blue-900/40" />
            <select 
              className="w-full bg-transparent border-2 border-blue-900/20 focus:border-blue-900 outline-none text-blue-950 py-2 pl-9 pr-3 rounded-xl text-sm font-bold transition-all appearance-none cursor-pointer"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="ALL" className="bg-white">Todas las Materias</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject} className="bg-white">{subject}</option>
              ))}
            </select>
          </div>
        </div>

        {/* BOTONES DE ESTADO */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-blue-900/10">
          <button 
            onClick={() => setFilterStatus("TODAS")}
            className={`${filterBtnClass} ${filterStatus === "TODAS" ? "bg-blue-900 text-white border-blue-900 shadow-sm" : "bg-transparent border-blue-900/20 text-blue-900/60 hover:border-blue-900/50"}`}
          >
            Todas
          </button>
          <button 
            onClick={() => setFilterStatus("CALIFICADAS")}
            className={`${filterBtnClass} ${filterStatus === "CALIFICADAS" ? "bg-green-600 text-white border-green-600 shadow-sm" : "bg-transparent border-green-600/30 text-green-700 hover:border-green-600"}`}
          >
            Calificadas
          </button>
          <button 
            onClick={() => setFilterStatus("EN_REVISION")}
            className={`${filterBtnClass} ${filterStatus === "EN_REVISION" ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-transparent border-amber-500/30 text-amber-700 hover:border-amber-500"}`}
          >
            En Revisión
          </button>
        </div>
      </div>

      {/* LISTADO DE TAREAS ANIMADO */}
      <div className="flex flex-col gap-6 mt-2">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center text-center text-blue-900/50">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <h3 className="text-xl font-black">Cargando entregas...</h3>
            <p className="font-medium">Buscando tu historial de trabajos</p>
          </div>
        ) : filteredTasks.length > 0 ? filteredTasks.map((task, idx) => {
          const isExpanded = expandedTaskId === task.id;

          return (
            <div 
              key={task.id} 
              className={`border-2 rounded-3xl bg-transparent transition-all duration-300 overflow-hidden animate-in slide-in-from-bottom-4 fill-mode-both hover:-translate-y-1 ${
                isExpanded 
                  ? "border-blue-900 shadow-[6px_6px_0_rgba(30,58,138,0.15)]" 
                  : "border-blue-900/30 hover:border-blue-900/60"
              }`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* --- CABECERA DE LA TAREA (Clickeable) --- */}
              <div 
                onClick={() => toggleExpand(task.id)}
                className={`p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${
                  isExpanded ? "bg-blue-900/5" : "hover:bg-blue-900/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  
                  {/* Ícono de Estado */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    task.status === "CALIFICADO" ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}>
                    {task.status === "CALIFICADO" ? <Award className="w-6 h-6" /> : <Eye className="w-6 h-6 animate-pulse" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-900/10 text-blue-900 border border-blue-900/20">
                        {task.subject}
                      </span>
                      {task.status === "CALIFICADO" ? (
                        <span className="flex items-center gap-1 text-[10px] font-black text-green-700 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-md uppercase">
                          Calificado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md uppercase">
                          En Revisión
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-blue-950 leading-tight mb-2">{task.title}</h3>
                    
                    {/* Profesor y Fecha */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-blue-900/60">
                      <div className="flex items-center gap-1.5">
                        {task.photo ? (
                          <img src={getPhotoUrl(task.photo)!} alt={task.teacher} className="w-5 h-5 rounded-full border border-blue-900/20 object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-blue-900/40" />
                        )}
                        <span>Prof. {task.teacher}</span>
                      </div>
                      
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 opacity-60" /> Entregado: {task.submittedAt}
                      </span>
                    </div>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Feedback del Profesor */}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-900" /> Comentarios del Docente
                      </h4>
                      
                      {task.status === "CALIFICADO" ? (
                        <div className={`p-4 rounded-2xl border-2 ${getGradeStyle(task.grade)} shadow-sm`}>
                          <p className="text-sm font-bold leading-relaxed">
                            {task.feedback}
                          </p>
                        </div>
                      ) : (
                        <div className="p-5 rounded-2xl border-2 border-blue-900/20 border-dashed bg-blue-900/5 text-center flex flex-col items-center justify-center">
                          <Clock className="w-8 h-8 text-blue-900/30 mb-1" />
                          <p className="text-xs font-bold text-blue-900/60">Tu profesor aún está revisando esta entrega.</p>
                        </div>
                      )}
                    </div>

                    {/* Archivo Entregado */}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-900" /> Tu Archivo Enviado
                      </h4>
                      
                      <div className="flex items-center justify-between p-4 border-2 border-blue-900/20 bg-blue-900/5 rounded-2xl shadow-sm hover:border-blue-900/40 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                          <span className="font-bold text-sm text-blue-950 truncate" title={task.fileName}>
                            {task.fileName || "Archivo adjunto"}
                          </span>
                        </div>
                        {task.fileName && (
                          <a 
                            href={`${apiUrl}/files/${task.fileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white rounded-xl transition-all shrink-0 shadow-sm" 
                            title="Descargar mi envío"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        }) : (
          <div className="py-16 flex flex-col items-center text-center text-blue-900/40 border-2 border-blue-900/20 border-dashed rounded-3xl bg-blue-900/5 animate-in zoom-in-95">
            <AlertCircle className="w-16 h-16 mb-3 opacity-50" />
            <h3 className="text-2xl font-black mb-1">Sin coincidencias</h3>
            <p className="font-medium max-w-sm">No encontramos trabajos entregados que coincidan con los filtros aplicados.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentSubmittedTasks;