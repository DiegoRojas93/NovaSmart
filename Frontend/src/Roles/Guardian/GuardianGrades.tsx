import { useState, useEffect, useCallback } from "react";
import { Award, BookOpen, Calendar, TrendingUp, TrendingDown, MessageSquare, AlertTriangle, UserCircle, CheckCircle2, ChevronDown, ChevronUp, FileText, UserX, Clock, Search, User, Loader2 } from "lucide-react";

// --- INTERFACES ---
interface Props {
  institutionId: number;
  guardianId: number;
}

interface Child {
  id: string;
  name: string;
  course: string;
  photo: string | null;
}

interface Period {
  id: string;
  name: string;
}

interface TaskDetail {
  id: string;
  title: string;
  grade: number | null;
  date: string;
}

interface AttendanceDetail {
  id: string;
  date: string;
  type: "AUSENTE" | "LLEGO_TARDE";
}

interface StudentGrade {
  id: string;
  subject: string;
  teacher: string;
  teacherPhoto: string | null;
  grade: number;
  observations: string | null;
  tasks: TaskDetail[];
  absences: AttendanceDetail[];
}

const GuardianGrades = ({ institutionId, guardianId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS DE DATOS ---
  const [children, setChildren] = useState<Child[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [rawGrades, setRawGrades] = useState<StudentGrade[]>([]);

  // --- ESTADOS DE SELECCIÓN ---
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- ESTADOS DE UI ---
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);

  // --- OBTENER SELECTORES INICIALES ---
  const fetchInitialData = useCallback(async () => {
    if (!institutionId || !guardianId) return;
    setIsLoadingInitial(true);
    try {
      const res = await fetch(`${apiUrl}/guardian-grades/initial-data/${institutionId}/${guardianId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChildren(data.children || []);
        setPeriods(data.periods || []);
        
        // Autoseleccionar el primer estudiante y periodo si existen
        if (data.children && data.children.length > 0) {
          setSelectedStudentId(data.children[0].id);
        }
        if (data.periods && data.periods.length > 0) {
          setSelectedPeriod(data.periods[0].id);
        }
      }
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
    } finally {
      setIsLoadingInitial(false);
    }
  }, [institutionId, guardianId, apiUrl]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // --- OBTENER NOTAS AL CAMBIAR SELECTORES ---
  const fetchGrades = useCallback(async () => {
    if (!selectedStudentId || !selectedPeriod) return;
    setIsLoadingGrades(true);
    setExpandedSubjectId(null);
    setSearchTerm("");
    
    try {
      const res = await fetch(`${apiUrl}/guardian-grades/detail/${selectedStudentId}/${selectedPeriod}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRawGrades(data || []);
      }
    } catch (error) {
      console.error("Error cargando el boletín:", error);
      setRawGrades([]);
    } finally {
      setIsLoadingGrades(false);
    }
  }, [selectedStudentId, selectedPeriod, apiUrl]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  // --- DERIVACIÓN DE DATOS ---
  const currentGrades = rawGrades.filter(g => 
    g.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAverage = () => {
    if (rawGrades.length === 0) return 0;
    const sum = rawGrades.reduce((acc, curr) => acc + curr.grade, 0);
    return (sum / rawGrades.length).toFixed(1);
  };

  const average = parseFloat(calculateAverage() as string);
  const passedSubjects = rawGrades.filter(g => g.grade >= 3.0).length;
  const failedSubjects = rawGrades.length - passedSubjects;
  const selectedStudent = children.find(c => c.id === selectedStudentId);

  // --- MANEJADORES ---
  const toggleExpand = (id: string) => {
    setExpandedSubjectId(prev => prev === id ? null : id);
  };

  const getPhotoUrl = (photo: string | null) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    return `${apiUrl}/files/${photo}`;
  };

  const getGradeStyle = (grade: number) => {
    if (grade >= 4.5) return { bg: "bg-green-100", border: "border-green-300", text: "text-green-800", label: "Excelente", bar: "bg-green-500" };
    if (grade >= 3.0) return { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800", label: "Aprobado", bar: "bg-blue-500" };
    return { bg: "bg-red-100", border: "border-red-300", text: "text-red-800", label: "Reprobado", bar: "bg-red-500" };
  };

  // --- CLASES CSS COMPARTIDAS ---
  const bentoCardClass = "border-2 border-blue-900/30 hover:border-blue-900/40 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-all shadow-sm";
  const selectClass = "w-full bg-white border-2 border-blue-900/20 focus:border-blue-900 outline-none text-blue-950 px-4 py-2 font-black rounded-xl transition-all appearance-none cursor-pointer";

  // --- PANTALLA DE CARGA INICIAL ---
  if (isLoadingInitial) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-blue-900/50">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h3 className="text-xl font-black">Cargando boletín...</h3>
        <p className="font-medium">Obteniendo la información de tus acudidos</p>
      </div>
    );
  }

  // --- ESTADO: SIN ACUDIDOS ---
  if (children.length === 0) {
    return (
      <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
        <div className="py-20 flex flex-col items-center text-center text-blue-900/40 border-2 border-blue-900/20 border-dashed rounded-3xl bg-blue-900/5 animate-in zoom-in-95">
          <UserX className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-2xl font-black mb-1">Sin estudiantes asignados</h3>
          <p className="font-medium max-w-md">No tienes estudiantes asociados a tu cuenta de acudiente para consultar notas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA (Animada) */}
      <div className="mb-2 border-b-4 border-blue-900/20 pb-4">
        <h2 className="text-4xl font-black text-blue-950 mb-1 animate-in fade-in slide-in-from-left-4 duration-700">Seguimiento Académico</h2>
        <p className="text-blue-900/70 font-bold animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
          Consulte las notas definitivas, el detalle de tareas y la asistencia por cada materia.
        </p>
      </div>

      {/* CONTROLES DE SELECCIÓN (Estudiante y Periodo) */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-2 bg-blue-900/5 p-4 rounded-3xl border-2 border-blue-900/10 animate-in zoom-in-95 duration-500">
        
        {/* FOTO Y SELECTOR DEL ESTUDIANTE */}
        <div className="flex-1 w-full flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 border-2 border-blue-900/20 overflow-hidden shadow-sm">
            {selectedStudent?.photo ? (
              <img src={getPhotoUrl(selectedStudent.photo)!} alt={selectedStudent.name} className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-8 h-8 text-blue-900/40" />
            )}
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
              Estudiante:
            </label>
            <select 
              className={selectClass} 
              value={selectedStudentId} 
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {children.map(child => <option key={child.id} value={child.id}>{child.name} (Curso {child.course})</option>)}
            </select>
          </div>
        </div>
        
        {/* SELECTOR DE PERIODO */}
        <div className="w-full sm:w-1/3">
          <label className="text-[10px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
            <Calendar className="w-4 h-4"/> Periodo:
          </label>
          <select 
            className={selectClass} 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {/* RENDERIZADO DEL CONTENIDO DE NOTAS */}
      {isLoadingGrades ? (
        <div className="py-20 flex flex-col items-center justify-center text-blue-900/50">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-bold">Calculando notas del periodo...</p>
        </div>
      ) : rawGrades.length > 0 ? (
        <>
          {/* --- SECCIÓN 1: KPIs DEL PERIODO (Animados) --- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border-2 border-blue-900/20 bg-white/50 rounded-2xl p-5 flex flex-col gap-1 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-black uppercase tracking-widest">Promedio General</span>
                <Award className={`w-5 h-5 ${average >= 4.0 ? "text-yellow-500" : average >= 3.0 ? "text-blue-500" : "text-red-500"}`} />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-blue-950">{average}</span>
                <span className="text-sm font-bold text-blue-900/50 mb-1">/ 5.0</span>
              </div>
            </div>

            <div className="border-2 border-blue-900/20 bg-white/50 rounded-2xl p-5 flex flex-col gap-1 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '200ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-black uppercase tracking-widest">Aprobadas</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-green-700">{passedSubjects}</span>
                <span className="text-sm font-bold text-blue-900/50 mb-1">de {rawGrades.length}</span>
              </div>
            </div>

            <div className={`border-2 rounded-2xl p-5 flex flex-col gap-1 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${failedSubjects > 0 ? "border-red-900/30 bg-red-50/50" : "border-blue-900/20 bg-white/50"}`} style={{ animationDelay: '300ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-black uppercase tracking-widest">En Riesgo</span>
                {failedSubjects > 0 ? <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" /> : <TrendingDown className="w-5 h-5 text-blue-900/30" />}
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-4xl font-black ${failedSubjects > 0 ? "text-red-700" : "text-blue-950"}`}>{failedSubjects}</span>
                <span className="text-sm font-bold text-blue-900/50 mb-1">materias</span>
              </div>
            </div>
          </div>

          {/* --- SECCIÓN 2: DETALLE DE MATERIAS (ACORDEÓN) --- */}
          <div className={`${bentoCardClass} mt-2`}>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-blue-900/10 pb-4 mb-2 gap-4">
              <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2">
                <BookOpen className="w-5 h-5"/> Desglose por Materias
              </h3>

              {/* BUSCADOR / FILTRO */}
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-blue-900/40" />
                <input 
                  type="text" 
                  placeholder="Buscar materia o profesor..."
                  className="w-full bg-white border-2 border-blue-900/20 focus:border-blue-900 outline-none text-blue-950 py-2 pl-9 pr-3 rounded-xl text-sm font-bold transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {currentGrades.length > 0 ? currentGrades.map((record, idx) => {
                const style = getGradeStyle(record.grade);
                const isExpanded = expandedSubjectId === record.id;
                const totalAbsences = record.absences.length;

                return (
                  <div 
                    key={record.id} 
                    className={`flex flex-col border-2 rounded-2xl transition-all duration-300 overflow-hidden animate-in slide-in-from-bottom-4 fill-mode-both hover:-translate-y-1 ${
                      isExpanded ? "border-blue-900 shadow-[6px_6px_0_rgba(30,58,138,0.15)]" : "border-blue-900/20 bg-white hover:border-blue-900/50 shadow-sm"
                    }`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    
                    {/* CABECERA DE LA MATERIA (Clickeable) */}
                    <div 
                      onClick={() => toggleExpand(record.id)}
                      className={`flex flex-col md:flex-row gap-5 p-5 cursor-pointer items-start md:items-center justify-between transition-colors ${
                        isExpanded ? "bg-blue-900/5" : "hover:bg-blue-900/5"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 w-full md:w-auto flex-1">
                        
                        {/* Nota Principal Destacada */}
                        <div className={`flex flex-col items-center justify-center w-full md:w-24 shrink-0 py-3 rounded-xl border-2 ${style.bg} ${style.border}`}>
                          <span className={`text-3xl font-black ${style.text}`}>{record.grade.toFixed(1)}</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${style.text}`}>{style.label}</span>
                        </div>

                        {/* Info Materia y Profesor */}
                        <div className="flex-1 w-full text-center md:text-left flex flex-col gap-2">
                          <h4 className="text-xl font-black text-blue-950 leading-tight">{record.subject}</h4>
                          
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            {/* Foto y nombre del profesor */}
                            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-blue-900/10 shadow-sm">
                              {record.teacherPhoto ? (
                                <img src={getPhotoUrl(record.teacherPhoto)!} alt={record.teacher} className="w-5 h-5 rounded-full object-cover border border-blue-900/20" />
                              ) : (
                                <User className="w-4 h-4 text-blue-900/40" />
                              )}
                              <span className="text-[11px] font-bold text-blue-900/70">Prof. {record.teacher}</span>
                            </div>
                            
                            {/* Badges Rápidos */}
                            {totalAbsences > 0 && (
                              <span className="text-[10px] font-bold text-red-700 flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
                                <UserX className="w-3.5 h-3.5" /> {totalAbsences} Falla{totalAbsences > 1 ? 's' : ''}
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-blue-900/60 flex items-center gap-1.5 bg-blue-900/5 px-2.5 py-1 rounded-lg border border-blue-900/10">
                              <FileText className="w-3.5 h-3.5" /> {record.tasks.length} Entregables
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="p-2 rounded-full bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white transition-colors w-full md:w-auto shrink-0 mt-2 md:mt-0">
                        {isExpanded ? <ChevronUp className="w-5 h-5 mx-auto" /> : <ChevronDown className="w-5 h-5 mx-auto" />}
                      </button>
                    </div>

                    {/* CONTENIDO DESPLEGABLE (Tareas y Asistencia) */}
                    {isExpanded && (
                      <div className="p-5 md:p-6 border-t-2 border-blue-900/10 border-dashed animate-in slide-in-from-top-2 duration-300">
                        
                        {/* Observación del profesor */}
                        <div className="flex gap-3 items-start bg-blue-900/5 p-4 rounded-xl border border-blue-900/10 shadow-sm mb-6">
                          <MessageSquare className="w-5 h-5 text-blue-900/40 mt-0.5 shrink-0" />
                          <p className="text-sm font-medium text-blue-950/80 italic leading-relaxed">
                            <strong className="not-italic text-blue-900 font-black block mb-1 text-xs uppercase tracking-widest">Observación General del Periodo:</strong>
                            "{record.observations || "Sin observaciones registradas."}"
                          </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          
                          {/* Columna 1: Tareas / Notas parciales */}
                          <div>
                            <h5 className="text-xs font-black text-blue-900/70 uppercase tracking-widest mb-4 flex items-center gap-2 border-b-2 border-blue-900/10 pb-2">
                              <FileText className="w-4 h-4 text-blue-900" /> Trabajos Evaluados
                            </h5>
                            <div className="flex flex-col gap-3">
                              {record.tasks.length > 0 ? record.tasks.map(task => (
                                <div key={task.id} className="flex items-center justify-between bg-white p-3 px-4 rounded-xl border border-blue-900/10 hover:border-blue-900/30 transition-colors shadow-sm">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-bold text-blue-950">{task.title}</span>
                                    <span className="text-[10px] font-bold text-blue-900/50 flex items-center gap-1">
                                      <Calendar className="w-3 h-3" /> {task.date}
                                    </span>
                                  </div>
                                  <span className={`text-lg font-black px-3 py-1 rounded-lg border ${task.grade && task.grade >= 3.0 ? "bg-blue-50/50 text-blue-700 border-blue-200" : "bg-red-50/50 text-red-700 border-red-200"}`}>
                                    {task.grade ? task.grade.toFixed(1) : "N/A"}
                                  </span>
                                </div>
                              )) : (
                                <div className="p-4 bg-blue-900/5 rounded-xl border border-blue-900/10 text-center">
                                  <p className="text-xs font-bold text-blue-900/50">No hay notas de trabajos registrados aún.</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Columna 2: Asistencia */}
                          <div>
                            <h5 className="text-xs font-black text-blue-900/70 uppercase tracking-widest mb-4 flex items-center gap-2 border-b-2 border-blue-900/10 pb-2">
                              <UserX className="w-4 h-4 text-blue-900" /> Registro de Novedades
                            </h5>
                            <div className="flex flex-col gap-3">
                              {record.absences.length > 0 ? record.absences.map(abs => (
                                <div key={abs.id} className="flex items-center gap-3 bg-white p-3 px-4 rounded-xl border border-red-900/10 hover:border-red-900/30 transition-colors shadow-sm">
                                  {abs.type === "AUSENTE" ? (
                                    <div className="p-2 bg-red-500/10 rounded-lg shrink-0">
                                      <UserX className="w-4 h-4 text-red-600" />
                                    </div>
                                  ) : (
                                    <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
                                      <Clock className="w-4 h-4 text-amber-600" />
                                    </div>
                                  )}
                                  <div className="flex flex-col gap-0.5">
                                    <span className={`text-xs font-black uppercase tracking-wider ${abs.type === "AUSENTE" ? "text-red-700" : "text-amber-700"}`}>
                                      {abs.type === "AUSENTE" ? "Inasistencia Injustificada" : "Llegada Tarde"}
                                    </span>
                                    <span className="text-[10px] font-bold text-blue-900/50 flex items-center gap-1">
                                      <Calendar className="w-3 h-3" /> {abs.date}
                                    </span>
                                  </div>
                                </div>
                              )) : (
                                <div className="flex items-center gap-3 bg-green-500/5 p-4 rounded-xl border border-green-500/20 text-green-700">
                                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                                  <span className="text-xs font-bold">Excelente. Sin novedades de inasistencia.</span>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              }) : (
                <div className="py-12 flex flex-col items-center text-center text-blue-900/40 bg-blue-900/5 rounded-2xl border-2 border-blue-900/10 border-dashed animate-in zoom-in-95">
                  <Search className="w-12 h-12 mb-3 opacity-50" />
                  <p className="font-black text-xl">Sin resultados</p>
                  <p className="text-sm font-medium mt-1">No se encontraron materias que coincidan con "{searchTerm}".</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* --- ESTADO VACÍO (Sin notas en el periodo) --- */
        <div className="py-20 flex flex-col items-center text-center text-blue-900/40 border-2 border-blue-900/10 border-dashed rounded-3xl mt-4 bg-white/30 animate-in zoom-in-95">
          <Award className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-2xl font-black mb-1">Sin información</h3>
          <p className="font-medium max-w-md">No hay calificaciones registradas para {selectedStudent?.name.split(" ")[0]} en este periodo.</p>
        </div>
      )}

    </div>
  );
};

export default GuardianGrades;