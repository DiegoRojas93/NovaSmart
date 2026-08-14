import { useState, useEffect, type FormEvent } from "react";
import { BookOpen, MapPin, Clock, Users, ChevronDown, ChevronUp, CheckSquare, UserCircle, Save, Calendar, Check, X, FileText, MessageSquare, ArrowLeft, Trash2 } from "lucide-react";
import { ModalComponent } from "@/shared/Basics/ModalComponent"; 

// --- INTERFACES ---
type AttendanceStatus = "PRESENTE" | "AUSENTE" | "LLEGO_TARDE" | "JUSTIFICADO";

interface Student {
  id: string;
  name: string;
  document: string;
}

interface StudentAttendance {
  enrollmentId: number; 
  studentId: number;
  name: string;
  status: AttendanceStatus;
  observations: string;
}

interface AssignedClass {
  id: string;
  subject: string;
  subjectCode: string;
  course: string;
  classroom: string;
  schedules: string[]; 
  students: Student[];
}

interface Props {
  institutionId: number;
  teacherId: number; 
}

const TeacherClassManager = ({ institutionId, teacherId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS GLOBALES ---
  const [activeView, setActiveView] = useState<"list" | "attendance">("list");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  
  // --- ESTADOS DE LA VISTA DE LISTA ---
  const [teacherClasses, setTeacherClasses] = useState<AssignedClass[]>([]);
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);

  // --- ESTADOS DE LA VISTA DE ASISTENCIA ---
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [attendanceList, setAttendanceList] = useState<StudentAttendance[]>([]);

  // --- ESTADO MODAL ---
  const [modalConfig, setModalConfig] = useState({
    isOpen: false, type: "success" as "success" | "error", title: "", message: "",
  });
  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  const activeClass = teacherClasses.find(c => c.id === selectedClassId);

  // --- EFECTO 1: CARGAR LAS CLASES DEL PROFESOR ---
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
        } else {
          throw new Error("Error al cargar las clases asignadas");
        }
      } catch (error) {
        console.error(error);
        setModalConfig({ isOpen: true, type: "error", title: "Error", message: "No se pudieron cargar las clases del profesor." });
      } finally {
        setIsLoadingClasses(false);
      }
    };

    // Validación más segura
    if (institutionId != null && teacherId != null) {
      fetchClasses();
    }
  }, [institutionId, teacherId, apiUrl]);

  // --- EFECTO 2: CARGAR ASISTENCIA POR FECHA Y CLASE ---
  useEffect(() => {
    const fetchAttendance = async () => {
      if (activeView !== "attendance" || !selectedClassId) return;

      setIsLoadingAttendance(true);
      try {
        const res = await fetch(`${apiUrl}/attendances/${institutionId}/${selectedClassId}?date=${date}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
          const data: StudentAttendance[] = await res.json();
          setAttendanceList(data.map(item => ({ ...item, observations: item.observations || "" })));
        } else {
          throw new Error("Error al cargar la asistencia");
        }
      } catch (error) {
        console.error("Error cargando lista de alumnos:", error);
        setModalConfig({ isOpen: true, type: "error", title: "Error de Conexión", message: "No se pudo cargar la asistencia de la base de datos." });
      } finally {
        setIsLoadingAttendance(false);
      }
    };

    fetchAttendance();
  }, [activeView, selectedClassId, date, institutionId, apiUrl]);

  // --- MANEJADORES DE VISTA ---
  const toggleExpand = (id: string) => {
    setExpandedClassId(prev => prev === id ? null : id);
  };

  const handleOpenAttendance = (classId: string) => {
    setSelectedClassId(classId);
    setActiveView("attendance");
  };

  const handleBackToList = () => {
    setActiveView("list");
    setSelectedClassId(null);
    setDate(new Date().toISOString().split("T")[0]);
  };

  // --- MANEJADORES DE ASISTENCIA ---
  const handleStatusChange = (enrollmentId: number, newStatus: AttendanceStatus) => {
    setAttendanceList(prev => prev.map(s => s.enrollmentId === enrollmentId ? { ...s, status: newStatus } : s));
  };

  const handleObservationChange = (enrollmentId: number, text: string) => {
    setAttendanceList(prev => prev.map(s => s.enrollmentId === enrollmentId ? { ...s, observations: text } : s));
  };

  const markAllAsPresent = () => {
    setAttendanceList(prev => prev.map(s => ({ ...s, status: "PRESENTE" })));
  };

  // --- GUARDAR O ACTUALIZAR (UPSERT AL BACKEND) ---
  const handleSubmitAttendance = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      classroomSubjectId: Number(selectedClassId),
      attendanceDate: date,
      records: attendanceList.map(s => ({
        enrollmentId: s.enrollmentId,
        status: s.status,
        observations: s.observations
      }))
    };

    try {
      const res = await fetch(`${apiUrl}/attendances/${institutionId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Fallo al guardar asistencia");
      
      setModalConfig({ isOpen: true, type: "success", title: "¡Éxito!", message: "Asistencia guardada correctamente." });
      handleBackToList();
    } catch (error) {
      console.error(error);
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "Hubo un error al guardar la asistencia." });
    } finally {
      setIsSaving(false);
    }
  };

  // --- ELIMINAR ASISTENCIA DEL DÍA ---
  const handleDeleteAttendance = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar el registro de asistencia del día ${date}?`)) return;

    setIsSaving(true);
    try {
      const res = await fetch(`${apiUrl}/attendances/${institutionId}/${selectedClassId}?date=${date}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });

      if (!res.ok) throw new Error("Fallo al borrar");
      
      setModalConfig({ isOpen: true, type: "success", title: "Eliminado", message: "Registro de asistencia eliminado correctamente." });
      
      setActiveView("list");
      setTimeout(() => setActiveView("attendance"), 50); 
    } catch (error) {
      console.error(error);
      setModalConfig({ isOpen: true, type: "error", title: "Error", message: "No se pudo eliminar el registro." });
    } finally {
      setIsSaving(false);
    }
  };

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const chipClass = "bg-blue-900/10 text-blue-950 font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 text-sm border border-blue-900/10";
  const actionBtnClass = "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-black text-sm transition-all border-2 uppercase tracking-wider";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all";

  // --- COMPONENTES AUXILIARES ---
  const StatusButton = ({ enrollmentId, currentStatus, targetStatus, icon: Icon, label, colorClass }: any) => {
    const isSelected = currentStatus === targetStatus;
    return (
      <button
        type="button"
        onClick={() => handleStatusChange(enrollmentId, targetStatus)}
        className={`flex flex-col md:flex-row items-center justify-center gap-1.5 p-2 rounded-xl transition-all border-2 font-bold text-xs uppercase tracking-wider ${
          isSelected ? `${colorClass.active} border-transparent shadow-sm scale-105` : `border-blue-900/10 text-blue-900/40 hover:border-blue-900/30 bg-white/50`
        }`}
        title={label}
      >
        <Icon className="w-4 h-4" />
        <span className="hidden md:inline">{label}</span>
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* ----------------------------- */}
      {/* VISTA 1: DIRECTORIO DE CLASES */}
      {/* ----------------------------- */}
      {activeView === "list" && (
        <>
          <div className="mb-2">
            <h2 className="text-3xl font-black text-blue-950 mb-2">Mis Clases Asignadas</h2>
            <p className="text-blue-900/70 font-medium">
              Directorio completo de sus grupos en el periodo académico vigente. Consulte horarios y registre la asistencia.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {isLoadingClasses ? (
              <div className="text-center py-10 font-bold text-blue-900/50 animate-pulse">
                Cargando sus clases asignadas...
              </div>
            ) : teacherClasses.length === 0 ? (
               <div className="text-center py-10 font-bold text-blue-900/50">
                No tiene clases asignadas en este periodo.
              </div>
            ) : teacherClasses.map((cls) => {
              const isExpanded = expandedClassId === cls.id;

              return (
                <div key={cls.id} className={`border-2 rounded-3xl bg-transparent transition-all overflow-hidden ${isExpanded ? "border-blue-900 shadow-[6px_6px_0_rgba(30,58,138,0.2)]" : "border-blue-900/30 hover:border-blue-900/60"}`}>
                  {/* CABECERA (Clickeable) */}
                  <div onClick={() => toggleExpand(cls.id)} className={`p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${isExpanded ? "bg-blue-900/5" : "hover:bg-blue-900/5"}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md transform -rotate-3">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-blue-950 flex items-center gap-2">
                          {cls.course} <span className="text-blue-900/40">|</span> {cls.subject}
                        </h3>
                        <p className="text-sm font-bold text-blue-900/60 uppercase tracking-widest">{cls.subjectCode}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                      <span className={chipClass}><MapPin className="w-4 h-4 text-blue-900/60" /> {cls.classroom}</span>
                      <span className={chipClass}><Users className="w-4 h-4 text-blue-900/60" /> {cls.students.length} Alumnos</span>
                      <button className="ml-2 p-2 rounded-full bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* CONTENIDO EXPANDIDO */}
                  {isExpanded && (
                    <div className="p-6 border-t-2 border-blue-900/20 border-dashed animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        <div className="lg:col-span-1 flex flex-col gap-6">
                          <div>
                            <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Horario Semanal</h4>
                            <div className="flex flex-col gap-2">
                              {cls.schedules.length > 0 ? cls.schedules.map((schedule, idx) => (
                                <div key={idx} className="bg-white border-2 border-blue-900/10 p-3 rounded-xl font-bold text-blue-950 text-sm shadow-sm flex items-center justify-between">
                                  <span>{schedule.split(" ")[0]}</span>
                                  <span className="text-blue-900/60 bg-blue-900/10 px-2 py-0.5 rounded-md">{schedule.split(" ").slice(1).join(" ")}</span>
                                </div>
                              )) : (
                                <div className="text-sm text-blue-900/50">Sin horario asignado</div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-3 flex items-center gap-2"><CheckSquare className="w-4 h-4" /> Accesos Rápidos</h4>
                            <div className="flex flex-col gap-3">
                              <button onClick={() => handleOpenAttendance(cls.id)} className={`${actionBtnClass} border-blue-900 bg-blue-900 text-white shadow-[3px_3px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5`}>
                                <CheckSquare className="w-5 h-5" /> Tomar Asistencia
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-2">
                          <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Listado Oficial ({cls.students.length})</h4>
                          <div className="bg-white border-2 border-blue-900/20 rounded-2xl overflow-hidden shadow-sm">
                            <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                              <table className="w-full text-left border-collapse">
                                <thead className="bg-blue-900/5 sticky top-0 backdrop-blur-sm">
                                  <tr>
                                    <th className="py-2 px-4 font-black text-blue-950 text-xs uppercase tracking-widest border-b-2 border-blue-900/10 w-12 text-center">N°</th>
                                    <th className="py-2 px-4 font-black text-blue-950 text-xs uppercase tracking-widest border-b-2 border-blue-900/10">Apellidos y Nombres</th>
                                    <th className="py-2 px-4 font-black text-blue-950 text-xs uppercase tracking-widest border-b-2 border-blue-900/10 text-right">Documento</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cls.students.length > 0 ? cls.students.map((student, idx) => (
                                    <tr key={student.id} className="border-b border-blue-900/5 hover:bg-blue-900/5 transition-colors">
                                      <td className="py-3 px-4 font-bold text-blue-900/50 text-center text-sm">{idx + 1}</td>
                                      <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                          <UserCircle className="w-5 h-5 text-blue-900/40" />
                                          <span className="font-bold text-blue-950 text-sm">{student.name}</span>
                                        </div>
                                      </td>
                                      <td className="py-3 px-4 text-right font-medium text-blue-900/70 text-sm">{student.document}</td>
                                    </tr>
                                  )) : (
                                    <tr>
                                      <td colSpan={3} className="py-4 text-center text-sm font-bold text-blue-900/50">No hay alumnos en esta clase</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ----------------------------- */}
      {/* VISTA 2: TOMA DE ASISTENCIA */}
      {/* ----------------------------- */}
      {activeView === "attendance" && activeClass && (
        <div className="animate-in slide-in-from-right-8 duration-500">
          
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <button onClick={handleBackToList} className="flex items-center gap-2 text-blue-900 font-bold hover:text-blue-950 mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver a clases
              </button>
              <h2 className="text-3xl font-black text-blue-950 flex items-center gap-2">
                Asistencia: {activeClass.course} <span className="text-blue-900/40">|</span> {activeClass.subject}
              </h2>
            </div>
            
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={handleDeleteAttendance} 
                title="Eliminar asistencia del día" 
                className="bg-white px-4 py-2 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 shadow-sm flex items-center transition-colors"
              >
                <Trash2 className="w-5 h-5"/>
              </button>
              <div className="bg-white px-4 py-2 rounded-xl border-2 border-blue-900/20 shadow-sm flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-900/60"/>
                <input 
                  type="date" 
                  className="bg-transparent font-bold text-blue-950 outline-none" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  max={new Date().toISOString().split("T")[0]} 
                  required 
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitAttendance} className="flex flex-col gap-6">
            <div className={bentoCardClass}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-blue-900/80 pb-2 mb-4 gap-4">
                <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2 m-0">
                  <CheckSquare className="w-5 h-5"/> Listado de Alumnos ({attendanceList.length})
                </h3>
                <button type="button" onClick={markAllAsPresent} className="text-xs font-black bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white px-4 py-2 rounded-xl transition-colors uppercase tracking-wider">
                  Restablecer (Todos Presentes)
                </button>
              </div>

              {isLoadingAttendance ? (
                <div className="py-12 flex flex-col items-center text-center text-blue-900/40 animate-pulse">
                  <Users className="w-12 h-12 mb-2 opacity-50" />
                  <p className="font-bold text-lg">Cargando alumnos...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {attendanceList.length > 0 ? attendanceList.map((student, index) => (
                    <div key={student.enrollmentId} className={`flex flex-col xl:flex-row gap-4 p-4 rounded-2xl border-2 transition-colors ${student.status === "AUSENTE" ? "border-red-900/30 bg-red-50/50" : student.status === "LLEGO_TARDE" ? "border-yellow-900/30 bg-yellow-50/50" : "border-blue-900/10 bg-white/40 hover:border-blue-900/30"}`}>
                      
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">{index + 1}</div>
                        <h4 className="font-bold text-blue-950 text-base">{student.name}</h4>
                      </div>

                      <div className="grid grid-cols-4 gap-2 xl:w-1/2">
                        <StatusButton enrollmentId={student.enrollmentId} currentStatus={student.status} targetStatus="PRESENTE" icon={Check} label="Presente" colorClass={{ active: "bg-green-500 text-white" }} />
                        <StatusButton enrollmentId={student.enrollmentId} currentStatus={student.status} targetStatus="AUSENTE" icon={X} label="Ausente" colorClass={{ active: "bg-red-500 text-white" }} />
                        <StatusButton enrollmentId={student.enrollmentId} currentStatus={student.status} targetStatus="LLEGO_TARDE" icon={Clock} label="Tarde" colorClass={{ active: "bg-yellow-500 text-white" }} />
                        <StatusButton enrollmentId={student.enrollmentId} currentStatus={student.status} targetStatus="JUSTIFICADO" icon={FileText} label="Excusa" colorClass={{ active: "bg-blue-600 text-white" }} />
                      </div>

                      <div className={`xl:w-1/4 transition-opacity duration-300 ${student.status === 'PRESENTE' ? 'opacity-30 focus-within:opacity-100' : 'opacity-100'}`}>
                        <div className="relative">
                          <MessageSquare className="absolute left-0 top-1.5 w-4 h-4 text-blue-900/40" />
                          <input type="text" placeholder="Nota (Opcional)" className={`${inputClass} pl-6 text-sm py-0 border-b`} value={student.observations} onChange={(e) => handleObservationChange(student.enrollmentId, e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="py-12 flex flex-col items-center text-center text-blue-900/40">
                      <Users className="w-12 h-12 mb-2 opacity-50" />
                      <p className="font-bold text-lg">No hay alumnos matriculados en este curso.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {attendanceList.length > 0 && (
              <div className="flex justify-end mt-2 sticky bottom-4 z-50">
                <button type="submit" disabled={isSaving || isLoadingAttendance} className={`flex items-center gap-3 px-8 py-4 bg-white border-4 border-blue-900 text-blue-950 font-black text-xl rounded-2xl transition-all uppercase tracking-widest shadow-[6px_6px_0_rgba(30,58,138,0.3)] ${isSaving || isLoadingAttendance ? "opacity-50 cursor-not-allowed bg-blue-50" : "hover:bg-blue-900 hover:text-white hover:shadow-[2px_2px_0_rgba(30,58,138,0.3)] hover:translate-y-1 hover:translate-x-1"}`}>
                  <Save className="w-6 h-6" /> {isSaving ? "Guardando Registro..." : "Sellar Asistencia"}
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* MODAL REUTILIZABLE */}
      <ModalComponent isOpen={modalConfig.isOpen} onClose={closeModal} type={modalConfig.type} title={modalConfig.title} message={modalConfig.message} />
    </div>
  );
};

export default TeacherClassManager;