import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, Users, BookOpen, MapPin, CheckCircle2, TrendingUp, TrendingDown, ChevronLeft, Award, BarChart3, AlertCircle, Search, User, FileX, FileCheck, Loader2 } from "lucide-react";

// --- INTERFACES BASADAS EN EL DTO DEL BACKEND ---
interface KPIs {
  totalEstudiantes: number;
  cursosAsignados: number;
  clasesHoy: number;
  promedioGlobal: number;
}

interface Schedule {
  id: number;
  startTime: string;
  endTime: string;
  subject: string;
  course: string;
  classroom: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

interface Group {
  id: number; // classroom_subject_id
  course: string;
  gradeLevel: string;
  subject: string;
  studentsCount: number;
  groupAvg: number;
  gradeAvg: number;
}

interface StudentPerformance {
  id: string;
  name: string;
  photo: string | null;
  avg: number;
  attendance: number;
  submittedTasks: number;
  missingTasks: number;
}

interface Props {
  institutionId: number;
  teacherId: number;
}

// --- COMPONENTES AUXILIARES ---
const getGradeColors = (grade: number) => {
  if (grade >= 4.0) return { text: "text-green-700", bg: "bg-green-100", border: "border-green-200", bar: "bg-green-500", label: "Sobresaliente" };
  if (grade >= 3.0) return { text: "text-yellow-700", bg: "bg-yellow-100", border: "border-yellow-200", bar: "bg-yellow-500", label: "Aceptable" };
  return { text: "text-red-700", bg: "bg-red-100", border: "border-red-200", bar: "bg-red-500", label: "En Riesgo" };
};

const getAttendanceColor = (percentage: number) => {
  if (percentage >= 90) return "text-green-600 border-green-600";
  if (percentage >= 80) return "text-yellow-600 border-yellow-600";
  return "text-red-600 border-red-600";
};

const DiffBadge = ({ diff, label }: { diff: number, label: string }) => {
  const isPositive = diff > 0;
  const isNeutral = diff === 0;
  
  return (
    <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border shadow-sm w-fit transition-transform hover:scale-105 ${
      isPositive ? 'bg-green-50 text-green-700 border-green-200' : 
      isNeutral ? 'bg-gray-50 text-gray-600 border-gray-200' : 
      'bg-red-50 text-red-700 border-red-200'
    }`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : isNeutral ? null : <TrendingDown className="w-3 h-3" />}
      <span>{diff > 0 ? '+' : ''}{Math.abs(diff).toFixed(1)} {label}</span>
    </div>
  );
};

const TeacherDashboard = ({ institutionId, teacherId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS GLOBALES ---
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [todaysSchedule, setTodaysSchedule] = useState<Schedule[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupStudents, setGroupStudents] = useState<StudentPerformance[]>([]);
  
  const [studentSearch, setStudentSearch] = useState("");
  const [animateBars, setAnimateBars] = useState(false);
  
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // --- 1. CARGAR DASHBOARD GENERAL ---
  const fetchOverview = useCallback(async () => {
    if (!institutionId || !teacherId) return;
    setIsLoadingOverview(true);
    try {
      const res = await fetch(`${apiUrl}/teacher-dashboard/${institutionId}/${teacherId}/overview`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setKpis(data.kpis);
        // Formatear las horas del backend (que vienen como "07:00:00") a "07:00"
        const formattedSchedule = data.todaysSchedule.map((s: any) => ({
          ...s,
          startTime: s.startTime.substring(0, 5),
          endTime: s.endTime.substring(0, 5)
        }));
        setTodaysSchedule(formattedSchedule);
        setGroups(data.groups);
      }
    } catch (error) {
      console.error("Error cargando el dashboard:", error);
    } finally {
      setIsLoadingOverview(false);
    }
  }, [institutionId, teacherId, apiUrl]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  // --- 2. CARGAR DETALLE DEL GRUPO (DRILL-DOWN) ---
  const handleGroupClick = async (group: Group) => {
    setSelectedGroup(group);
    setIsLoadingStudents(true);
    setStudentSearch("");
    setAnimateBars(false); // Reiniciamos animación
    
    try {
      const res = await fetch(`${apiUrl}/teacher-dashboard/${institutionId}/group/${group.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGroupStudents(data);
        // Retraso para que las barras se animen desde cero tras cargar los datos
        setTimeout(() => setAnimateBars(true), 100);
      }
    } catch (error) {
      console.error("Error cargando estudiantes del grupo:", error);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // --- ESTILOS COMPARTIDOS ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('es-ES', options);

  // ============================================================================
  // PANTALLA DE CARGA INICIAL
  // ============================================================================
  if (isLoadingOverview || !kpis) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-blue-900/50">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h3 className="text-xl font-black">Cargando métricas...</h3>
        <p className="font-medium">Calculando el rendimiento de tus grupos</p>
      </div>
    );
  }

