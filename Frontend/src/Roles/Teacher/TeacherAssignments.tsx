import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Save, BookOpen, Users, Calendar, FileText, UploadCloud, Target, CheckSquare } from "lucide-react";

// --- DATOS SIMULADOS ---
const mockCourses = [
  { id: "CS1", name: "1101 - Cálculo" },
  { id: "CS2", name: "1102 - Cálculo" },
  { id: "CS3", name: "1001 - Física I" },
];

const mockStudentsDb: Record<string, { id: string, name: string }[]> = {
  "CS1": [
    { id: "S1", name: "Álvarez, María Camila" },
    { id: "S2", name: "Bermúdez, Carlos Andrés" },
    { id: "S3", name: "Castro, Luis Fernando" },
  ],
  "CS2": [
    { id: "S4", name: "Díaz, Ana Sofía" },
    { id: "S5", name: "Gómez, Santiago" },
  ],
  "CS3": []
};

const TeacherAssignments = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  // --- ESTADOS DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    courseId: mockCourses[0].id,
    assignmentType: "ALL", // "ALL" (Todo el curso) o "SPECIFIC" (Solo algunos)
  });

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // --- EFECTOS ---
  // Si cambia el curso, limpiamos los estudiantes seleccionados
  useEffect(() => {
    setSelectedStudents([]);
  }, [formData.courseId]);

  // --- MANEJADORES ---
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setAttachedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.assignmentType === "SPECIFIC" && selectedStudents.length === 0) {
      alert("Debes seleccionar al menos un estudiante para esta asignación especial.");
      return;
    }

    setIsSaving(true);

    const payload = {
      ...formData,
      targetStudents: formData.assignmentType === "ALL" ? "TODOS" : selectedStudents,
      filesCount: attachedFiles.length
    };

    console.log("Enviando Tarea al Servidor:", payload);
    // Aquí usarías FormData real para enviar los archivos:
    // const data = new FormData();
    // attachedFiles.forEach(f => data.append("files", f));

    setTimeout(() => {
      alert("¡Tarea y material asignados exitosamente!");
      // Resetear formulario
      setFormData(prev => ({ ...prev, title: "", description: "", dueDate: "", assignmentType: "ALL" }));
      setAttachedFiles([]);
      setSelectedStudents([]);
      setIsSaving(false);
    }, 1500);
  };

  // --- CLASES ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all placeholder:text-blue-900/40";
  const textareaClass = "w-full bg-transparent border-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 p-3 rounded-xl font-medium transition-all resize-none min-h-[120px]";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";

  // Alumnos del curso seleccionado
  const currentStudents = mockStudentsDb[formData.courseId] || [];

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Asignación de Tareas</h2>
        <p className="text-blue-900/70 font-medium">
          Envíe trabajos, guías o material de apoyo a todo un curso o a estudiantes específicos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* --- CAJA 1: DETALLES DE LA TAREA --- */}
          <div className={bentoCardClass}>
            <h3 className={bentoTitleClass}><FileText className="w-5 h-5"/> Detalles de la Actividad</h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Título de la Tarea:</label>
                <input 
                  type="text" 
                  name="title" 
                  placeholder="Ej: Taller Evaluativo de Funciones" 
                  className={inputClass} 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div>
                <label className={labelClass}>Descripción o Instrucciones:</label>
                <textarea 
                  name="description" 
                  placeholder="Escriba los lineamientos, pasos a seguir o notas adicionales para los estudiantes..." 
                  className={textareaClass} 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div>
                <label className={labelClass}>Fecha Límite de Entrega:</label>
                <input 
                  type="datetime-local" 
                  name="dueDate" 
                  className={inputClass} 
                  value={formData.dueDate} 
                  onChange={handleChange} 
                  required 
                />
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
                  <select name="courseId" className={selectClass} value={formData.courseId} onChange={handleChange} required>
                    {mockCourses.map(c => <option key={c.id} value={c.id} className="bg-white">{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>¿A quién va dirigida la tarea?</label>
                  <div className="flex bg-blue-900/10 p-1 rounded-xl mt-2">
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, assignmentType: "ALL" }))}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                        formData.assignmentType === "ALL" ? "bg-white shadow-sm text-blue-900" : "text-blue-900/60 hover:text-blue-900"
                      }`}
                    >
                      <Users className="w-4 h-4" /> Todo el Grupo
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, assignmentType: "SPECIFIC" }))}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                        formData.assignmentType === "SPECIFIC" ? "bg-white shadow-sm text-blue-900" : "text-blue-900/60 hover:text-blue-900"
                      }`}
                    >
                      <CheckSquare className="w-4 h-4" /> Específicos
                    </button>
                  </div>
                </div>

                {/* Lista de estudiantes condicional (Se muestra solo si elige SPECIFIC) */}
                {formData.assignmentType === "SPECIFIC" && (
                  <div className="bg-white/50 border-2 border-blue-900/10 p-4 rounded-xl animate-in slide-in-from-top-2">
                    <p className="text-xs font-bold text-blue-900/60 mb-3">Seleccione los estudiantes para esta tarea especial (Ej: Recuperaciones):</p>
                    <div className="max-h-32 overflow-y-auto flex flex-col gap-2 pr-2 no-scrollbar">
                      {currentStudents.map(student => (
                        <label key={student.id} className="flex items-center gap-3 cursor-pointer hover:bg-blue-900/5 p-2 rounded-lg transition-colors">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 accent-blue-900 cursor-pointer"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => toggleStudent(student.id)}
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
                    <p className="text-xs font-bold text-blue-900/70">Click para adjuntar guías o documentos</p>
                  </div>
                  <input type="file" className="hidden" multiple onChange={handleFileChange} />
                </label>

                {/* Previsualización de archivos seleccionados */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-900/10 px-3 py-2 rounded-lg text-sm font-bold text-blue-900">
                        <span className="truncate max-w-[200px]">{file.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded-md transition-colors"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* BOTÓN "SELLO" DE GUARDADO */}
        <div className="flex justify-end mt-2">
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
            {isSaving ? "Enviando Tarea..." : "Asignar Trabajo"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default TeacherAssignments;