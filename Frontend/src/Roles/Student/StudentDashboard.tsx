import { Calendar, Clock, BookOpen, MapPin, FileText, AlertCircle, CheckCircle2, ChevronRight, Target } from "lucide-react";

// --- DATOS SIMULADOS (Basados en la sesión del estudiante actual) ---
const studentName = "Camilo Andrés";
const courseName = "1101";

const kpis = {
  clasesHoy: 4,
  tareasPendientes: 3,
  proximaClase: "Física I"
};

// Clases de hoy obtenidas cruzando enrollments + classroom_subjects + schedules
const todaysSchedule = [
  { id: 1, startTime: "07:00", endTime: "09:00", subject: "Cálculo", teacher: "Luis Fernando Ramírez", classroom: "Aula 301 - Bloque A", status: "COMPLETED" },
  { id: 2, startTime: "09:30", endTime: "11:30", subject: "Química", teacher: "Martha Silva", classroom: "Lab. Química - Piso 2", status: "IN_PROGRESS" },
  { id: 3, startTime: "12:00", endTime: "14:00", subject: "Física I", teacher: "Carlos Pérez", classroom: "Lab. Física - Piso 1", status: "PENDING" },
  { id: 4, startTime: "14:30", endTime: "16:30", subject: "Inglés", teacher: "Ana Gómez", classroom: "Aula 205 - Bloque B", status: "PENDING" },
];

// Tareas pendientes ordenadas por urgencia
const pendingTasks = [
  { id: "T1", subject: "Cálculo", title: "Taller Evaluativo de Funciones", dueDate: "Hoy, 23:59", isUrgent: true },
  { id: "T2", subject: "Química", title: "Informe de Laboratorio", dueDate: "Mañana, 18:00", isUrgent: true },
  { id: "T3", subject: "Inglés", title: "Reading Comprehension Unit 4", dueDate: "Viernes, 23:59", isUrgent: false },
];

