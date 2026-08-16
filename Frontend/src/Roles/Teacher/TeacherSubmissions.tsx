import { useState, useEffect, type FormEvent, useCallback } from "react";
import { Save, FileText, Download, Award, MessageSquare, Bell, CheckCircle2, AlertCircle, Search, Filter, BookOpen, RotateCcw } from "lucide-react";
import { ModalComponent } from "@/shared/Basics/ModalComponent"; 

// --- INTERFACES ---
interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  courseName: string;
  studentName: string;
  submittedAt: string;
  fileName: string; // En el backend, esto trae el file_url
  grade: number | "";
  feedback: string;
  status: "PENDIENTE" | "CALIFICADO";
}

interface Props {
  institutionId: number;
  teacherId: number;
}

const TeacherSubmissions = ({ institutionId, teacherId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS GLOBALES ---
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- ESTADOS DE LOS FILTROS ---
  const [filterCourse, setFilterCourse] = useState<string>("ALL");
  const [filterAssignment, setFilterAssignment] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterSearch, setFilterSearch] = useState<string>("");

  // --- ESTADOS DEL MODAL ---
  const [modalConfig, setModalConfig] = useState({
    isOpen: false, type: "success" as "success" | "error", title: "", message: "",
  });
  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  // --- EFECTO 1: CARGAR ENTREGAS DEL BACKEND ---
  const fetchSubmissions = useCallback(async () => {
    if (!institutionId || !teacherId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/teacher-submissions/${institutionId}/${teacherId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Aseguramos que los valores nulos vengan como strings vacíos para el formulario de React
        const formattedData = data.map((s: any) => ({
          ...s,
          grade: s.grade !== null ? s.grade : "",
          feedback: s.feedback || ""
        }));
        setSubmissions(formattedData);
      }
    } catch (error) {
      console.error("Error cargando entregas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [institutionId, teacherId, apiUrl]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // --- EFECTOS DE SINCRONIZACIÓN ---
  useEffect(() => {
    const count = submissions.filter(s => s.status === "PENDIENTE").length;
    setUnreadCount(count);
  }, [submissions]);

  useEffect(() => {
    // Si cambia el curso, reseteamos el filtro de la tarea
    setFilterAssignment("ALL");
  }, [filterCourse]);

  // --- DERIVADOS (Listas Únicas para los Menús Desplegables) ---
  const uniqueCourses = Array.from(
    new Map(submissions.map(s => [s.courseId, { id: s.courseId, name: s.courseName }])).values()
  );

  const availableAssignments = filterCourse === "ALL" 
    ? Array.from(new Map(submissions.map(s => [s.assignmentId, { id: s.assignmentId, title: s.assignmentTitle }])).values())
    : Array.from(new Map(submissions.filter(s => s.courseId === filterCourse).map(s => [s.assignmentId, { id: s.assignmentId, title: s.assignmentTitle }])).values());

  // --- APLICACIÓN DE FILTROS CASCADA ---
  const filteredSubmissions = submissions.filter(sub => {
    const matchCourse = filterCourse === "ALL" || sub.courseId === filterCourse;
    const matchAssignment = filterAssignment === "ALL" || sub.assignmentId === filterAssignment;
    const matchStatus = filterStatus === "ALL" || sub.status === filterStatus;
    const matchSearch = sub.studentName.toLowerCase().includes(filterSearch.toLowerCase()) || 
                        sub.assignmentTitle.toLowerCase().includes(filterSearch.toLowerCase());
    return matchCourse && matchAssignment && matchStatus && matchSearch;
  });

  // --- MANEJADORES ---
  const handleGradeChange = (submissionId: string, value: string) => {
    let numericValue: number | "" = parseFloat(value);
    if (value === "") numericValue = "";
    else if (numericValue > 5.0) numericValue = 5.0;
    else if (numericValue < 0) numericValue = 0;

    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, grade: numericValue } : s));
  };

  const handleFeedbackChange = (submissionId: string, text: string) => {
    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, feedback: text } : s));
  };

  // 1. REABRIR TAREA
  const handleReopen = async (submissionId: string, studentName: string) => {
    if (!window.confirm(`¿Está seguro de reabrir la entrega de ${studentName}? Esto borrará el archivo actual y el estudiante tendrá que volver a enviarlo.`)) {
      return;
    }
    
    try {
      const res = await fetch(`${apiUrl}/teacher-submissions/${institutionId}/reopen/${submissionId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      
      if (res.ok) {
        // Eliminamos la entrega de la pantalla porque volvió a estado PENDIENTE del lado del estudiante (ya no está entregada)
        setSubmissions(prev => prev.filter(s => s.id !== submissionId));
        setModalConfig({ isOpen: true, type: "success", title: "Entrega Reabierta", message: `El trabajo de ${studentName} fue eliminado y reabierto con éxito.` });
      } else {
        throw new Error("Fallo al reabrir");
      }
    } catch (error) {
      console.error("Error al reabrir:", error);
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "No se pudo reabrir la entrega." });
    }
  };

  // 2. GUARDAR NOTAS
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const submissionsToSave = filteredSubmissions.filter(s => s.grade !== "");

    if (submissionsToSave.length === 0) {
      setModalConfig({ isOpen: true, type: "error", title: "Atención", message: "No hay calificaciones válidas para publicar." });
      setIsSaving(false);
      return;
    }

    try {
      const payload = submissionsToSave.map(s => ({
        id: Number(s.id),
        grade: s.grade,
        feedback: s.feedback
      }));

      const res = await fetch(`${apiUrl}/teacher-submissions/${institutionId}/grade`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setModalConfig({ isOpen: true, type: "success", title: "¡Éxito!", message: "Calificaciones y comentarios guardados exitosamente." });
        setSubmissions(prev => prev.map(s => {
          const isBeingSaved = submissionsToSave.some(saveSub => saveSub.id === s.id);
          return isBeingSaved ? { ...s, status: "CALIFICADO" } : s;
        }));
      } else {
        throw new Error("Error al guardar calificaciones");
      }
    } catch (error) {
      console.error(error);
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "Hubo un problema al publicar las notas." });
    } finally {
      setIsSaving(false);
    }
  };

  // --- ESTILOS ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-2 font-bold transition-all appearance-none cursor-pointer truncate";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all";

  const pendingCount = filteredSubmissions.filter(s => s.status === "PENDIENTE").length;
  const gradedCount = filteredSubmissions.filter(s => s.status === "CALIFICADO").length;

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500 relative">
      
      {/* CABECERA */}
      <div className="mb-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-blue-900/20 pb-4">
        <div>
          <h2 className="text-3xl font-black text-blue-950 mb-2">Calificar Entregas</h2>
          <p className="text-blue-900/70 font-medium">
            Filtre, evalúe y publique las calificaciones de los trabajos enviados por sus estudiantes.
          </p>
        </div>

        <div className="relative p-3 bg-white border-2 border-blue-900/20 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="relative">
            <Bell className={`w-6 h-6 ${unreadCount > 0 ? "text-blue-900 animate-bounce" : "text-blue-900/40"}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-black text-white items-center justify-center">
                  {unreadCount}
                </span>
              </span>
            )}
          </div>
          <div className="text-sm font-bold text-blue-950 whitespace-nowrap">
            {unreadCount > 0 ? `${unreadCount} pendientes totales` : "Todo calificado"}
          </div>
        </div>
      </div>

      {/* --- PANEL DE FILTROS AVANZADOS --- */}
      <div className={bentoCardClass}>
        <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
          <Filter className="w-5 h-5 text-blue-900" />
          <h3 className="text-lg font-extrabold text-blue-950">Filtros de Búsqueda</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-end">
          <div>
            <label className="text-[11px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
              <BookOpen className="w-4 h-4"/> Curso / Grupo:
            </label>
            <select className={selectClass} value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
              <option value="ALL" className="bg-white">Todos los cursos</option>
              {uniqueCourses.map(c => <option key={c.id} value={c.id} className="bg-white">{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
              <FileText className="w-4 h-4"/> Tarea / Actividad:
            </label>
            <select className={selectClass} value={filterAssignment} onChange={(e) => setFilterAssignment(e.target.value)}>
              <option value="ALL" className="bg-white">Todas las tareas</option>
              {availableAssignments.map(a => <option key={a.id} value={a.id} className="bg-white">{a.title}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-4 h-4"/> Estado de Entrega:
            </label>
            <select className={selectClass} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="ALL" className="bg-white">Todas las entregas</option>
              <option value="PENDIENTE" className="bg-white text-yellow-700">Por Calificar</option>
              <option value="CALIFICADO" className="bg-white text-green-700">Ya Calificados</option>
            </select>
          </div>

          <div className="relative">
            <label className="text-[11px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
              <Search className="w-4 h-4"/> Buscar Estudiante o Tarea:
            </label>
            <div className="relative">
              <Search className="absolute left-0 top-2.5 w-4 h-4 text-blue-900/40" />
              <input 
                type="text" 
                placeholder="Ej: Álvarez, María..."
                className="w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 pl-6 font-bold transition-all"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- FORMULARIO Y LISTA DE ENTREGAS --- */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className={bentoCardClass}>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b-2 border-blue-900/80 pb-2">
            <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2 w-max">
              <FileText className="w-5 h-5"/> Entregas a Evaluar
            </h3>

            <div className="flex gap-4 p-2 bg-blue-900/5 rounded-xl border border-blue-900/10">
               <div className="text-center px-2">
                 <span className="block text-xl font-black text-blue-900">{pendingCount}</span>
                 <span className="text-[10px] uppercase font-bold text-blue-900/60">Por calificar</span>
               </div>
               <div className="w-px bg-blue-900/20"></div>
               <div className="text-center px-2">
                 <span className="block text-xl font-black text-green-600">{gradedCount}</span>
                 <span className="text-[10px] uppercase font-bold text-blue-900/60">Calificados</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {isLoading ? (
               <div className="py-12 flex flex-col items-center text-center text-blue-900/40 animate-pulse">
                 <FileText className="w-12 h-12 mb-2 opacity-50" />
                 <p className="font-bold text-lg">Cargando entregas...</p>
               </div>
            ) : filteredSubmissions.length > 0 ? filteredSubmissions.map((sub) => (
              <div 
                key={sub.id} 
                className={`flex flex-col xl:flex-row gap-4 p-5 rounded-2xl border-2 transition-colors ${
                  sub.status === "PENDIENTE" ? "border-blue-900/40 bg-white shadow-sm" : "border-green-900/20 bg-green-50/30 opacity-90"
                }`}
              >
                
                {/* Info del Estudiante y Archivo */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">{sub.courseName}</span>
                    <span className="text-[11px] font-bold text-blue-900/60 uppercase line-clamp-1">{sub.assignmentTitle}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-blue-950 text-lg">{sub.studentName}</h4>
                    {sub.status === "PENDIENTE" ? (
                      <span className="bg-yellow-100 text-yellow-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow-sm">Pendiente</span>
                    ) : (
                      <span className="bg-green-100 text-green-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow-sm">Calificado</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-blue-900/60 flex items-center gap-1">Entregado: {sub.submittedAt}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {sub.fileName ? (
                      <a 
                        href={`${apiUrl}/files/${sub.fileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-fit flex items-center gap-2 bg-blue-900/10 hover:bg-blue-900 hover:text-white text-blue-900 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                      >
                        <Download className="w-4 h-4" /> Ver Archivo Adjunto
                      </a>
                    ) : (
                       <span className="text-xs font-bold text-blue-900/40 italic px-2">Sin archivo adjunto</span>
                    )}

                    {/* BOTÓN DE REABRIR */}
                    <button 
                      type="button" 
                      onClick={() => handleReopen(sub.id, sub.studentName)}
                      className="w-fit flex items-center gap-2 bg-red-900/10 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
                      title="Reabrir entrega para que el estudiante vuelva a subirla"
                    >
                      <RotateCcw className="w-4 h-4" /> Reabrir
                    </button>
                  </div>
                </div>

                {/* Área de Calificación y Feedback */}
                <div className="xl:w-1/2 flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white/50 p-4 rounded-xl border border-blue-900/5">
                  
                  <div className="w-24 shrink-0 relative">
                    <Award className="absolute left-2 top-2 w-4 h-4 text-blue-900/40" />
                    <input 
                      type="number" 
                      step="0.1" min="1.0" max="5.0" placeholder="0.0"
                      className={`w-full bg-white border-2 border-dashed outline-none py-1.5 pl-8 pr-2 rounded-lg font-black text-center transition-all focus:border-solid shadow-sm ${
                        sub.grade !== "" && sub.grade >= 3.0 ? "border-green-500 text-green-900" : 
                        sub.grade !== "" && sub.grade < 3.0 ? "border-red-500 text-red-900" : 
                        "border-blue-900/30 focus:border-blue-900 text-blue-950"
                      }`}
                      value={sub.grade}
                      onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                    />
                    <span className="block text-center text-[10px] font-bold text-blue-900/50 mt-1 uppercase tracking-widest">Nota</span>
                  </div>

                  <div className="flex-1 w-full relative">
                    <MessageSquare className="absolute left-2 top-2 w-4 h-4 text-blue-900/40" />
                    <input 
                      type="text" 
                      placeholder="Retroalimentación al estudiante..."
                      className="w-full bg-white border-2 border-blue-900/10 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1.5 pl-8 pr-3 rounded-lg text-sm font-medium transition-all shadow-sm"
                      value={sub.feedback}
                      onChange={(e) => handleFeedbackChange(sub.id, e.target.value)}
                    />
                    <span className="block text-left text-[10px] font-bold text-blue-900/50 mt-1 uppercase tracking-widest">Comentarios (Opcional)</span>
                  </div>
                </div>

              </div>
            )) : (
              <div className="py-16 flex flex-col items-center text-center text-blue-900/40 bg-blue-900/5 border-2 border-blue-900/20 border-dashed rounded-3xl">
                <Search className="w-12 h-12 mb-3 opacity-50" />
                <p className="font-black text-xl">Sin resultados</p>
                <p className="text-sm font-medium mt-1">No se encontraron entregas que coincidan con los filtros aplicados.</p>
              </div>
            )}
          </div>
        </div>

        {/* BOTÓN "SELLO" DE GUARDADO */}
        {filteredSubmissions.length > 0 && (
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
              {isSaving ? "Guardando Notas..." : pendingCount > 0 ? "Publicar Notas" : "Actualizar Notas"}
            </button>
          </div>
        )}

      </form>

      {/* MODAL DE ALERTAS */}
      <ModalComponent isOpen={modalConfig.isOpen} onClose={closeModal} type={modalConfig.type} title={modalConfig.title} message={modalConfig.message} />
    </div>
  );
};

export default TeacherSubmissions;