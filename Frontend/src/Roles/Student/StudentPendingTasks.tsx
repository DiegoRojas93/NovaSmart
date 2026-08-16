import { useState, useEffect, type ChangeEvent, type FormEvent, useCallback } from "react";
import { FileText, Clock, AlertCircle, UploadCloud, Send, ChevronDown, ChevronUp, BookOpen, CheckCircle2, Download, Filter } from "lucide-react";
import { ModalComponent } from "@/shared/Basics/ModalComponent"; // Asegúrate de tener la ruta correcta

// --- INTERFACES ---
interface CourseSubject {
  id: string; 
  name: string; 
  teacher: string;
}

interface TeacherAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
}

interface PendingTask {
  id: string; // ID de la actividad (class_activities.id)
  courseSubjectId: string;
  subjectName: string;
  teacherName: string;
  title: string;
  description: string;
  dueDate: string;
  isUrgent: boolean; // Calculado en base a la fecha límite
  attachments: TeacherAttachment[];
}

interface Props {
  institutionId: number;
  studentId: number;
}

const StudentPendingTasks = ({ institutionId, studentId }: Props) => {

  console.error("studentId", studentId)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS GLOBALES ---
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("ALL");
  const [tasks, setTasks] = useState<PendingTask[]>([]);
  const [enrolledSubjects, setEnrolledSubjects] = useState<CourseSubject[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  // --- ESTADOS DEL FORMULARIO DE ENTREGA ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [studentComment, setStudentComment] = useState("");

  // --- ESTADOS DE CARGA Y MODAL ---
  const [isLoading, setIsLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false, type: "success" as "success" | "error", title: "", message: "",
  });
  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  // --- EFECTO: CARGAR TAREAS DEL BACKEND ---
  const fetchTasks = useCallback(async () => {
    if (!institutionId || !studentId) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/student-tasks/${institutionId}/${studentId}/pending`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // Mapeamos los datos del backend y calculamos si es "Urgente" (vence en menos de 48 horas)
        const formattedTasks: PendingTask[] = data.map((t: any) => {
          const due = new Date(t.dueDate);
          const now = new Date();
          const hoursDiff = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
          
          return {
            id: t.id.toString(),
            courseSubjectId: t.courseSubjectId.toString(),
            subjectName: t.subject,
            teacherName: t.teacher,
            title: t.title,
            description: t.description,
            dueDate: t.dueDate,
            isUrgent: hoursDiff > 0 && hoursDiff <= 48,
            attachments: t.attachments || []
          };
        });
        
        setTasks(formattedTasks);

        // Extraemos las materias únicas de las tareas pendientes para llenar el filtro
        const uniqueSubjects = Array.from(new Map(formattedTasks.map(t => 
          [t.courseSubjectId, { id: t.courseSubjectId, name: t.subjectName, teacher: t.teacherName }]
        )).values());
        
        setEnrolledSubjects(uniqueSubjects);
      }
    } catch (error) {
      console.error("Error cargando tareas pendientes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [institutionId, studentId, apiUrl]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- DERIVADOS (Filtro) ---
  const filteredTasks = selectedSubjectId === "ALL" 
    ? tasks 
    : tasks.filter(t => t.courseSubjectId === selectedSubjectId);

  // --- MANEJADORES ---
  const handleSubjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubjectId(e.target.value);
    setExpandedTaskId(null); 
  };

  const toggleExpand = (id: string) => {
    setExpandedTaskId(prev => prev === id ? null : id);
    setSelectedFile(null);
    setStudentComment("");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, taskId: string) => {
    e.preventDefault();
    if (!selectedFile) {
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "Debes adjuntar un archivo para enviar tu tarea." });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (studentComment) {
      formData.append("comment", studentComment);
    }

    try {
      const res = await fetch(`${apiUrl}/student-tasks/${institutionId}/${studentId}/submit/${taskId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
        body: formData
      });

      if (!res.ok) throw new Error("Error al enviar la tarea");

      setModalConfig({ isOpen: true, type: "success", title: "¡Enviado!", message: "Trabajo enviado exitosamente al profesor." });
      
      // Actualizamos la UI eliminando la tarea enviada
      const remainingTasks = tasks.filter(t => t.id !== taskId);
      setTasks(remainingTasks);
      setExpandedTaskId(null);
      setSelectedFile(null);
      setStudentComment("");

      // Actualizamos los filtros por si una materia ya no tiene tareas
      const remainingSubjectIds = new Set(remainingTasks.map(t => t.courseSubjectId));
      setEnrolledSubjects(prev => prev.filter(s => remainingSubjectIds.has(s.id)));
      
      if (selectedSubjectId !== "ALL" && !remainingSubjectIds.has(selectedSubjectId)) {
        setSelectedSubjectId("ALL");
      }

    } catch (error) {
      console.error(error);
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "Hubo un problema al enviar tu tarea." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const textareaClass = "w-full bg-transparent border-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 p-3 rounded-xl font-medium transition-all resize-none min-h-[80px]";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-2 font-bold transition-all appearance-none cursor-pointer";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500 relative">
      
      {/* CABECERA */}
      <div className="mb-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-blue-900/20 pb-4">
        <div>
          <h2 className="text-3xl font-black text-blue-950 mb-2">Tareas Pendientes</h2>
          <p className="text-blue-900/70 font-medium">
            Revisa las actividades asignadas por tus profesores, descarga el material y sube tus respuestas.
          </p>
        </div>
      </div>

      {/* FILTRO DE MATERIAS */}
      {enrolledSubjects.length > 0 && (
        <div className={bentoCardClass}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-2 text-blue-900 bg-blue-900/10 p-3 rounded-xl shrink-0">
              <Filter className="w-5 h-5" />
              <span className="font-black uppercase tracking-widest text-sm">Filtrar:</span>
            </div>
            
            <div className="w-full md:w-1/2">
              <select 
                className={selectClass} 
                value={selectedSubjectId} 
                onChange={handleSubjectChange}
              >
                <option value="ALL" className="bg-white">Todas las materias pendientes</option>
                {enrolledSubjects.map(subject => (
                  <option key={subject.id} value={subject.id} className="bg-white">
                    {subject.name} - Prof. {subject.teacher}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* LISTA DE TAREAS PENDIENTES */}
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center text-center text-blue-900/40 animate-pulse">
            <FileText className="w-12 h-12 mb-2 opacity-50" />
            <p className="font-bold text-lg">Buscando tareas pendientes...</p>
          </div>
        ) : filteredTasks.length > 0 ? filteredTasks.map((task) => {
          const isExpanded = expandedTaskId === task.id;

          return (
            <div 
              key={task.id} 
              className={`border-2 rounded-3xl bg-transparent transition-all overflow-hidden ${
                task.isUrgent ? (isExpanded ? "border-red-500 shadow-[6px_6px_0_rgba(239,68,68,0.2)]" : "border-red-900/40 hover:border-red-500") 
                : (isExpanded ? "border-blue-900 shadow-[6px_6px_0_rgba(30,58,138,0.2)]" : "border-blue-900/30 hover:border-blue-900/60")
              }`}
            >
              {/* --- CABECERA DE LA TAREA (Clickeable) --- */}
              <div 
                onClick={() => toggleExpand(task.id)}
                className={`p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${
                  isExpanded ? (task.isUrgent ? "bg-red-50" : "bg-blue-900/5") 
                  : (task.isUrgent ? "hover:bg-red-50/50" : "hover:bg-blue-900/5")
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    task.isUrgent ? "bg-red-100 text-red-600" : "bg-blue-900/10 text-blue-900"
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        task.isUrgent ? "bg-red-200 text-red-900" : "bg-blue-200 text-blue-900"
                      }`}>
                        {task.subjectName}
                      </span>
                      {task.isUrgent && <span className="flex items-center gap-1 text-[10px] font-black text-red-600 uppercase"><AlertCircle className="w-3 h-3" /> Urgente</span>}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-blue-950 leading-tight mb-1">{task.title}</h3>
                    <p className="text-xs font-bold text-blue-900/60 uppercase tracking-widest flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Prof. {task.teacherName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t-2 border-blue-900/10 pt-4 md:border-0 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="block text-[10px] font-bold text-blue-900/50 uppercase tracking-widest">Fecha Límite</span>
                    <span className={`text-sm font-black flex items-center gap-1 ${task.isUrgent ? "text-red-600" : "text-blue-950"}`}>
                      <Clock className="w-4 h-4" /> 
                      {new Date(task.dueDate).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <button className="p-2 rounded-full bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* --- CONTENIDO EXPANDIDO (Instrucciones y Entrega) --- */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t-2 border-blue-900/10 border-dashed animate-in slide-in-from-top-2 duration-300 bg-white/40">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Columna Izquierda: Instrucciones */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-2 flex items-center gap-2">
                          Instrucciones de la Actividad
                        </h4>
                        <p className="text-sm font-medium text-blue-950 leading-relaxed bg-white/60 p-4 rounded-xl border border-blue-900/10">
                          {task.description}
                        </p>
                      </div>

                      {/* ARCHIVOS ADJUNTOS DEL DOCENTE */}
                      {task.attachments && task.attachments.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-2 flex items-center gap-2">
                            Material de Apoyo
                          </h4>
                          <div className="flex flex-col gap-2">
                            {task.attachments.map((file) => (
                              <a 
                                key={file.id} 
                                href={`${apiUrl}/files/${file.fileUrl}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between bg-blue-900/10 hover:bg-blue-900 hover:text-white text-blue-900 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors w-full border border-blue-900/10 shadow-sm"
                                title="Descargar archivo"
                              >
                                <span className="flex items-center gap-2 truncate pr-4">
                                  <FileText className="w-4 h-4 shrink-0" /> 
                                  <span className="truncate">{file.fileName}</span>
                                </span>
                                <Download className="w-4 h-4 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Columna Derecha: Formulario de Entrega */}
                    <div className={bentoCardClass}>
                      <h4 className="text-lg font-extrabold text-blue-950 mb-1 flex items-center gap-2">
                        <UploadCloud className="w-5 h-5"/> Entregar Trabajo
                      </h4>
                      
                      <form onSubmit={(e) => handleSubmit(e, task.id)} className="flex flex-col gap-4">
                        
                        {/* Zona de Drop/Upload */}
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-900/30 border-dashed rounded-xl cursor-pointer bg-white/60 hover:bg-blue-900/5 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                            {selectedFile ? (
                              <>
                                <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                                <p className="text-sm font-bold text-blue-900 truncate max-w-[200px] sm:max-w-xs">{selectedFile.name}</p>
                                <p className="text-[10px] font-bold text-blue-900/50 mt-1">Clic para cambiar de archivo</p>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-8 h-8 text-blue-900/40 mb-2" />
                                <p className="text-sm font-bold text-blue-900/70">Haz clic aquí para subir tu solución</p>
                                <p className="text-xs font-medium text-blue-900/50">PDF, Word, Excel, JPG, PNG</p>
                              </>
                            )}
                          </div>
                          <input type="file" className="hidden" onChange={handleFileChange} required />
                        </label>

                        {/* Comentarios */}
                        <div>
                          <label className="text-[10px] font-bold text-blue-900/70 uppercase tracking-widest mb-1 block">
                            Comentario al Profesor (Opcional)
                          </label>
                          <textarea 
                            placeholder="Ej: Profe, le envío mi taller. Tuve dudas en el punto 3."
                            className={textareaClass}
                            value={studentComment}
                            onChange={(e) => setStudentComment(e.target.value)}
                          />
                        </div>

                        {/* Botón Enviar */}
                        <button 
                          type="submit" 
                          disabled={isSubmitting || !selectedFile}
                          className={`mt-2 flex items-center justify-center gap-2 px-6 py-3 border-4 border-blue-900 text-blue-950 font-black rounded-xl transition-all uppercase tracking-widest ${
                            isSubmitting || !selectedFile
                              ? "opacity-50 cursor-not-allowed bg-blue-900/5 border-blue-900/20 text-blue-900/50" 
                              : "bg-white hover:bg-blue-900 hover:text-white shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                          }`}
                        >
                          <Send className="w-5 h-5" />
                          {isSubmitting ? "Enviando..." : "Enviar Tarea"}
                        </button>

                      </form>
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        }) : (
          <div className="py-16 flex flex-col items-center text-center text-blue-900/40 border-2 border-blue-900/20 border-dashed rounded-3xl bg-blue-900/5">
            <CheckCircle2 className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-2xl font-black mb-1">
              {selectedSubjectId === "ALL" ? "¡Estás al día!" : "Sin tareas pendientes"}
            </h3>
            <p className="font-medium max-w-sm">
              {selectedSubjectId === "ALL" 
                ? "Has entregado todas tus tareas. Puedes usar este tiempo para repasar o descansar." 
                : "No tienes trabajos pendientes para esta materia."}
            </p>
          </div>
        )}
      </div>

      {/* MODAL DE ALERTAS (chadcn) */}
      <ModalComponent isOpen={modalConfig.isOpen} onClose={closeModal} type={modalConfig.type} title={modalConfig.title} message={modalConfig.message} />
    </div>
  );
};

export default StudentPendingTasks;