const StudentDashboard = () => {
  // --- CLASES ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  
  // Fecha actual formateada
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('es-ES', options);

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2 border-b-4 border-blue-900/20 pb-4">
        <h2 className="text-4xl font-black text-blue-950 mb-1">¡Hola, {studentName}!</h2>
        <p className="text-blue-900/80 font-bold capitalize flex items-center gap-2">
          <Calendar className="w-4 h-4" /> {today} | Curso {courseName}
        </p>
      </div>

      {/* --- SECCIÓN 1: KPIs --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-5 flex flex-col gap-1 hover:bg-blue-900/5 transition-colors">
          <div className="flex justify-between items-center text-blue-900/80 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest">Clases de Hoy</span>
            <BookOpen className="w-5 h-5 text-blue-900" />
          </div>
          <div className="text-4xl font-black text-blue-950">{kpis.clasesHoy}</div>
        </div>

        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-5 flex flex-col gap-1 hover:bg-blue-900/5 transition-colors relative overflow-hidden">
          {kpis.tareasPendientes > 0 && (
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full flex items-start justify-end p-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-blue-900/80 mb-2 z-10">
            <span className="text-xs font-bold uppercase tracking-widest">Tareas Pendientes</span>
            <FileText className="w-5 h-5 text-blue-900" />
          </div>
          <div className="text-4xl font-black text-blue-950 z-10">{kpis.tareasPendientes}</div>
        </div>

        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-5 flex flex-col gap-1 hover:bg-blue-900/5 transition-colors">
          <div className="flex justify-between items-center text-blue-900/80 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest">Próxima Clase</span>
            <Clock className="w-5 h-5 text-blue-900" />
          </div>
          <div className="text-2xl font-black text-blue-950 mt-1 truncate">{kpis.proximaClase}</div>
        </div>
      </div>

      {/* --- SECCIÓN 2: HORARIO Y TAREAS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        
        {/* COLUMNA IZQUIERDA: Horario de Hoy (Timeline) */}
        <div className={`lg:col-span-2 ${bentoCardClass}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={bentoTitleClass}><Clock className="w-5 h-5"/> Tu Horario de Hoy</h3>
          </div>

          <div className="flex flex-col gap-0 relative">
            {/* Línea conectora del timeline */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-blue-900/20 hidden sm:block"></div>

            {todaysSchedule.length > 0 ? todaysSchedule.map((clase) => (
              <div key={clase.id} className="relative flex gap-4 sm:gap-6 items-stretch p-2 group">
                
                {/* Indicador de hora y estado */}
                <div className="flex flex-col items-center gap-1 w-16 sm:w-20 shrink-0 pt-2 z-10">
                  <span className="font-black text-blue-950 text-sm sm:text-base">{clase.startTime}</span>
                  <div className={`w-4 h-4 rounded-full border-4 ring-4 ring-white ${
                    clase.status === 'COMPLETED' ? 'bg-green-500 border-green-200' :
                    clase.status === 'IN_PROGRESS' ? 'bg-blue-600 border-blue-200 animate-pulse' :
                    'bg-gray-300 border-gray-100'
                  }`}></div>
                  <span className="text-xs font-bold text-blue-900/50 mt-1">{clase.endTime}</span>
                </div>

                {/* Tarjeta de la clase */}
                <div className={`flex-1 border-2 rounded-2xl p-4 sm:p-5 transition-all ${
                  clase.status === 'IN_PROGRESS' 
                    ? 'border-blue-900 bg-blue-900/5 shadow-[4px_4px_0_rgba(30,58,138,0.3)]' 
                    : 'border-blue-900/20 hover:border-blue-900/50 bg-white/50'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <div>
                      <h4 className="text-lg font-black text-blue-950 leading-none">{clase.subject}</h4>
                      <p className="text-blue-900/80 font-bold mt-1 text-xs uppercase tracking-wider">Prof. {clase.teacher}</p>
                    </div>
                    
                    {clase.status === 'COMPLETED' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" /> Finalizada
                      </span>
                    )}
                    {clase.status === 'IN_PROGRESS' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 bg-blue-100 px-2 py-1 rounded-lg">
                        En curso
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-900/70 bg-white px-3 py-2 rounded-xl border border-blue-900/10 w-fit mt-3">
                    <MapPin className="w-4 h-4 text-blue-900/50" /> {clase.classroom}
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-blue-900/50 font-bold">
                No tienes clases programadas para hoy. ¡Aprovecha para descansar o repasar!
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Tareas Pendientes */}
        <div className={bentoCardClass}>
          <div className="flex justify-between items-center border-b-2 border-blue-900/80 pb-1 mb-2">
            <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2">
              <Target className="w-5 h-5"/> Por Entregar
            </h3>
          </div>
          <p className="text-xs font-medium text-blue-900/70 mb-2">Trabajos próximos a vencer.</p>
          
          <div className="flex flex-col gap-3">
            {pendingTasks.length > 0 ? pendingTasks.map(task => (
              <div 
                key={task.id} 
                className={`flex flex-col gap-2 p-3 border-2 rounded-xl transition-all cursor-pointer group ${
                  task.isUrgent 
                    ? "border-red-900/30 bg-red-50/50 hover:border-red-900/60" 
                    : "border-blue-900/10 hover:bg-blue-900/5 hover:border-blue-900/30"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                    task.isUrgent ? "bg-red-200 text-red-900" : "bg-blue-900/10 text-blue-900"
                  }`}>
                    {task.subject}
                  </span>
                  {task.isUrgent && <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" title="¡Vence pronto!" />}
                </div>
                
                <h4 className="font-bold text-blue-950 text-sm leading-tight group-hover:text-blue-700 transition-colors">
                  {task.title}
                </h4>
                
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs font-bold flex items-center gap-1 ${task.isUrgent ? "text-red-700" : "text-blue-900/60"}`}>
                    <Clock className="w-3 h-3" /> {task.dueDate}
                  </span>
                  <ChevronRight className="w-4 h-4 text-blue-900/30 group-hover:text-blue-900 transition-colors" />
                </div>
              </div>
            )) : (
              <div className="py-8 flex flex-col items-center text-center text-blue-900/40">
                <CheckCircle2 className="w-10 h-10 mb-2 opacity-50" />
                <p className="font-bold text-sm">¡Todo al día!</p>
                <p className="text-xs">No tienes tareas pendientes.</p>
              </div>
            )}
          </div>
          
          <button className="w-full mt-2 py-2 border-2 border-blue-900 text-blue-900 font-bold rounded-xl hover:bg-blue-900 hover:text-white transition-colors text-sm uppercase tracking-wider">
            Ver Todas las Tareas
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;