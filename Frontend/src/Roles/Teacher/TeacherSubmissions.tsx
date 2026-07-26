import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Save, FileText, Download, Award, MessageSquare, Bell, CheckCircle2, AlertCircle } from "lucide-react";

// --- INTERFACES ---
interface Submission {
  id: string;
  studentName: string;
  submittedAt: string; // Fecha y hora de entrega
  fileName: string;
  grade: number | "";
  feedback: string;
  status: "PENDIENTE" | "CALIFICADO";
}

// --- DATOS SIMULADOS ---
const mockAssignments = [
  { id: "A1", courseId: "CS1", title: "Taller Evaluativo de Funciones" },
  { id: "A2", courseId: "CS1", title: "Ensayo sobre Límites" },
  { id: "A3", courseId: "CS2", title: "Ejercicios de Derivadas" },
];

const mockSubmissionsDb: Record<string, Submission[]> = {
  "A1": [
    { id: "SUB1", studentName: "Álvarez, María Camila", submittedAt: "25/07/2026 14:30", fileName: "Taller_Funciones_MariaA.pdf", grade: "", feedback: "", status: "PENDIENTE" },
    { id: "SUB2", studentName: "Bermúdez, Carlos Andrés", submittedAt: "26/07/2026 09:15", fileName: "Carlos_Bermudez_Taller1.docx", grade: 4.5, feedback: "Buen trabajo, cuidado con el punto 3.", status: "CALIFICADO" },
    { id: "SUB3", studentName: "Castro, Luis Fernando", submittedAt: "26/07/2026 11:20", fileName: "Luis_Castro_Solucion.pdf", grade: "", feedback: "", status: "PENDIENTE" },
  ],
  "A2": [],
  "A3": [
    { id: "SUB4", studentName: "Díaz, Ana Sofía", submittedAt: "24/07/2026 18:00", fileName: "Ana_Diaz_Derivadas.pdf", grade: "", feedback: "", status: "PENDIENTE" }
  ]
};

const TeacherSubmissions = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  // --- ESTADOS ---
  const [selectedAssignment, setSelectedAssignment] = useState<string>(mockAssignments[0].id);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- EFECTOS ---
  // 1. Calcular notificaciones globales (tareas pendientes en toda la BD)
  useEffect(() => {
    let count = 0;
    Object.values(mockSubmissionsDb).forEach(subs => {
      count += subs.filter(s => s.status === "PENDIENTE").length;
    });
    setUnreadCount(count);
  }, []);

  // 2. Cargar entregas de la tarea seleccionada
  useEffect(() => {
    if (selectedAssignment) {
      // Clonamos los datos para poder editarlos en el estado
      const currentSubs = mockSubmissionsDb[selectedAssignment] || [];
      setSubmissions(JSON.parse(JSON.stringify(currentSubs)));
    }
  }, [selectedAssignment]);

  // --- MANEJADORES ---
  const handleGradeChange = (submissionId: string, value: string) => {
    let numericValue: number | "" = parseFloat(value);
    
    if (value === "") numericValue = "";
    else if (numericValue > 5.0) numericValue = 5.0;
    else if (numericValue < 0) numericValue = 0;

    setSubmissions(prev => 
      prev.map(s => s.id === submissionId ? { ...s, grade: numericValue } : s)
    );
  };

  const handleFeedbackChange = (submissionId: string, text: string) => {
    setSubmissions(prev => 
      prev.map(s => s.id === submissionId ? { ...s, feedback: text } : s)
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      assignmentId: selectedAssignment,
      gradedSubmissions: submissions.filter(s => s.grade !== "") // Solo enviamos las que tienen nota
    };

    console.log("Enviando calificaciones de trabajos al backend:", payload);

    setTimeout(() => {
      alert("¡Calificaciones y comentarios guardados exitosamente!");
      
      // Actualizamos el estado visual a "CALIFICADO"
      setSubmissions(prev => prev.map(s => s.grade !== "" ? { ...s, status: "CALIFICADO" } : s));
      
      // Recalculamos la campana
      const remainingPending = submissions.filter(s => s.grade === "").length;
      setUnreadCount(prev => Math.max(0, prev - (submissions.length - remainingPending)));
      
      setIsSaving(false);
    }, 1200);
  };

  // --- CLASES ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all";

  // Estadísticas rápidas de la tarea seleccionada
  const pendingCount = submissions.filter(s => s.status === "PENDIENTE").length;
  const gradedCount = submissions.filter(s => s.status === "CALIFICADO").length;

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA CON CAMPANA DE NOTIFICACIONES */}
      <div className="mb-2 flex justify-between items-end border-b-4 border-blue-900/20 pb-4">
        <div>
          <h2 className="text-3xl font-black text-blue-950 mb-2">Calificar Entregas</h2>
          <p className="text-blue-900/70 font-medium">
            Revise los trabajos enviados por sus alumnos, descargue los adjuntos y asigne una calificación.
          </p>
        </div>

        {/* Campana de Notificaciones */}
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
          <div className="hidden sm:block text-sm font-bold text-blue-950">
            {unreadCount > 0 ? `${unreadCount} entregas nuevas` : "Al día"}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* --- CAJA 1: SELECCIÓN DE TAREA --- */}
        <div className={bentoCardClass}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
            <div className="lg:col-span-2">
              <label className="text-[11px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
                <FileText className="w-4 h-4"/> Seleccione la Tarea a Evaluar:
              </label>
              <select 
                className={selectClass} 
                value={selectedAssignment} 
                onChange={(e) => setSelectedAssignment(e.target.value)}
                required
              >
                {mockAssignments.map(a => <option key={a.id} value={a.id} className="bg-white">{a.title}</option>)}
              </select>
            </div>
            
            {/* Resumen de estado de la tarea seleccionada */}
            <div className="flex gap-4 p-3 bg-blue-900/5 rounded-xl border border-blue-900/10 justify-around">
               <div className="text-center">
                 <span className="block text-2xl font-black text-blue-900">{pendingCount}</span>
                 <span className="text-[10px] uppercase font-bold text-blue-900/60">Por calificar</span>
               </div>
               <div className="w-px bg-blue-900/20"></div>
               <div className="text-center">
                 <span className="block text-2xl font-black text-green-600">{gradedCount}</span>
                 <span className="text-[10px] uppercase font-bold text-blue-900/60">Calificados</span>
               </div>
            </div>
          </div>
        </div>

        {/* --- CAJA 2: LISTA DE ENTREGAS --- */}
        <div className={bentoCardClass}>
          <h3 className="text-xl font-extrabold text-blue-950 mb-4 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max">
            <CheckCircle2 className="w-5 h-5"/> Entregas de Estudiantes
          </h3>

          <div className="flex flex-col gap-4">
            {submissions.length > 0 ? submissions.map((sub) => (
              <div 
                key={sub.id} 
                className={`flex flex-col xl:flex-row gap-4 p-4 rounded-2xl border-2 transition-colors ${
                  sub.status === "PENDIENTE" ? "border-blue-900/40 bg-white shadow-sm" : "border-green-900/20 bg-green-50/30 opacity-80"
                }`}
              >
                
                {/* Info del Estudiante y Archivo */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-blue-950 text-base">{sub.studentName}</h4>
                    {sub.status === "PENDIENTE" ? (
                      <span className="bg-yellow-100 text-yellow-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Nuevo</span>
                    ) : (
                      <span className="bg-green-100 text-green-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Calificado</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-blue-900/60">Entregado: {sub.submittedAt}</p>
                  
                  {/* Botón de descarga simulado */}
                  <button type="button" className="mt-1 w-fit flex items-center gap-2 bg-blue-900/10 hover:bg-blue-900 hover:text-white text-blue-900 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                    <Download className="w-4 h-4" /> {sub.fileName}
                  </button>
                </div>

                {/* Área de Calificación y Feedback */}
                <div className="xl:w-1/2 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  
                  {/* Input de Nota */}
                  <div className="w-24 shrink-0 relative">
                    <Award className="absolute left-2 top-2 w-4 h-4 text-blue-900/40" />
                    <input 
                      type="number" 
                      step="0.1" min="1.0" max="5.0" placeholder="0.0"
                      className={`w-full bg-transparent border-2 border-dashed outline-none py-1.5 pl-8 pr-2 rounded-lg font-black text-center transition-all focus:border-solid ${
                        sub.grade !== "" && sub.grade >= 3.0 ? "border-green-500 bg-green-50 text-green-900" : 
                        sub.grade !== "" && sub.grade < 3.0 ? "border-red-500 bg-red-50 text-red-900" : 
                        "border-blue-900/30 focus:border-blue-900"
                      }`}
                      value={sub.grade}
                      onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                    />
                    <span className="block text-center text-[10px] font-bold text-blue-900/50 mt-1 uppercase">Nota</span>
                  </div>

                  {/* Input de Comentarios */}
                  <div className="flex-1 w-full relative">
                    <MessageSquare className="absolute left-0 top-1.5 w-4 h-4 text-blue-900/40" />
                    <input 
                      type="text" 
                      placeholder="Retroalimentación al estudiante..."
                      className={`${inputClass} pl-6 text-sm`}
                      value={sub.feedback}
                      onChange={(e) => handleFeedbackChange(sub.id, e.target.value)}
                    />
                  </div>
                </div>

              </div>
            )) : (
              <div className="py-12 flex flex-col items-center text-center text-blue-900/40">
                <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                <p className="font-bold text-lg">Aún no hay entregas.</p>
                <p className="text-sm">Ningún estudiante ha subido su trabajo para esta tarea.</p>
              </div>
            )}
          </div>
        </div>

        {/* BOTÓN "SELLO" DE GUARDADO */}
        {submissions.length > 0 && pendingCount > 0 && (
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
              {isSaving ? "Guardando Calificaciones..." : "Publicar Notas"}
            </button>
          </div>
        )}

      </form>
    </div>
  );
};

export default TeacherSubmissions;