import { Calendar, Clock, Users, BookOpen, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

// --- DATOS SIMULADOS (Basados en la sesión del profesor actual) ---
const teacherName = "Luis Fernando Ramírez";

const kpis = {
  totalEstudiantes: 145, // Suma de enrollments en sus materias
  cursosAsignados: 5,    // Conteo de classroom_subjects
  clasesHoy: 4           // Bloques en schedules para el día actual
};

// Clases de hoy obtenidas cruzando schedules + classroom_subjects + classrooms + subjects
const todaysSchedule = [
  { id: 1, startTime: "07:00", endTime: "09:00", subject: "Cálculo (MAT-101)", course: "1101", classroom: "Aula 301 - Bloque A", status: "COMPLETED" },
  { id: 2, startTime: "09:30", endTime: "11:30", subject: "Cálculo (MAT-101)", course: "1102", classroom: "Aula 302 - Bloque A", status: "IN_PROGRESS" },
  { id: 3, startTime: "12:00", endTime: "14:00", subject: "Física I (FIS-201)", course: "1001", classroom: "Lab. Física - Piso 1", status: "PENDING" },
  { id: 4, startTime: "14:30", endTime: "16:30", subject: "Estadística (EST-101)", course: "1002", classroom: "Aula 205 - Bloque B", status: "PENDING" },
];

const assignedCourses = [
  { id: 1, course: "1101", subject: "Cálculo", students: 35 },
  { id: 2, course: "1102", subject: "Cálculo", students: 32 },
  { id: 3, course: "1001", subject: "Física I", students: 40 },
  { id: 4, course: "1002", subject: "Estadística", students: 38 },
];

const TeacherDashboard = () => {
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
        <h2 className="text-4xl font-black text-blue-950 mb-1">¡Hola, {teacherName}!</h2>
        <p className="text-blue-900/80 font-bold capitalize flex items-center gap-2">
          <Calendar className="w-4 h-4" /> {today}
        </p>
      </div>

      {/* --- SECCIÓN 1: KPIs --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-5 flex flex-col gap-1 hover:bg-blue-900/5 transition-colors">
          <div className="flex justify-between items-center text-blue-900/80 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest">Estudiantes a cargo</span>
            <Users className="w-5 h-5 text-blue-900" />
          </div>
          <div className="text-4xl font-black text-blue-950">{kpis.totalEstudiantes}</div>
        </div>

        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-5 flex flex-col gap-1 hover:bg-blue-900/5 transition-colors">
          <div className="flex justify-between items-center text-blue-900/80 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest">Grupos / Cursos</span>
            <BookOpen className="w-5 h-5 text-blue-900" />
          </div>
          <div className="text-4xl font-black text-blue-950">{kpis.cursosAsignados}</div>
        </div>

        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-5 flex flex-col gap-1 hover:bg-blue-900/5 transition-colors">
          <div className="flex justify-between items-center text-blue-900/80 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest">Clases Hoy</span>
            <Clock className="w-5 h-5 text-blue-900" />
          </div>
          <div className="text-4xl font-black text-blue-950">{kpis.clasesHoy}</div>
        </div>
      </div>

      {/* --- SECCIÓN 2: HORARIO Y CURSOS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        
        {/* COLUMNA IZQUIERDA: Horario de Hoy */}
        <div className={`lg:col-span-2 ${bentoCardClass}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={bentoTitleClass}><Clock className="w-5 h-5"/> Tu Horario de Hoy</h3>
          </div>

          <div className="flex flex-col gap-0 relative">
            {/* Línea conectora del timeline */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-blue-900/20 hidden sm:block"></div>

            {todaysSchedule.length > 0 ? todaysSchedule.map((clase, index) => (
              <div key={clase.id} className="relative flex gap-4 sm:gap-6 items-stretch p-2 group">
                
                {/* Indicador de hora y estado (Timeline) */}
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
                      <p className="text-blue-900/80 font-bold mt-1 text-sm">Curso: {clase.course}</p>
                    </div>
                    
                    {clase.status === 'COMPLETED' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" /> Finalizada
                      </span>
                    )}
                    {clase.status === 'IN_PROGRESS' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 bg-blue-100 px-2 py-1 rounded-lg">
                        En curso ahora
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-900/70 bg-white px-3 py-2 rounded-xl border border-blue-900/10 w-fit mt-3">
                    <MapPin className="w-4 h-4" /> {clase.classroom}
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-blue-900/50 font-bold">
                No tienes clases programadas para el día de hoy. ¡Disfruta tu día libre!
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Resumen de Cursos */}
        <div className={bentoCardClass}>
          <h3 className={bentoTitleClass}><BookOpen className="w-5 h-5"/> Mis Grupos</h3>
          <p className="text-xs font-medium text-blue-900/70 mb-2">Vista rápida de tus asignaciones para el periodo actual.</p>
          
          <div className="flex flex-col gap-3">
            {assignedCourses.map(course => (
              <div key={course.id} className="flex justify-between items-center p-3 border-b-2 border-blue-900/10 border-dashed hover:bg-blue-900/5 rounded-lg transition-colors group cursor-pointer">
                <div>
                  <h4 className="font-black text-blue-950">Curso {course.course}</h4>
                  <p className="text-xs text-blue-900/70 font-bold">{course.subject}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block text-sm font-black text-blue-950">{course.students}</span>
                    <span className="block text-[10px] uppercase font-bold text-blue-900/50">Alumnos</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-900/30 group-hover:text-blue-900 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;