  // ============================================================================
  // VISTA 1: DASHBOARD PRINCIPAL
  // ============================================================================
  if (!selectedGroup) {
    return (
      <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="mb-2 border-b-4 border-blue-900/20 pb-4">
          <h2 className="text-4xl font-black text-blue-950 mb-1 animate-in fade-in slide-in-from-left-4 duration-700">¡Hola, Profesor!</h2>
          <p className="text-blue-900/80 font-bold capitalize flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            <Calendar className="w-4 h-4" /> {today}
          </p>
        </div>

        {/* KPIs (Animación escalonada) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Estudiantes", value: kpis.totalEstudiantes, icon: Users, color: "bg-white/40 text-blue-900" },
            { title: "Cursos", value: kpis.cursosAsignados, icon: BookOpen, color: "bg-white/40 text-blue-900" },
            { title: "Clases Hoy", value: kpis.clasesHoy, icon: Clock, color: "bg-white/40 text-blue-900" },
            { title: "Promedio Global", value: kpis.promedioGlobal.toFixed(1), icon: Award, color: "bg-blue-900 text-white shadow-[4px_4px_0_rgba(30,58,138,0.2)]" }
          ].map((kpi, idx) => (
            <div 
              key={idx} 
              className={`border-2 border-blue-900/20 rounded-2xl p-5 flex flex-col gap-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-in fade-in zoom-in-95 fill-mode-both ${kpi.color}`}
              style={{ animationDelay: `${idx * 100}ms`, animationDuration: '500ms' }}
            >
              <div className={`flex justify-between items-center mb-2 ${kpi.color.includes('bg-blue-900') ? 'text-white/80' : 'text-blue-900/80'}`}>
                <span className="text-xs font-bold uppercase tracking-widest">{kpi.title}</span>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className="text-4xl font-black">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* HORARIO Y CURSOS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-2">
          
          {/* Horario */}
          <div className={`xl:col-span-2 ${bentoCardClass}`}>
            <h3 className={bentoTitleClass}><Clock className="w-5 h-5"/> Tu Horario de Hoy</h3>
            <div className="flex flex-col gap-0 relative">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-blue-900/20 hidden sm:block"></div>
              {todaysSchedule.length > 0 ? todaysSchedule.map((clase, idx) => (
                <div 
                  key={clase.id} 
                  className="relative flex gap-4 sm:gap-6 items-stretch p-2 group animate-in fade-in slide-in-from-right-8 fill-mode-both"
                  style={{ animationDelay: `${idx * 150}ms`, animationDuration: '600ms' }}
                >
                  <div className="flex flex-col items-center gap-1 w-16 sm:w-20 shrink-0 pt-2 z-10">
                    <span className="font-black text-blue-950 text-sm sm:text-base">{clase.startTime}</span>
                    <div className={`w-4 h-4 rounded-full border-4 ring-4 ring-white transition-transform duration-300 group-hover:scale-125 ${
                      clase.status === 'COMPLETED' ? 'bg-green-500 border-green-200' :
                      clase.status === 'IN_PROGRESS' ? 'bg-blue-600 border-blue-200 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]' :
                      'bg-gray-300 border-gray-100'
                    }`}></div>
                    <span className="text-xs font-bold text-blue-900/50 mt-1">{clase.endTime}</span>
                  </div>
                  <div className={`flex-1 border-2 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    clase.status === 'IN_PROGRESS' 
                      ? 'border-blue-900 bg-blue-900/5 shadow-[4px_4px_0_rgba(30,58,138,0.3)]' 
                      : 'border-blue-900/20 hover:border-blue-900/50 bg-white/50'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <div>
                        <h4 className="text-lg font-black text-blue-950 leading-none">{clase.subject}</h4>
                        <p className="text-blue-900/80 font-bold mt-1 text-sm">Curso: {clase.course}</p>
                      </div>
                      {clase.status === 'COMPLETED' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg"><CheckCircle2 className="w-4 h-4" /> Finalizada</span>
                      )}
                      {clase.status === 'IN_PROGRESS' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 bg-blue-100 px-2 py-1 rounded-lg relative overflow-hidden">
                          <span className="absolute inset-0 bg-blue-200/50 animate-pulse"></span>
                          <span className="relative">En curso ahora</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-900/70 bg-white px-3 py-2 rounded-xl border border-blue-900/10 w-fit mt-3">
                      <MapPin className="w-4 h-4" /> {clase.classroom}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-blue-900/50 font-bold">No tienes clases programadas para el día de hoy.</div>
              )}
            </div>
          </div>

          {/* Resumen de Grupos */}
          <div className={`${bentoCardClass} bg-white/40`}>
            <h3 className={bentoTitleClass}><BarChart3 className="w-5 h-5"/> Mis Grupos</h3>
            <p className="text-xs font-medium text-blue-900/70 mb-2">Haz clic en un grupo para ver el rendimiento detallado.</p>
            
            <div className="flex flex-col gap-3">
              {groups.map((group, idx) => {
                const diff = Number((group.groupAvg - group.gradeAvg).toFixed(1));
                const colors = getGradeColors(group.groupAvg);

                return (
                  <div 
                    key={group.id} 
                    onClick={() => handleGroupClick(group)}
                    className="flex flex-col p-4 border-2 border-blue-900/10 bg-white hover:border-blue-900 hover:bg-blue-50/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[4px_4px_0_rgba(30,58,138,0.2)] cursor-pointer group animate-in fade-in zoom-in-95 fill-mode-both"
                    style={{ animationDelay: `${idx * 150}ms`, animationDuration: '500ms' }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-black text-blue-950 text-lg leading-none group-hover:text-blue-900 transition-colors">Curso {group.course}</h4>
                        <p className="text-xs text-blue-900/70 font-bold mt-1">{group.subject}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-xl border font-black text-lg transition-transform group-hover:scale-110 ${colors.bg} ${colors.text} ${colors.border}`}>
                        {group.groupAvg.toFixed(1)}
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t-2 border-blue-900/5 pt-3">
                      <div className="flex items-center gap-2 text-blue-900/60">
                        <Users className="w-4 h-4" /> <span className="text-xs font-bold">{group.studentsCount} Alumnos</span>
                      </div>
                      <DiffBadge diff={diff} label={`vs Prom. ${group.gradeLevel}`} />
                    </div>
                  </div>
                );
              })}
              
              {groups.length === 0 && (
                <div className="p-8 text-center text-blue-900/50 font-bold border-2 border-blue-900/20 border-dashed rounded-2xl bg-blue-900/5">
                  No tienes grupos asignados en este periodo académico.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ============================================================================
  // VISTA 2: DETALLE DEL GRUPO (DRILL-DOWN)
  // ============================================================================
  const groupColors = getGradeColors(selectedGroup.groupAvg);
  const diffGroup = Number((selectedGroup.groupAvg - selectedGroup.gradeAvg).toFixed(1));

  const filteredStudents = groupStudents.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in slide-in-from-right-8 duration-500">
      
      {/* Botón Volver y Título */}
      <div className="mb-2">
        <button 
          onClick={() => setSelectedGroup(null)}
          className="flex items-center gap-2 text-blue-900 font-bold hover:text-blue-950 transition-all hover:-translate-x-1 mb-4 bg-white/50 px-4 py-2 rounded-xl w-fit border border-blue-900/10 hover:bg-blue-900/10"
        >
          <ChevronLeft className="w-4 h-4" /> Volver al Dashboard
        </button>
        <h2 className="text-3xl font-black text-blue-950 mb-1 flex items-center gap-3">
          Curso {selectedGroup.course} <span className="text-blue-900/30">|</span> {selectedGroup.subject}
        </h2>
        <p className="text-blue-900/70 font-medium">Análisis de rendimiento, asistencia y tareas del grupo.</p>
      </div>

      {/* Tarjetas Analíticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Promedio del Grupo", icon: Award, value: selectedGroup.groupAvg.toFixed(1), extra: null, colorClass: `${groupColors.bg} ${groupColors.border} ${groupColors.text}` },
          { title: `Comparativa Grado ${selectedGroup.gradeLevel}`, icon: BarChart3, value: selectedGroup.gradeAvg.toFixed(1), extra: <DiffBadge diff={diffGroup} label="diferencia" />, colorClass: "bg-white/50 border-blue-900/20 text-blue-950" },
          { title: "Estudiantes Matriculados", icon: Users, value: selectedGroup.studentsCount, extra: null, colorClass: "bg-white/50 border-blue-900/20 text-blue-950" }
        ].map((card, idx) => (
          <div 
            key={idx} 
            className={`border-2 rounded-2xl p-5 flex flex-col gap-1 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-in fade-in zoom-in-95 fill-mode-both ${card.colorClass}`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={`flex justify-between items-center mb-2 ${card.colorClass.includes('bg-white') ? 'text-blue-900/80' : ''}`}>
              <span className="text-xs font-black uppercase tracking-widest">{card.title}</span>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="flex items-end gap-3 mt-1">
              <div className="text-4xl font-black">{card.value}</div>
              {card.extra && <div className="pb-1">{card.extra}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Panel Analítico Principal */}
      <div className={`${bentoCardClass} bg-white/40`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <h3 className={bentoTitleClass}><Users className="w-5 h-5"/> Rendimiento Individual</h3>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-blue-900/40 transition-colors peer-focus:text-blue-900" />
            <input 
              type="text" 
              placeholder="Buscar por nombre..."
              className="peer w-full bg-white border-2 border-blue-900/20 focus:border-blue-900 outline-none text-blue-950 py-2 pl-9 pr-3 rounded-xl text-sm font-bold transition-all shadow-sm"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-3 mt-2">
          {isLoadingStudents ? (
            <div className="py-12 flex flex-col items-center text-center text-blue-900/40 animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin mb-3 opacity-50" />
              <p className="font-bold text-lg">Cargando estudiantes...</p>
            </div>
          ) : filteredStudents.length > 0 ? filteredStudents.map((student, idx) => {
            const stuColors = getGradeColors(student.avg);
            const stuDiff = Number((student.avg - selectedGroup.groupAvg).toFixed(1));
            const percentage = (student.avg / 5.0) * 100;

            return (
              <div 
                key={student.id} 
                className="flex flex-col xl:flex-row items-start xl:items-center gap-4 p-4 border-2 border-blue-900/10 rounded-2xl bg-white hover:border-blue-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                
                {/* 1. Avatar e Info */}
                <div className="flex items-center gap-4 xl:w-1/3 w-full">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-900/10 bg-blue-50 shrink-0 transition-transform hover:scale-110">
                    {student.photo ? (
                      <img src={`${apiUrl}/files/${student.photo}`} alt={student.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 m-auto mt-2.5 text-blue-900/40" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-blue-950 text-base leading-tight truncate max-w-[200px] sm:max-w-xs">{student.name}</h4>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${stuColors.text}`}>{stuColors.label}</span>
                  </div>
                </div>

                <div className="flex-1 w-full flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                  
                  {/* 2. Barra de Progreso */}
                  <div className="flex-1 w-full min-w-[150px]">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] font-bold text-blue-900/50 uppercase tracking-widest">Promedio Actual</span>
                      <span className={`font-black text-lg leading-none ${stuColors.text}`}>{student.avg.toFixed(1)}</span>
                    </div>
                    <div className="w-full h-2.5 bg-blue-900/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${stuColors.bar}`} 
                        style={{ width: animateBars ? `${percentage}%` : '0%' }}
                      ></div>
                    </div>
                  </div>

                  {/* 3. Asistencia y Tareas */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex flex-col items-center justify-center bg-blue-900/5 border border-blue-900/10 px-3 py-1.5 rounded-xl transition-colors hover:bg-blue-900/10">
                      <span className="text-[10px] font-bold text-blue-900/60 uppercase tracking-widest mb-0.5">Asistencia</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2.5 h-2.5 rounded-full border-[3px] bg-white ${getAttendanceColor(student.attendance)}`}></div>
                        <span className="font-black text-blue-950 text-sm">{student.attendance}%</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-md text-[10px] font-black uppercase transition-transform hover:scale-105 cursor-default">
                        <FileCheck className="w-3 h-3" /> {student.submittedTasks} Entregadas
                      </div>
                      <div className={`flex items-center gap-1.5 border px-2 py-0.5 rounded-md text-[10px] font-black uppercase transition-transform hover:scale-105 cursor-default ${
                        student.missingTasks > 0 ? "bg-red-50 border-red-200 text-red-700" : "bg-gray-50 border-gray-200 text-gray-500"
                      }`}>
                        <FileX className="w-3 h-3" /> {student.missingTasks} Faltantes
                      </div>
                    </div>
                  </div>

                  {/* 4. Comparativa */}
                  <div className="flex items-center gap-3 shrink-0 md:w-32 justify-end">
                    <DiffBadge diff={stuDiff} label="vs Grupo" />
                    {student.avg < 3.0 && (
                      <div title="Estudiante en riesgo académico">
                        <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          }) : (
            <div className="py-12 flex flex-col items-center text-center text-blue-900/40 border-2 border-blue-900/20 border-dashed rounded-3xl bg-blue-900/5 animate-in fade-in zoom-in-95">
              <Search className="w-12 h-12 mb-3 opacity-50" />
              <p className="font-black text-xl">Sin resultados</p>
              <p className="text-sm font-medium mt-1">No se encontraron estudiantes que coincidan con la búsqueda.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default TeacherDashboard;