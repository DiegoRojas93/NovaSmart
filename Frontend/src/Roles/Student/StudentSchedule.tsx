import { useState } from "react";
import { CalendarDays, Clock, MapPin, User, BookOpen } from "lucide-react";

// --- INTERFACES ---
interface ScheduleBlock {
  id: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  classroom: string;
  colorTheme: string; // Para darle un toque visual distintivo a cada materia
}

// --- DATOS SIMULADOS ---
// Obtenidos cruzando la matrícula del estudiante con los horarios del curso
const mockWeeklySchedule: Record<string, ScheduleBlock[]> = {
  "Lunes": [
    { id: "1", startTime: "07:00", endTime: "09:00", subject: "Cálculo", teacher: "Luis Fernando Ramírez", classroom: "Aula 301 - Bloque A", colorTheme: "blue" },
    { id: "2", startTime: "09:30", endTime: "11:30", subject: "Química", teacher: "Martha Silva", classroom: "Lab. Química - Piso 2", colorTheme: "green" },
    { id: "3", startTime: "12:00", endTime: "14:00", subject: "Física I", teacher: "Carlos Pérez", classroom: "Lab. Física - Piso 1", colorTheme: "orange" },
  ],
  "Martes": [
    { id: "4", startTime: "07:00", endTime: "09:00", subject: "Inglés", teacher: "Ana Gómez", classroom: "Aula 205 - Bloque B", colorTheme: "red" },
    { id: "5", startTime: "09:30", endTime: "11:30", subject: "Cálculo", teacher: "Luis Fernando Ramírez", classroom: "Aula 301 - Bloque A", colorTheme: "blue" },
    { id: "6", startTime: "12:00", endTime: "14:00", subject: "Educación Física", teacher: "Jorge Ruiz", classroom: "Cancha Principal", colorTheme: "purple" },
  ],
  "Miércoles": [
    { id: "7", startTime: "07:00", endTime: "09:00", subject: "Física I", teacher: "Carlos Pérez", classroom: "Lab. Física - Piso 1", colorTheme: "orange" },
    { id: "8", startTime: "09:30", endTime: "11:30", subject: "Química", teacher: "Martha Silva", classroom: "Lab. Química - Piso 2", colorTheme: "green" },
  ],
  "Jueves": [
    { id: "9", startTime: "07:00", endTime: "09:00", subject: "Inglés", teacher: "Ana Gómez", classroom: "Aula 205 - Bloque B", colorTheme: "red" },
    { id: "10", startTime: "09:30", endTime: "11:30", subject: "Filosofía", teacher: "Carmen López", classroom: "Aula 305 - Bloque A", colorTheme: "teal" },
  ],
  "Viernes": [
    { id: "11", startTime: "07:00", endTime: "11:30", subject: "Taller Técnico", teacher: "Roberto Medina", classroom: "Taller 1 - Bloque C", colorTheme: "slate" },
    { id: "12", startTime: "12:00", endTime: "14:00", subject: "Ética", teacher: "Carmen López", classroom: "Aula 305 - Bloque A", colorTheme: "teal" },
  ]
};

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const StudentSchedule = () => {
  // Estado para la pestaña del día seleccionado. Por defecto, intenta poner el día actual si es entre Lunes y Viernes.
  const currentDayIndex = new Date().getDay(); // 0 = Dom, 1 = Lun...
  const defaultDay = (currentDayIndex >= 1 && currentDayIndex <= 5) ? daysOfWeek[currentDayIndex - 1] : "Lunes";
  
  const [activeDay, setActiveDay] = useState<string>(defaultDay);

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  
  // Mapa de colores dinámicos para las materias
  const colorMap: Record<string, { bg: string, border: string, text: string }> = {
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-900" },
    green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-900" },
    orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-900" },
    red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-900" },
    purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-900" },
    teal: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-900" },
    slate: { bg: "bg-slate-50", border: "border-slate-300", text: "text-slate-900" },
  };

  const currentClasses = mockWeeklySchedule[activeDay] || [];

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Mi Horario Semanal</h2>
        <p className="text-blue-900/70 font-medium">
          Consulta la programación de tus clases, aulas y docentes asignados para este periodo académico.
        </p>
      </div>

      <div className={bentoCardClass}>
        
        {/* --- PESTAÑAS DE DÍAS --- */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 border-b-2 border-blue-900/10 mb-6">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeDay === day 
                  ? "bg-blue-900 text-white shadow-[4px_4px_0_rgba(30,58,138,0.3)] translate-y-0" 
                  : "bg-blue-900/5 text-blue-900/60 hover:bg-blue-900/10 hover:text-blue-900"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              {day}
            </button>
          ))}
        </div>

        {/* --- LÍNEA DE TIEMPO DEL DÍA SELECCIONADO --- */}
        <div className="flex flex-col relative min-h-[300px]">
          
          {/* Línea vertical de conexión */}
          {currentClasses.length > 0 && (
            <div className="absolute left-8 sm:left-12 top-4 bottom-4 w-1 bg-blue-900/10 rounded-full hidden sm:block"></div>
          )}

          {currentClasses.length > 0 ? currentClasses.map((cls, index) => {
            const colors = colorMap[cls.colorTheme] || colorMap.blue;
            
            return (
              <div key={cls.id} className="relative flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-stretch py-4 group animate-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}>
                
                {/* Columna de la Hora */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 w-full sm:w-24 shrink-0 z-10">
                  <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <span className="font-black text-blue-950 text-lg sm:text-xl w-16 text-right">{cls.startTime}</span>
                    <div className="w-4 h-4 rounded-full border-4 border-white bg-blue-900 shadow-sm hidden sm:block"></div>
                  </div>
                  <span className="text-sm font-bold text-blue-900/50 sm:pr-8">{cls.endTime}</span>
                </div>

                {/* Tarjeta de la Clase */}
                <div className={`flex-1 w-full rounded-2xl border-2 p-5 sm:p-6 transition-all hover:-translate-y-1 hover:shadow-md ${colors.bg} ${colors.border}`}>
                  <div className="flex flex-col gap-3">
                    
                    <div className="flex justify-between items-start gap-4">
                      <h3 className={`text-2xl font-black ${colors.text} flex items-center gap-2`}>
                        <BookOpen className="w-6 h-6 opacity-70" /> {cls.subject}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-blue-950/70 bg-white/60 px-3 py-2 rounded-xl">
                        <User className="w-4 h-4 opacity-70" /> 
                        Prof. {cls.teacher}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-blue-950/70 bg-white/60 px-3 py-2 rounded-xl">
                        <MapPin className="w-4 h-4 opacity-70" /> 
                        {cls.classroom}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="flex flex-col items-center justify-center py-20 text-blue-900/40">
              <Clock className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-xl font-black">Día Libre</p>
              <p className="font-medium">No tienes clases programadas para este día.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentSchedule;