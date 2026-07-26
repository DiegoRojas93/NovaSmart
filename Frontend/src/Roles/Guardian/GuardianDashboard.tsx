import { Calendar, UserCircle, BookOpen, AlertCircle, CheckCircle2, Clock, ChevronRight, TrendingUp, AlertTriangle } from "lucide-react";

// --- DATOS SIMULADOS ---
const guardianName = "Carlos Eduardo Gómez";

// Simulamos que este acudiente tiene dos hijos matriculados en el colegio
const mockStudents = [
  {
    id: "ST1",
    name: "Camilo Andrés Gómez Silva",
    course: "1101",
    kpis: {
      average: 4.2,
      pendingTasks: 2,
      absencesThisPeriod: 0
    },
    alerts: [
      { id: 1, type: "TASK", message: "2 tareas vencen esta semana.", urgent: true }
    ]
  },
  {
    id: "ST2",
    name: "Ana Sofía Gómez Silva",
    course: "802",
    kpis: {
      average: 3.4,
      pendingTasks: 0,
      absencesThisPeriod: 2
    },
    alerts: [
      { id: 2, type: "ATTENDANCE", message: "Registra 2 fallas en el periodo actual.", urgent: true },
      { id: 3, type: "ACADEMIC", message: "Rendimiento estable, pero bajo en Matemáticas.", urgent: false }
    ]
  }
];

const GuardianDashboard = () => {
  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  
  // Fecha actual formateada
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('es-ES', options);

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2 border-b-4 border-blue-900/20 pb-4">
        <h2 className="text-4xl font-black text-blue-950 mb-1">¡Hola, {guardianName}!</h2>
        <p className="text-blue-900/80 font-bold capitalize flex items-center gap-2">
          <Calendar className="w-4 h-4" /> {today}
        </p>
      </div>

      <div className="mb-2">
        <h3 className="text-2xl font-black text-blue-950 mb-2">Resumen de Estudiantes</h3>
        <p className="text-blue-900/70 font-medium">
          Vista general del rendimiento y estado actual de sus acudidos.
        </p>
      </div>

      {/* --- TARJETAS DE ESTUDIANTES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockStudents.map((student) => (
          <div key={student.id} className={bentoCardClass}>
            
            {/* Encabezado del Estudiante */}
            <div className="flex items-start gap-4 border-b-2 border-blue-900/10 pb-4">
              <div className="w-14 h-14 bg-blue-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                <UserCircle className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-black text-blue-950 leading-tight">{student.name}</h4>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900/60 uppercase tracking-widest mt-1 bg-blue-900/5 px-2 py-1 rounded-md">
                  <BookOpen className="w-3 h-3" /> Curso {student.course}
                </span>
              </div>
            </div>

            {/* KPIs Rápidos */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/50 border border-blue-900/10 rounded-xl p-3 text-center transition-transform hover:-translate-y-1 hover:shadow-sm">
                <span className="block text-[10px] font-black uppercase tracking-widest text-blue-900/50 mb-1">Promedio</span>
                <span className={`text-2xl font-black ${student.kpis.average >= 4.0 ? "text-green-600" : student.kpis.average >= 3.0 ? "text-blue-600" : "text-red-600"}`}>
                  {student.kpis.average}
                </span>
              </div>
              <div className="bg-white/50 border border-blue-900/10 rounded-xl p-3 text-center transition-transform hover:-translate-y-1 hover:shadow-sm">
                <span className="block text-[10px] font-black uppercase tracking-widest text-blue-900/50 mb-1">Tareas</span>
                <span className={`text-2xl font-black ${student.kpis.pendingTasks > 0 ? "text-yellow-600" : "text-green-600"}`}>
                  {student.kpis.pendingTasks}
                </span>
              </div>
              <div className="bg-white/50 border border-blue-900/10 rounded-xl p-3 text-center transition-transform hover:-translate-y-1 hover:shadow-sm">
                <span className="block text-[10px] font-black uppercase tracking-widest text-blue-900/50 mb-1">Fallas</span>
                <span className={`text-2xl font-black ${student.kpis.absencesThisPeriod > 0 ? "text-red-600" : "text-green-600"}`}>
                  {student.kpis.absencesThisPeriod}
                </span>
              </div>
            </div>

            {/* Alertas y Novedades */}
            <div className="flex flex-col gap-2 mt-2">
              <h5 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Novedades Recientes
              </h5>
              
              {student.alerts.length > 0 ? student.alerts.map((alert) => (
                <div key={alert.id} className={`flex items-start gap-3 p-3 border-2 rounded-xl text-sm font-medium ${
                  alert.urgent 
                    ? "border-red-900/20 bg-red-50/50 text-red-900" 
                    : "border-yellow-900/20 bg-yellow-50/50 text-yellow-900"
                }`}>
                  {alert.urgent ? <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" /> : <Clock className="w-5 h-5 shrink-0 text-yellow-600" />}
                  <p>{alert.message}</p>
                </div>
              )) : (
                <div className="flex items-center gap-2 p-3 border-2 border-green-900/20 bg-green-50/50 rounded-xl text-sm font-medium text-green-800">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <p>Todo al día. No hay alertas importantes.</p>
                </div>
              )}
            </div>

            {/* Botón de Acción rápida */}
            <button className="mt-2 w-full py-3 bg-blue-900/10 text-blue-900 font-black text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-blue-900 hover:text-white">
              Ver Detalle Completo <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        ))}
      </div>

    </div>
  );
};

export default GuardianDashboard;