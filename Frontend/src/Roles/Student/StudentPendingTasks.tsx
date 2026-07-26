import { useState, type ChangeEvent, type FormEvent } from "react";
import { FileText, Clock, AlertCircle, UploadCloud, Send, ChevronDown, ChevronUp, BookOpen, CheckCircle2 } from "lucide-react";

// --- INTERFACES ---
interface PendingTask {
  id: string;
  subject: string;
  teacher: string;
  title: string;
  description: string;
  dueDate: string;
  isUrgent: boolean; // Si vence en menos de 48 horas
  attachments: string[]; // Archivos que envió el profesor
}

// --- DATOS SIMULADOS ---
const mockPendingTasks: PendingTask[] = [
  { 
    id: "T1", 
    subject: "Cálculo", 
    teacher: "Luis Fernando Ramírez",
    title: "Taller Evaluativo de Funciones", 
    description: "Resolver los 10 ejercicios del PDF adjunto. Recuerden justificar cada paso. Se evaluará el procedimiento, no solo la respuesta final.",
    dueDate: "26 de Julio, 23:59", 
    isUrgent: true,
    attachments: ["Taller_Funciones_Periodo1.pdf"]
  },
  { 
    id: "T2", 
    subject: "Química", 
    teacher: "Martha Silva",
    title: "Informe de Laboratorio: Enlaces", 
    description: "Subir el informe grupal del laboratorio realizado el miércoles. Solo un integrante debe subir el archivo, pero recuerden poner los nombres de todos en la portada.",
    dueDate: "27 de Julio, 18:00", 
    isUrgent: true,
    attachments: ["Formato_Informe_Lab.docx"]
  },
  { 
    id: "T3", 
    subject: "Inglés", 
    teacher: "Ana Gómez",
    title: "Reading Comprehension Unit 4", 
    description: "Read the article on page 45 and write a 200-word summary. Upload your essay in PDF format.",
    dueDate: "30 de Julio, 23:59", 
    isUrgent: false,
    attachments: []
  },
];

const StudentPendingTasks = () => {
  // --- ESTADOS ---
  const [tasks, setTasks] = useState<PendingTask[]>(mockPendingTasks);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(mockPendingTasks[0]?.id || null);
  
  // Estados para el formulario de entrega
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [studentComment, setStudentComment] = useState("");

  // --- MANEJADORES ---
  const toggleExpand = (id: string) => {
    setExpandedTaskId(prev => prev === id ? null : id);
    // Limpiamos el formulario al cambiar de tarea
    setSelectedFile(null);
    setStudentComment("");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>, taskId: string) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Debes adjuntar al menos un archivo para enviar tu tarea.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      taskId,
      fileName: selectedFile.name,
      comment: studentComment,
      submittedAt: new Date().toISOString()
    };

    console.log("Enviando Tarea al servidor:", payload);

    setTimeout(() => {
      alert("¡Trabajo enviado exitosamente al profesor!");
      // Removemos la tarea de la lista de pendientes
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setExpandedTaskId(null);
      setSelectedFile(null);
      setStudentComment("");
      setIsSubmitting(false);
    }, 1500);
  };

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const textareaClass = "w-full bg-transparent border-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 p-3 rounded-xl font-medium transition-all resize-none min-h-[80px]";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Tareas Pendientes</h2>
        <p className="text-blue-900/70 font-medium">
          Revisa las actividades asignadas por tus profesores y sube tus trabajos antes de la fecha límite.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {tasks.length > 0 ? tasks.map((task) => {
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
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        task.isUrgent ? "bg-red-200 text-red-900" : "bg-blue-200 text-blue-900"
                      }`}>
                        {task.subject}
                      </span>
                      {task.isUrgent && <span className="flex items-center gap-1 text-[10px] font-black text-red-600 uppercase"><AlertCircle className="w-3 h-3" /> Urgente</span>}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-blue-950 leading-tight mb-1">{task.title}</h3>
                    <p className="text-xs font-bold text-blue-900/60 uppercase tracking-widest flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Prof. {task.teacher}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t-2 border-blue-900/10 pt-4 md:border-0 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="block text-[10px] font-bold text-blue-900/50 uppercase tracking-widest">Fecha Límite</span>
                    <span className={`text-sm font-black flex items-center gap-1 ${task.isUrgent ? "text-red-600" : "text-blue-950"}`}>
                      <Clock className="w-4 h-4" /> {task.dueDate}
                    </span>
                  </div>
                  <button className="p-2 rounded-full bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* --- CONTENIDO EXPANDIDO (Instrucciones y Entrega) --- */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t-2 border-blue-900/10 border-dashed animate-in slide-in-from-top-2 duration-300">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Columna Izquierda: Instrucciones */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-2 flex items-center gap-2">
                          Instrucciones de la Actividad
                        </h4>
                        <p className="text-sm font-medium text-blue-950 leading-relaxed bg-white/50 p-4 rounded-xl border border-blue-900/10">
                          {task.description}
                        </p>
                      </div>

                      {task.attachments.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-2 flex items-center gap-2">
                            Material de Apoyo
                          </h4>
                          <div className="flex flex-col gap-2">
                            {task.attachments.map((file, idx) => (
                              <a key={idx} href="#" className="flex items-center gap-2 bg-blue-900/10 hover:bg-blue-900/20 text-blue-900 text-sm font-bold px-3 py-2 rounded-lg transition-colors w-fit">
                                <FileText className="w-4 h-4" /> {file}
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
                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-blue-900/30 border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-blue-900/5 transition-colors">
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
                                <p className="text-sm font-bold text-blue-900/70">Haz clic aquí para seleccionar tu archivo</p>
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
                            placeholder="Ej: Profe, le envío mi taller. Saludos."
                            className={textareaClass}
                            value={studentComment}
                            onChange={(e) => setStudentComment(e.target.value)}
                          />
                        </div>

                        {/* Botón Enviar */}
                        <button 
                          type="submit" 
                          disabled={isSubmitting || !selectedFile}
                          className={`mt-2 flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-900 text-blue-950 font-black rounded-xl transition-all uppercase tracking-widest ${
                            isSubmitting || !selectedFile
                              ? "opacity-50 cursor-not-allowed bg-blue-900/5" 
                              : "hover:bg-blue-900 hover:text-white shadow-[3px_3px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5"
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
          <div className="py-16 flex flex-col items-center text-center text-blue-900/40">
            <CheckCircle2 className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-2xl font-black mb-1">¡Estás al día!</h3>
            <p className="font-medium max-w-sm">Has entregado todas tus tareas. Puedes usar este tiempo para repasar o descansar.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentPendingTasks;