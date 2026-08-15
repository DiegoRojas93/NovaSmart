import { useState, useEffect, type FormEvent, useCallback } from "react";
import { Save, BookOpen, Users, Award, MessageSquare, AlertCircle, Trash2, Plus, ChevronDown, ChevronUp, CheckCircle2, Edit3 } from "lucide-react";
import { ModalComponent } from "@/shared/Basics/ModalComponent"; 
import { InputModalComponent } from "@/shared/Basics/InputModalComponent";

// --- INTERFACES ---
interface StudentGrade {
  enrollmentId: number;
  studentId: number;
  name: string;
  grade: number | "";
  observations: string;
}

interface Assignment {
  id: string; 
  title: string;
  type: string;
  grades: StudentGrade[];
}

interface AssignedClass {
  id: string;
  subject: string;
  subjectCode: string;
  course: string;
  classroom: string;
}

interface Props {
  institutionId: number;
  teacherId: number;
}

const TeacherGrades = ({ institutionId, teacherId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS GLOBALES ---
  const [activePeriod, setActivePeriod] = useState<{id: number, name: string, year: number} | null>(null);
  
  const [teacherClasses, setTeacherClasses] = useState<AssignedClass[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  
  // Lista de actividades (acordeón)
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);

  // --- ESTADOS DEL MODAL DE ENTRADA (InputModalComponent) ---
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);
  const [modalInitialValue, setModalInitialValue] = useState("");

  // --- ESTADOS DE CARGA Y FEEDBACK (ModalComponent) ---
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false, type: "success" as "success" | "error", title: "", message: "",
  });
  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  // --- EFECTO 0: Cargar Periodo Actual ---
  useEffect(() => {
    const fetchCurrentPeriod = async () => {
      try {
        const res = await fetch(`${apiUrl}/academic-periods/${institutionId}/current`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          const data = await res.json();
          setActivePeriod({ id: data.id, name: data.name, year: data.year });
        }
      } catch (error) {
        console.error("Error cargando el periodo actual:", error);
      }
    };
    
    if (institutionId) fetchCurrentPeriod();
  }, [institutionId, apiUrl]);

  // --- EFECTO 1: Cargar clases ---
  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoadingClasses(true);
      try {
        const res = await fetch(`${apiUrl}/teacher-classes/${institutionId}/${teacherId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTeacherClasses(data);
          if (data.length > 0) setSelectedCourse(data[0].id);
        }
      } catch (error) {
        console.error("Error cargando clases:", error);
      } finally {
        setIsLoadingClasses(false);
      }
    };
    if (institutionId && teacherId) fetchClasses();
  }, [institutionId, teacherId, apiUrl]);

  // --- FUNCIÓN CENTRAL: Cargar Actividades y sus notas ---
  const fetchActivities = useCallback(async () => {
    if (!selectedCourse || !activePeriod) return; 
    
    setIsLoadingGrades(true);
    try {
      const res = await fetch(`${apiUrl}/teacher-activities/${institutionId}/${selectedCourse}?period=${activePeriod.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Formateamos las notas nulas que vienen de la BD a strings vacíos para React
        const formattedAssignments = data.map((act: any) => ({
          id: act.id.toString(),
          title: act.title,
          type: act.type,
          grades: act.grades.map((g: any) => ({
            enrollmentId: g.enrollmentId,
            studentId: g.studentId,
            name: g.name,
            grade: g.grade !== null ? g.grade : "",
            observations: g.observations || ""
          }))
        }));
        setAssignments(formattedAssignments);
      }
    } catch (error) {
      console.error("Error cargando actividades:", error);
    } finally {
      setIsLoadingGrades(false);
    }
  }, [selectedCourse, activePeriod, institutionId, apiUrl]);

  // --- EFECTO 2: Disparar la carga de actividades al cambiar de curso o periodo ---
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // --- MANEJADORES DEL MODAL DE ACTIVIDAD ---
  const handleOpenCreateModal = () => {
    setEditingAssignmentId(null);
    setModalInitialValue("");
    setIsNameModalOpen(true);
  };

  const handleOpenEditModal = (assignment: Assignment) => {
    setEditingAssignmentId(assignment.id);
    setModalInitialValue(assignment.title);
    setIsNameModalOpen(true);
  };

  const handleModalSubmit = async (title: string) => {
    if (!activePeriod) {
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "Aún no se ha cargado el periodo académico." });
      return;
    }
    
    setIsNameModalOpen(false);

    if (editingAssignmentId) {
      // 1. EDITAR NOMBRE EN EL BACKEND (PUT)
      try {
        const res = await fetch(`${apiUrl}/teacher-activities/${institutionId}/${editingAssignmentId}?title=${encodeURIComponent(title)}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          setAssignments(prev => prev.map(a => a.id === editingAssignmentId ? { ...a, title } : a));
        }
      } catch (error) {
        console.error("Error renombrando actividad:", error);
      }
    } else {
      // 2. CREAR NUEVA ACTIVIDAD EN EL BACKEND (POST)
      try {
        const res = await fetch(`${apiUrl}/teacher-activities/${institutionId}/create?classroomSubjectId=${selectedCourse}&period=${activePeriod.id}&title=${encodeURIComponent(title)}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          const data = await res.json(); // Trae el ID generado { id: 123 }
          setExpandedAssignmentId(data.id.toString());
          // Volvemos a cargar las actividades para que el backend nos devuelva la nueva planilla con todos los alumnos
          await fetchActivities(); 
        }
      } catch (error) {
        console.error("Error creando actividad:", error);
      }
    }
  };

  const toggleExpand = (id: string) => setExpandedAssignmentId(prev => prev === id ? null : id);

  // --- MANEJADORES DE NOTAS ---
  const handleGradeChange = (assignmentId: string, enrollmentId: number, value: string) => {
    let numericValue: number | "" = parseFloat(value);
    if (value === "") numericValue = "";
    else if (numericValue > 5.0) numericValue = 5.0;
    else if (numericValue < 0) numericValue = 0;

    setAssignments(prev => prev.map(assignment => {
      if (assignment.id !== assignmentId) return assignment;
      const updatedGrades = assignment.grades.map(s => s.enrollmentId === enrollmentId ? { ...s, grade: numericValue } : s);
      return { ...assignment, grades: updatedGrades };
    }));
  };

  const handleObservationChange = (assignmentId: string, enrollmentId: number, text: string) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id !== assignmentId) return assignment;
      const updatedGrades = assignment.grades.map(s => s.enrollmentId === enrollmentId ? { ...s, observations: text } : s);
      return { ...assignment, grades: updatedGrades };
    }));
  };

  // --- GUARDAR Y ELIMINAR ---
  const handleSubmitAssignment = async (e: FormEvent<HTMLFormElement>, assignment: Assignment) => {
    e.preventDefault();
    
    const missingGrades = assignment.grades.filter(s => s.grade === "");
    if (missingGrades.length > 0) {
      if (!window.confirm(`Faltan ${missingGrades.length} alumnos por calificar. ¿Desea guardar el progreso parcial?`)) {
        return;
      }
    }

    setIsSaving(true);

    const payload = {
      activityId: Number(assignment.id),
      grades: assignment.grades.map(s => ({
        enrollmentId: s.enrollmentId,
        grade: s.grade,
        observations: s.observations
      }))
    };

    try {
      const res = await fetch(`${apiUrl}/teacher-activities/${institutionId}/grades`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Fallo al guardar");
      setModalConfig({ isOpen: true, type: "success", title: "¡Éxito!", message: "Actividad guardada correctamente en el sistema." });
    } catch (error) {
      console.error(error);
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "No se pudieron guardar las notas." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string, title: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar permanentemente la actividad "${title}" y todas sus notas?`)) return;
    
    try {
      const res = await fetch(`${apiUrl}/teacher-activities/${institutionId}/${assignmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.ok) {
        setAssignments(prev => prev.filter(a => a.id !== assignmentId));
        setModalConfig({ isOpen: true, type: "success", title: "Eliminado", message: "La actividad ha sido borrada." });
      } else {
        throw new Error("Fallo al eliminar");
      }
    } catch (error) {
      console.error(error);
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "No se pudo eliminar la actividad." });
    }
  };

  // --- ESTILOS ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all";

  const getGradeStyle = (grade: number | "") => {
    if (grade === "") return "border-blue-900/20";
    if (grade < 3.0) return "border-red-500 bg-red-50 text-red-900";
    if (grade >= 4.5) return "border-green-500 bg-green-50 text-green-900";
    return "border-blue-500 bg-blue-50 text-blue-900";
  };

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500 relative">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-1">Registro de Calificaciones</h2>
        <div className="inline-flex items-center gap-2 bg-blue-900/10 px-4 py-1.5 rounded-full border border-blue-900/20">
          <CheckCircle2 className="w-4 h-4 text-blue-900" />
          <span className="text-sm font-bold text-blue-900 uppercase tracking-widest">
            {activePeriod ? `Periodo Actual: ${activePeriod.name} (${activePeriod.year})` : "Cargando periodo..."}
          </span>
        </div>
      </div>

      {/* SELECTOR DE GRUPO Y BOTÓN NUEVA ACTIVIDAD */}
      <div className={bentoCardClass}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="w-full md:w-1/2">
            <label className="text-[11px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
              <BookOpen className="w-4 h-4"/> Grupo a calificar:
            </label>
            {isLoadingClasses ? (
              <div className="py-1 font-bold text-blue-900/50 animate-pulse">Cargando clases...</div>
            ) : (
              <select className={selectClass} value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
                {teacherClasses.map(c => <option key={c.id} value={c.id} className="bg-white">{c.course} - {c.subject}</option>)}
              </select>
            )}
          </div>

          <button 
            type="button" 
            onClick={handleOpenCreateModal}
            disabled={!selectedCourse || !activePeriod}
            className="flex items-center gap-2 bg-blue-900 text-white font-bold hover:bg-blue-800 px-6 py-2.5 rounded-xl transition-all shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" /> Nueva Actividad
          </button>
        </div>
      </div>

      {/* ACORDEÓN DE ACTIVIDADES */}
      <div className="flex flex-col gap-4">
        {isLoadingGrades ? (
          <div className="py-12 flex flex-col items-center text-center text-blue-900/40 animate-pulse">
            <Award className="w-12 h-12 mb-2 opacity-50" />
            <p className="font-bold text-lg">Cargando actividades y planillas...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="border-2 border-blue-900/30 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-blue-900/40">
            <Award className="w-16 h-16 mb-2 opacity-30" />
            <p className="font-bold text-xl">Sin actividades registradas</p>
            <p className="text-sm">Haga clic en "Nueva Actividad" para comenzar a calificar a este grupo.</p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const isExpanded = expandedAssignmentId === assignment.id;
            const gradedCount = assignment.grades.filter(g => g.grade !== "").length;
            const totalCount = assignment.grades.length;

            return (
              <div key={assignment.id} className={`border-2 rounded-3xl bg-transparent transition-all overflow-hidden ${isExpanded ? "border-blue-900 shadow-[6px_6px_0_rgba(30,58,138,0.2)]" : "border-blue-900/30 hover:border-blue-900/60"}`}>
                
                {/* CABECERA DEL ACORDEÓN */}
                <div onClick={() => toggleExpand(assignment.id)} className={`p-5 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${isExpanded ? "bg-blue-900/5" : "hover:bg-blue-900/5"}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-900 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-blue-950">{assignment.title}</h3>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenEditModal(assignment); }}
                        className="p-1.5 text-blue-900/40 hover:text-blue-900 hover:bg-blue-900/10 rounded-lg transition-colors"
                        title="Editar nombre de la actividad"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border-2 border-blue-900/10 px-3 py-1 rounded-lg text-sm font-bold text-blue-900/70 shadow-sm">
                      <Users className="w-4 h-4" /> 
                      Evaluados: {gradedCount} / {totalCount}
                    </div>
                    <button className="p-2 rounded-full bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white transition-colors">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* CUERPO DEL ACORDEÓN (PLANILLA) */}
                {isExpanded && (
                  <div className="p-5 border-t-2 border-blue-900/20 border-dashed animate-in slide-in-from-top-2 duration-300 bg-white/30">
                    <form onSubmit={(e) => handleSubmitAssignment(e, assignment)}>
                      <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                        
                        <div className="hidden lg:grid grid-cols-12 gap-4 px-4 pb-2 border-b-2 border-blue-900/10 text-xs font-black uppercase tracking-widest text-blue-900/50 sticky top-0 bg-transparent backdrop-blur-md z-10 pt-2">
                          <div className="col-span-1 text-center">N°</div>
                          <div className="col-span-5">Apellidos y Nombres</div>
                          <div className="col-span-2 text-center">Calificación</div>
                          <div className="col-span-4">Observaciones</div>
                        </div>

                        {assignment.grades.length === 0 ? (
                           <div className="py-6 text-center text-blue-900/50 font-bold">No hay alumnos matriculados en este grupo.</div>
                        ) : assignment.grades.map((student, index) => (
                          <div key={student.enrollmentId} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 lg:p-2 rounded-xl border-2 border-blue-900/10 bg-white hover:border-blue-900/30 transition-colors">
                            <div className="lg:col-span-6 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">{index + 1}</div>
                              <h4 className="font-bold text-blue-950 text-sm">{student.name}</h4>
                              {student.grade !== "" && (student.grade as number) < 3.0 && (
                                 <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" title="Riesgo Académico" />
                              )}
                            </div>

                            <div className="lg:col-span-2 flex justify-center">
                              <div className="relative w-full max-w-[100px]">
                                <Award className="absolute left-2 top-1.5 w-4 h-4 text-blue-900/40" />
                                <input 
                                  type="number" step="0.1" min="0.0" max="5.0" placeholder="0.0"
                                  className={`w-full bg-transparent border-2 border-dashed outline-none py-1 pl-8 pr-2 rounded-lg font-black text-center transition-all ${getGradeStyle(student.grade)}`}
                                  value={student.grade} onChange={(e) => handleGradeChange(assignment.id, student.enrollmentId, e.target.value)} 
                                />
                              </div>
                            </div>

                            <div className="lg:col-span-4">
                              <div className="relative w-full">
                                <MessageSquare className="absolute left-0 top-1.5 w-4 h-4 text-blue-900/40" />
                                <input 
                                  type="text" placeholder="Comentario..." className={`${inputClass} pl-6 text-sm py-1 border-b`}
                                  value={student.observations} onChange={(e) => handleObservationChange(assignment.id, student.enrollmentId, e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-blue-900/10">
                        <button 
                          type="button" 
                          onClick={() => handleDeleteAssignment(assignment.id, assignment.title)}
                          className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-all border-2 border-transparent hover:border-red-200"
                        >
                          <Trash2 className="w-5 h-5" /> Eliminar Actividad
                        </button>
                        
                        <button 
                          type="submit" 
                          disabled={isSaving || assignment.grades.length === 0} 
                          className="flex items-center gap-2 bg-blue-900 text-white font-black hover:bg-blue-800 px-6 py-2.5 rounded-xl transition-all shadow-md hover:shadow-sm hover:translate-y-0.5 disabled:opacity-50 uppercase tracking-widest text-sm"
                        >
                          <Save className="w-5 h-5" /> {isSaving ? "Guardando..." : "Guardar Notas"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* --- MODAL SEPARADO PARA CREAR/EDITAR NOMBRE DE ACTIVIDAD --- */}
      <InputModalComponent
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onSubmit={handleModalSubmit}
        title={editingAssignmentId ? "Editar Nombre" : "Nueva Actividad"}
        description={
          editingAssignmentId 
            ? "Modifique el nombre de esta evaluación." 
            : "Ingrese el nombre del trabajo o evaluación que desea calificar."
        }
        initialValue={modalInitialValue}
        buttonText={editingAssignmentId ? "Guardar" : "Crear"}
      />

      {/* MODAL DE ALERTAS (chadcn) */}
      <ModalComponent isOpen={modalConfig.isOpen} onClose={closeModal} type={modalConfig.type} title={modalConfig.title} message={modalConfig.message} />
    </div>
  );
};

export default TeacherGrades;