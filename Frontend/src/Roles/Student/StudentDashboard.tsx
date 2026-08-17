import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, BookOpen, MapPin, AlertCircle, CheckCircle2, Target, CalendarDays, PlayCircle, ArrowRightCircle, User, Loader2 } from "lucide-react";

// --- INTERFACES BASADAS EN EL DTO DEL BACKEND ---
interface ClassBlock {
  subject: string;
  teacher: string;
  photo: string | null;
  time: string;
  classroom: string;
  isBreak: boolean;
}

interface ScheduleBlock {
  id: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  photo: string | null;
  classroom: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

interface PendingTask {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  isUrgent: boolean;
  type: string;
}

interface DashboardData {
  studentName: string;
  courseName: string;
  currentStatus: {
    currentClass: ClassBlock;
    nextClass: ClassBlock;
    pendingTasksCount: number;
  };
  weeklySchedule: Record<string, ScheduleBlock[]>;
  pendingTasks: PendingTask[];
}

interface Props {
  institutionId: number;
  studentId: number;
}

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const StudentDashboard = ({ institutionId, studentId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS ---
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Manejo de la pestaña del horario
  const currentDayIndex = new Date().getDay(); 
  const defaultDay = (currentDayIndex >= 1 && currentDayIndex <= 5) ? daysOfWeek[currentDayIndex - 1] : "Lunes";
  const [activeDay, setActiveDay] = useState<string>(defaultDay);

  // --- OBTENER DATOS DEL BACKEND ---
  const fetchDashboardData = useCallback(async () => {
    if (!institutionId || !studentId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/student-dashboard/${institutionId}/${studentId}/overview`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const dashboardData = await res.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error("Error cargando el dashboard del estudiante:", error);
    } finally {
      setIsLoading(false);
    }
  }, [institutionId, studentId, apiUrl]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- UTILIDADES ---
  const getPhotoUrl = (photo: string | null) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    return `${apiUrl}/files/${photo}`;
  };

  // --- CLASES DE ESTILO SHADCN + CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/30 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors shadow-sm";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/20 pb-2 w-full";
  
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('es-ES', options);

  // --- PANTALLA DE CARGA ---
  if (isLoading || !data) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-blue-900/50">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h3 className="text-xl font-black">Cargando tu espacio...</h3>
        <p className="font-medium">Sincronizando clases y tareas</p>
      </div>
    );
  }

  const { currentStatus, pendingTasks, weeklySchedule, studentName, courseName } = data;
  const todayClasses = weeklySchedule[activeDay] || [];

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA (Animada) */}
      <div className="mb-2 border-b-4 border-blue-900/20 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-blue-950 mb-1 animate-in fade-in slide-in-from-left-4 duration-700">¡Hola, {studentName}!</h2>
          <p className="text-blue-900/60 font-bold capitalize flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            <Calendar className="w-4 h-4" /> {today} | Curso {courseName}
          </p>
        </div>
      </div>

      {/* --- SECCIÓN 1: ESTADO ACTUAL (HERO ANIMADO) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Clase Actual (Destacada) */}
        <div className="md:col-span-2 relative overflow-hidden border-2 border-blue-500/50 bg-blue-900/5 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between group animate-in zoom-in-95 fill-mode-both duration-500 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-125 group-hover:bg-blue-500/20"></div>
          
          <div className="flex justify-between items-start mb-4 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-sm animate-pulse">
              <PlayCircle className="w-4 h-4" /> Clase Actual
            </div>
            <span className="font-black text-blue-900/50 text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" /> {currentStatus.currentClass.time}
            </span>
          </div>

          <div className="z-10">
            <h3 className="text-3xl sm:text-4xl font-black text-blue-950 leading-none mb-2">
              {currentStatus.currentClass.subject}
            </h3>
            
            {currentStatus.currentClass.teacher !== "N/A" && (
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="flex items-center gap-1.5 text-sm font-bold text-blue-900/80 bg-blue-900/10 border border-blue-900/20 px-3 py-1.5 rounded-xl transition-colors hover:bg-blue-900/20">
                  <MapPin className="w-4 h-4 text-blue-600" /> {currentStatus.currentClass.classroom}
                </span>
                
                {/* Avatar Profesor */}
                <div className="flex items-center gap-2 text-sm font-bold text-blue-900/80 bg-blue-900/10 border border-blue-900/20 px-3 py-1 rounded-xl transition-colors hover:bg-blue-900/20">
                  {currentStatus.currentClass.photo ? (
                    <img src={getPhotoUrl(currentStatus.currentClass.photo)!} alt="Profesor" className="w-6 h-6 rounded-full border border-blue-900/30 object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-blue-900/50" />
                  )}
                  <span>Prof. {currentStatus.currentClass.teacher}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Próxima Clase */}
        <div className="border-2 border-blue-900/30 bg-transparent rounded-3xl p-5 flex flex-col justify-between shadow-sm animate-in zoom-in-95 fill-mode-both duration-500 delay-100 hover:-translate-y-1 hover:shadow-md transition-all">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-blue-900/50 mb-3">
              <ArrowRightCircle className="w-4 h-4" /> Próxima Clase
            </div>
            <h4 className="text-xl font-black text-blue-950 leading-tight">
              {currentStatus.nextClass.subject}
            </h4>
            
            {currentStatus.nextClass.teacher !== "N/A" && (
              <div className="flex items-center gap-2 mt-2">
                {currentStatus.nextClass.photo ? (
                  <img src={getPhotoUrl(currentStatus.nextClass.photo)!} alt="Profesor" className="w-5 h-5 rounded-full border border-blue-900/30 object-cover" />
                ) : (
                  <User className="w-4 h-4 text-blue-900/40" />
                )}
                <p className="text-xs font-bold text-blue-900/60">Prof. {currentStatus.nextClass.teacher}</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t-2 border-blue-900/10 flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-blue-900/70">
              <Clock className="w-3.5 h-3.5" /> {currentStatus.nextClass.time}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-blue-900/70">
              <MapPin className="w-3.5 h-3.5" /> {currentStatus.nextClass.classroom}
            </span>
          </div>
        </div>

      </div>

      {/* --- SECCIÓN 2: HORARIO Y TAREAS --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-2">
        
        {/* COLUMNA IZQUIERDA: Horario Semanal */}
        <div className={`xl:col-span-2 ${bentoCardClass}`}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-2 border-b-2 border-blue-900/10 pb-4">
            <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2">
              <CalendarDays className="w-5 h-5"/> Horario Semanal
            </h3>
            
            {/* Tabs */}
            <div className="flex p-1 bg-blue-900/10 rounded-xl overflow-x-auto no-scrollbar w-full sm:w-auto border border-blue-900/20">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap ${
                    activeDay === day 
                      ? "bg-blue-900 text-white shadow-sm" 
                      : "text-blue-900/50 hover:text-blue-900 hover:bg-blue-900/5"
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-0 relative min-h-[250px]">
            {/* Línea conectora */}
            {todayClasses.length > 0 && <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-blue-900/20 hidden sm:block"></div>}

            {todayClasses.length > 0 ? todayClasses.map((clase, idx) => (
              <div 
                key={clase.id} 
                className="relative flex gap-4 sm:gap-6 items-stretch p-2 animate-in slide-in-from-right-4 duration-300" 
                style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "both" }}
              >
                
                <div className="flex flex-col items-center gap-1 w-16 sm:w-20 shrink-0 pt-2 z-10">
                  <span className="font-black text-blue-950 text-sm">{clase.startTime}</span>
                  <div className={`w-3.5 h-3.5 rounded-full border-[3px] ring-4 ring-transparent ${
                    clase.status === 'COMPLETED' ? 'bg-green-500 border-green-200 ring-green-500/20' :
                    clase.status === 'IN_PROGRESS' ? 'bg-blue-600 border-blue-200 animate-pulse ring-blue-500/30' :
                    'bg-blue-900/20 border-blue-900/10'
                  }`}></div>
                  <span className="text-[10px] font-bold text-blue-900/40 mt-1">{clase.endTime}</span>
                </div>

                <div className={`flex-1 rounded-2xl p-4 sm:p-5 transition-all duration-300 border-2 hover:-translate-y-1 hover:shadow-md ${
                  clase.status === 'IN_PROGRESS' 
                    ? 'border-blue-400 bg-blue-500/10' 
                    : 'border-blue-900/20 bg-transparent hover:border-blue-900/40'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <div>
                      <h4 className="text-base font-black text-blue-950 leading-none">{clase.subject}</h4>
                      
                      <div className="flex items-center gap-1.5 mt-2">
                        {clase.photo ? (
                          <img src={getPhotoUrl(clase.photo)!} alt={clase.teacher} className="w-5 h-5 rounded-full border border-blue-900/20 object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-blue-900/40" />
                        )}
                        <p className="text-blue-900/70 font-bold text-xs">Prof. {clase.teacher}</p>
                      </div>
                    </div>
                    
                    {clase.status === 'COMPLETED' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-md uppercase">
                        <CheckCircle2 className="w-3 h-3" /> Finalizada
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900/50 mt-3 pt-3 border-t border-blue-900/10">
                    <MapPin className="w-3.5 h-3.5" /> {clase.classroom}
                  </div>
                </div>
              </div>
            )) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-900/30">
                <CheckCircle2 className="w-12 h-12 mb-2 opacity-50" />
                <p className="font-bold">No tienes clases este día.</p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Tareas Pendientes */}
        <div className={bentoCardClass}>
          <div className={bentoTitleClass}>
            <Target className="w-5 h-5"/> 
            <span>Por Entregar</span>
            {currentStatus.pendingTasksCount > 0 && (
              <span className="ml-auto bg-red-500/20 text-red-700 text-xs font-black px-2 py-0.5 rounded-full">
                {currentStatus.pendingTasksCount}
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-blue-900/50 mb-2">Organizadas por prioridad de entrega.</p>
          
          <div className="flex flex-col gap-3">
            {pendingTasks.length > 0 ? pendingTasks.map((task, idx) => (
              <div 
                key={task.id} 
                className={`flex flex-col gap-2 p-4 border-2 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-in slide-in-from-bottom-4 fill-mode-both ${
                  task.isUrgent 
                    ? "border-red-400/50 bg-red-500/5 hover:border-red-400" 
                    : "border-blue-900/20 bg-transparent hover:border-blue-900/40"
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                    task.isUrgent ? "bg-red-500/20 text-red-800 border-red-500/30" : "bg-blue-900/10 text-blue-900 border-blue-900/20"
                  }`}>
                    {task.subject}
                  </span>
                  {task.isUrgent && (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase text-red-600 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md">
                      <AlertCircle className="w-3 h-3" /> Urgente
                    </span>
                  )}
                </div>
                
                <h4 className="font-extrabold text-blue-950 text-sm leading-tight mt-1 hover:text-blue-700 transition-colors cursor-pointer">
                  {task.title}
                </h4>
                
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-900/10">
                  <span className="text-[10px] font-bold text-blue-900/50 uppercase">
                    {task.type}
                  </span>
                  <span className={`text-xs font-bold flex items-center gap-1 ${task.isUrgent ? "text-red-600" : "text-blue-900/60"}`}>
                    <Clock className="w-3 h-3" /> {task.dueDate}
                  </span>
                </div>
              </div>
            )) : (
              <div className="py-10 flex flex-col items-center text-center text-blue-900/40 animate-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 mb-2 opacity-30" />
                <p className="font-black text-base">¡Todo al día!</p>
                <p className="text-xs font-medium">Has completado todas tus asignaciones.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;