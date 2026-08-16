import { useState, useEffect, type ChangeEvent, type FormEvent, useCallback } from "react";
import { Save, BookOpen, Users, FileText, UploadCloud, Target, CheckSquare, Plus, ArrowLeft, Edit3, Trash2, Clock, CheckCircle2, Download, ExternalLink } from "lucide-react";
import { ModalComponent } from "@/shared/Basics/ModalComponent"; 

// --- INTERFACES ---
interface ActivityFile {
  id: number;
  fileName: string;
  fileUrl: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  courseId: string;
  assignmentType: "ALL" | "SPECIFIC";
  targetStudents: string[];
  filesCount: number;
  files: ActivityFile[];
}

interface AssignedClass {
  id: string;
  subject: string;
  course: string;
}

interface StudentInfo {
  studentId: string;
  name: string;
}

interface Props {
  institutionId: number;
  teacherId: number;
}

const TeacherAssignments = ({ institutionId, teacherId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS GLOBALES ---
  const [activePeriod, setActivePeriod] = useState<{id: number, name: string, year: number} | null>(null);
  const [teacherClasses, setTeacherClasses] = useState<AssignedClass[]>([]);
  
  const [activeView, setActiveView] = useState<"list" | "form">("list");
  const [assignmentsList, setAssignmentsList] = useState<Assignment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // --- ESTADOS DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    courseId: "",
    assignmentType: "ALL" as "ALL" | "SPECIFIC",
  });

  const [currentStudents, setCurrentStudents] = useState<StudentInfo[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  // Archivos ya guardados en el servidor
  const [existingFiles, setExistingFiles] = useState<ActivityFile[]>([]);
  // Nuevos archivos seleccionados
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // --- ESTADOS DE CARGA Y FEEDBACK ---
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false, type: "success" as "success" | "error", title: "", message: "",
  });
  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  // --- EFECTO 1: Cargar Periodo y Clases ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const periodRes = await fetch(`${apiUrl}/academic-periods/${institutionId}/current`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        if (periodRes.ok) {
          const periodData = await periodRes.json();
          setActivePeriod({ id: periodData.id, name: periodData.name, year: periodData.year });
        }

        const classesRes = await fetch(`${apiUrl}/teacher-classes/${institutionId}/${teacherId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        if (classesRes.ok) {
          const classesData = await classesRes.json();
          setTeacherClasses(classesData);
          if (classesData.length > 0) setFormData(prev => ({ ...prev, courseId: classesData[0].id.toString() }));
        }
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      }
    };
    if (institutionId && teacherId) fetchInitialData();
  }, [institutionId, teacherId, apiUrl]);

  // --- FUNCIÓN CENTRAL: Cargar Tareas ---
  const fetchAssignments = useCallback(async () => {
    if (!institutionId || !teacherId) return; 
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/teacher-assignments/${institutionId}/${teacherId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map((a: any) => ({
          id: a.id.toString(),
          title: a.title,
          description: a.description,
          dueDate: a.dueDate, 
          courseId: a.courseId.toString(),
          assignmentType: a.assignmentType,
          targetStudents: a.targetStudents.map(String),
          filesCount: a.filesCount || 0,
          files: a.files || []
        }));
        setAssignmentsList(formatted);
      }
    } catch (error) {
      console.error("Error cargando tareas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [institutionId, teacherId, apiUrl]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // --- EFECTO 2: Cargar estudiantes ---
  useEffect(() => {
    const fetchStudents = async () => {
      if (!formData.courseId || !activePeriod) return;
      try {
        // Usamos el endpoint de asistencias para obtener la lista limpia de alumnos matriculados
        const today = new Date().toISOString().split('T')[0]; // Ej: "2026-08-16"
        const res = await fetch(`${apiUrl}/attendances/${institutionId}/${formData.courseId}?date=${today}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          const data = await res.json();
          // El endpoint de asistencias devuelve { studentId, name }
          setCurrentStudents(data.map((s: any) => ({ studentId: s.studentId.toString(), name: s.name })));
        }
      } catch (error) {
        console.error("Error cargando estudiantes:", error);
      }
    };
    fetchStudents();
    
    if (!editingId) setSelectedStudents([]);
  }, [formData.courseId, activePeriod, editingId, institutionId, apiUrl]);

  // --- MANEJADORES DE VISTAS ---
  const handleOpenCreateForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      courseId: teacherClasses.length > 0 ? teacherClasses[0].id.toString() : "",
      assignmentType: "ALL",
    });
    setSelectedStudents([]);
    setExistingFiles([]);
    setAttachedFiles([]);
    setActiveView("form");
  };

  const handleOpenEditForm = (assignment: Assignment) => {
    setEditingId(assignment.id);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate.substring(0, 16), 
      courseId: assignment.courseId,
      assignmentType: assignment.assignmentType,
    });
    setSelectedStudents(assignment.targetStudents);
    setExistingFiles(assignment.files);
    setAttachedFiles([]); 
    setActiveView("form");
  };

  const handleDeleteAssignment = async (id: string, title: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar permanentemente la tarea "${title}"?`)) return;
    
    try {
      const res = await fetch(`${apiUrl}/teacher-assignments/${institutionId}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.ok) {
        setAssignmentsList(prev => prev.filter(a => a.id !== id));
        setModalConfig({ isOpen: true, type: "success", title: "Eliminado", message: "La tarea ha sido borrada." });
      } else throw new Error("Error al eliminar");
    } catch (error) {
      console.error(error);
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "No se pudo eliminar la tarea." });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- MANEJADORES DE ARCHIVOS ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewFile = (indexToRemove: number) => {
    setAttachedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeExistingFile = (idToRemove: number) => {
    setExistingFiles(prev => prev.filter(f => f.id !== idToRemove));
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  // --- GUARDAR Y ENVIAR AL BACKEND ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.assignmentType === "SPECIFIC" && selectedStudents.length === 0) {
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "Debes seleccionar al menos un estudiante." });
      return;
    }
    if (!activePeriod) return;

    setIsSaving(true);
    const formattedDate = formData.dueDate.length === 16 ? `${formData.dueDate}:00` : formData.dueDate;

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("dueDate", formattedDate);
    formPayload.append("courseId", formData.courseId);
    
    // Si estamos editando, enviamos los IDs de los archivos viejos que queremos conservar
    if (editingId) {
      existingFiles.forEach(f => formPayload.append("existingFiles", f.id.toString()));
    } else {
      // Si estamos creando, enviamos los demás datos
      formPayload.append("period", activePeriod.id.toString());
      formPayload.append("assignmentType", formData.assignmentType);
      if (formData.assignmentType === "SPECIFIC") {
        selectedStudents.forEach(id => formPayload.append("targetStudents", id));
      }
    }

    // Adjuntar archivos nuevos
    attachedFiles.forEach(file => formPayload.append("files", file));

    try {
      const url = editingId 
        ? `${apiUrl}/teacher-assignments/${institutionId}/${editingId}` 
        : `${apiUrl}/teacher-assignments/${institutionId}/create`;
        
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
        body: formPayload
      });

      if (!res.ok) throw new Error("Fallo al guardar tarea");

      setModalConfig({ isOpen: true, type: "success", title: "¡Éxito!", message: "Tarea guardada exitosamente." });
      await fetchAssignments(); 
      setActiveView("list");
      
    } catch (error) {
      console.error(error);
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "No se pudo enviar la tarea." });
    } finally {
      setIsSaving(false);
    }
  };

  // --- ESTILOS ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all placeholder:text-blue-900/40";
  const textareaClass = "w-full bg-transparent border-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 p-3 rounded-xl font-medium transition-all resize-none min-h-[120px]";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";
  const chipClass = "bg-blue-900/10 text-blue-950 font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs border border-blue-900/10 w-fit";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* ------------------------------------- */}
      {/* VISTA 1: DIRECTORIO DE TAREAS (LISTA) */}
      {/* ------------------------------------- */}
      {activeView === "list" && (
        <>
          <div className="mb-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-blue-900/20 pb-4">
            <div>
              <h2 className="text-3xl font-black text-blue-950 mb-1">Asignación de Tareas</h2>
              <div className="inline-flex items-center gap-2 bg-blue-900/10 px-4 py-1.5 rounded-full border border-blue-900/20 mb-2 mt-1">
                <CheckCircle2 className="w-4 h-4 text-blue-900" />
                <span className="text-sm font-bold text-blue-900 uppercase tracking-widest">
                  {activePeriod ? `Periodo Actual: ${activePeriod.name}` : "Cargando periodo..."}
                </span>
              </div>
              <p className="text-blue-900/70 font-medium">Gestione los trabajos y guías enviados a sus grupos.</p>
            </div>
            
            <button 
              onClick={handleOpenCreateForm}
              disabled={!activePeriod}
              className="flex items-center gap-2 bg-blue-900 text-white font-bold hover:bg-blue-800 px-6 py-3 rounded-2xl transition-all shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 whitespace-nowrap disabled:opacity-50"
            >
              <Plus className="w-5 h-5" /> Nueva Tarea
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center text-center text-blue-900/40 animate-pulse">
                <FileText className="w-12 h-12 mb-2 opacity-50" />
                <p className="font-bold text-lg">Cargando tareas...</p>
              </div>
            ) : assignmentsList.length === 0 ? (
              <div className="border-2 border-blue-900/30 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-blue-900/40">
                <FileText className="w-16 h-16 mb-2 opacity-30" />
                <p className="font-bold text-xl">Sin tareas asignadas</p>
                <p className="text-sm text-center">Aún no ha creado ninguna tarea. Haga clic en "Nueva Tarea" para empezar.</p>
              </div>
            ) : (
              assignmentsList.map((assignment) => {
                const courseInfo = teacherClasses.find(c => c.id.toString() === assignment.courseId);
                const courseName = courseInfo ? `${courseInfo.course} - ${courseInfo.subject}` : "Curso Desconocido";
                const isOverdue = new Date(assignment.dueDate) < new Date();

                return (
                  <div key={assignment.id} className="border-2 border-blue-900/20 bg-white/40 hover:bg-blue-900/5 rounded-3xl p-5 md:p-6 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    
                    <div className="flex flex-col md:flex-row items-start gap-4 flex-1">
                      <div className={`w-12 h-12 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isOverdue ? 'bg-red-500/80' : 'bg-blue-900'}`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      
                      <div className="w-full">
                        <h3 className="text-xl font-black text-blue-950 flex items-center gap-2 mb-1">
                          {assignment.title}
                        </h3>
                        <p className="text-sm font-medium text-blue-900/60 line-clamp-1 mb-3 max-w-2xl">{assignment.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={chipClass}><BookOpen className="w-4 h-4 text-blue-900/60" /> {courseName}</span>
                          <span className={chipClass}>
                            <Target className="w-4 h-4 text-blue-900/60" /> 
                            {assignment.assignmentType === "ALL" ? "Todo el Grupo" : `${assignment.targetStudents.length} Estudiantes`}
                          </span>
                          <span className={`${chipClass} ${isOverdue ? 'text-red-700 bg-red-100 border-red-200' : ''}`}>
                            <Clock className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-blue-900/60'}`} /> 
                            {new Date(assignment.dueDate).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>

                        {/* LISTA DE ARCHIVOS DESCARGABLES */}
                        {assignment.files && assignment.files.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t-2 border-blue-900/10 border-dashed">
                            {assignment.files.map(file => (
                              <a 
                                key={file.id}
                                href={`${apiUrl}/files/${file.fileUrl}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 bg-blue-900/5 hover:bg-blue-900 hover:text-white text-blue-900 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" /> 
                                <span className="truncate max-w-[150px]">{file.fileName}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end mt-2 md:mt-0">
                      <button 
                        onClick={() => handleOpenEditForm(assignment)}
                        className="flex items-center gap-2 bg-white text-blue-900 font-bold border-2 border-blue-900/20 hover:bg-blue-900/10 px-4 py-2 rounded-xl transition-all shadow-sm"
                      >
                        <Edit3 className="w-4 h-4" /> <span className="hidden sm:inline">Editar</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteAssignment(assignment.id, assignment.title)}
                        className="flex items-center gap-2 bg-white text-red-500 font-bold border-2 border-red-100 hover:bg-red-50 hover:border-red-200 px-4 py-2 rounded-xl transition-all shadow-sm"
                        title="Eliminar tarea"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ------------------------------------- */}
      {/* VISTA 2: FORMULARIO (CREAR / EDITAR)  */}
      {/* ------------------------------------- */}
      {activeView === "form" && (
        <div className="animate-in slide-in-from-right-8 duration-500">
          
          <div className="mb-6 flex flex-col items-start gap-2">
            <button 
              type="button"
              onClick={() => setActiveView("list")} 
              className="flex items-center gap-2 text-blue-900 font-bold hover:text-blue-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a las tareas
            </button>
            <h2 className="text-3xl font-black text-blue-950 flex items-center gap-2">
              {editingId ? "Editar Tarea" : "Crear Nueva Tarea"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* --- CAJA 1: DETALLES --- */}
              <div className={bentoCardClass}>
                <h3 className={bentoTitleClass}><FileText className="w-5 h-5"/> Detalles de la Actividad</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={labelClass}>Título de la Tarea:</label>
                    <input type="text" name="title" className={inputClass} value={formData.title} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className={labelClass}>Instrucciones:</label>
                    <textarea name="description" className={textareaClass} value={formData.description} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className={labelClass}>Fecha Límite:</label>
                    <input type="datetime-local" name="dueDate" className={inputClass} value={formData.dueDate} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* --- CAJA 2: DESTINATARIOS Y ARCHIVOS --- */}
              <div className="flex flex-col gap-6">
                
                {/* Destinatarios */}
                <div className={bentoCardClass}>
                  <h3 className={bentoTitleClass}><Target className="w-5 h-5"/> Destinatarios</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className={labelClass}>Curso de destino:</label>
                      <select name="courseId" className={selectClass} value={formData.courseId} onChange={handleChange} required disabled={!!editingId}>
                        {teacherClasses.map(c => <option key={c.id} value={c.id} className="bg-white">{c.course} - {c.subject}</option>)}
                      </select>
                    </div>

                    {!editingId && (
                      <div>
                        <label className={labelClass}>¿A quién va dirigida la tarea?</label>
                        <div className="flex bg-blue-900/10 p-1 rounded-xl mt-2">
                          <button type="button" onClick={() => setFormData(prev => ({ ...prev, assignmentType: "ALL" }))} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${formData.assignmentType === "ALL" ? "bg-white shadow-sm text-blue-900" : "text-blue-900/60 hover:text-blue-900"}`}>
                            <Users className="w-4 h-4" /> Todo el Grupo
                          </button>
                          <button type="button" onClick={() => setFormData(prev => ({ ...prev, assignmentType: "SPECIFIC" }))} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${formData.assignmentType === "SPECIFIC" ? "bg-white shadow-sm text-blue-900" : "text-blue-900/60 hover:text-blue-900"}`}>
                            <CheckSquare className="w-4 h-4" /> Específicos
                          </button>
                        </div>
                      </div>
                    )}

                    {formData.assignmentType === "SPECIFIC" && (
                      <div className="bg-white/50 border-2 border-blue-900/10 p-4 rounded-xl">
                        <p className="text-xs font-bold text-blue-900/60 mb-3">Seleccione los estudiantes:</p>
                        <div className="max-h-32 overflow-y-auto flex flex-col gap-2 pr-2 no-scrollbar">
                          {currentStudents.map(student => (
                            <label key={student.studentId} className={`flex items-center gap-3 cursor-pointer hover:bg-blue-900/5 p-2 rounded-lg transition-colors ${editingId ? "opacity-60 cursor-not-allowed" : ""}`}>
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 accent-blue-900"
                                checked={selectedStudents.includes(student.studentId)}
                                onChange={() => toggleStudent(student.studentId)}
                                disabled={!!editingId}
                              />
                              <span className="text-sm font-bold text-blue-950">{student.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Archivos Adjuntos */}
                <div className={bentoCardClass}>
                  <h3 className={bentoTitleClass}><UploadCloud className="w-5 h-5"/> Archivos Adjuntos</h3>
                  <div className="flex flex-col gap-3">
                    
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-blue-900/30 border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-blue-900/5 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-6 h-6 text-blue-900/50 mb-2" />
                        <p className="text-xs font-bold text-blue-900/70">Click para adjuntar documentos nuevos</p>
                      </div>
                      <input type="file" className="hidden" multiple onChange={handleFileChange} />
                    </label>

                    <div className="flex flex-col gap-2 mt-2">
                      {/* Archivos YA guardados en el servidor */}
                      {existingFiles.map((file) => (
                        <div key={`exist-${file.id}`} className="flex items-center justify-between bg-white border-2 border-blue-900/10 px-3 py-2 rounded-lg text-sm font-bold text-blue-900 shadow-sm">
                          <a href={`${apiUrl}/files/${file.fileUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline truncate max-w-[200px]">
                            <ExternalLink className="w-4 h-4" /> {file.fileName}
                          </a>
                          <button type="button" onClick={() => removeExistingFile(file.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-md transition-colors" title="Eliminar archivo">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {/* Archivos NUEVOS a subir */}
                      {attachedFiles.map((file, index) => (
                        <div key={`new-${index}`} className="flex items-center justify-between bg-blue-900/10 px-3 py-2 rounded-lg text-sm font-bold text-blue-900">
                          <span className="truncate max-w-[200px] text-green-700 flex items-center gap-2"><Plus className="w-4 h-4"/> {file.name}</span>
                          <button type="button" onClick={() => removeNewFile(index)} className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded-md transition-colors">
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* BOTÓN "SELLO" DE GUARDADO */}
            <div className="flex justify-end mt-2 sticky bottom-4 z-50">
              <button type="submit" disabled={isSaving} className={`flex items-center gap-3 px-8 py-4 bg-white border-4 border-blue-900 text-blue-950 font-black text-xl rounded-2xl transition-all uppercase tracking-widest shadow-[6px_6px_0_rgba(30,58,138,0.3)] ${isSaving ? "opacity-50 cursor-not-allowed bg-blue-50" : "hover:bg-blue-900 hover:text-white hover:shadow-[2px_2px_0_rgba(30,58,138,0.3)] hover:translate-y-1 hover:translate-x-1"}`}>
                <Save className="w-6 h-6" /> {isSaving ? "Guardando..." : editingId ? "Actualizar Tarea" : "Asignar Trabajo"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DE ALERTAS */}
      <ModalComponent isOpen={modalConfig.isOpen} onClose={closeModal} type={modalConfig.type} title={modalConfig.title} message={modalConfig.message} />
    </div>
  );
};

export default TeacherAssignments;