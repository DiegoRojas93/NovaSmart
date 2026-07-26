import { useState } from "react";
import { UserCheck, UserX, Clock, Calendar, AlertTriangle, CheckCircle2, Info } from "lucide-react";

// --- INTERFACES ---
interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  teacher: string;
  status: "AUSENTE" | "LLEGO_TARDE" | "JUSTIFICADO";
  observations: string;
}

// --- DATOS SIMULADOS ---
// Nota: Aquí NO mostramos los "Presentes" para no saturar la tabla, solo mostramos las novedades (fallas/retardos).
const mockAbsences: AttendanceRecord[] = [
  { id: "A1", date: "15 de Julio, 2026", subject: "Física I", teacher: "Carlos Pérez", status: "AUSENTE", observations: "No asistió a clase." },
  { id: "A2", date: "10 de Julio, 2026", subject: "Inglés", teacher: "Ana Gómez", status: "LLEGO_TARDE", observations: "Llegó 20 minutos tarde por problemas con la ruta." },
  { id: "A3", date: "02 de Julio, 2026", subject: "Cálculo", teacher: "Luis Fernando", status: "JUSTIFICADO", observations: "Cita médica (Incapacidad adjunta en coordinación)." },
];

const mockKpis = {
  totalClasses: 85,
  present: 82,
  absences: 1,
  lates: 1,
  excused: 1,
  attendancePercentage: 96.4
};

const StudentAttendance = () => {
  const [filter, setFilter] = useState<"TODOS" | "AUSENTE" | "LLEGO_TARDE" | "JUSTIFICADO">("TODOS");

  const filteredRecords = mockAbsences.filter(record => {
    if (filter === "TODOS") return true;
    return record.status === filter;
  });

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const filterBtnClass = "px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all border-2";

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "AUSENTE": return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-[10px] font-black uppercase flex items-center gap-1 w-fit"><UserX className="w-3 h-3"/> Ausencia Injustificada</span>;
      case "LLEGO_TARDE": return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-[10px] font-black uppercase flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> Llegada Tarde</span>;
      case "JUSTIFICADO": return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-[10px] font-black uppercase flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> Falla Justificada</span>;
      default: return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Mi Asistencia</h2>
        <p className="text-blue-900/70 font-medium">
          Reporte de tus inasistencias y retardos registrados por tus docentes en el periodo actual.
        </p>
      </div>

      {/* --- SECCIÓN 1: KPIs GLOBALES --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-2 md:col-span-4 border-2 border-blue-900/20 bg-blue-900/5 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-blue-900/60 uppercase tracking-widest mb-1">Porcentaje de Asistencia</h3>
            <div className="flex items-end gap-2">
              <span className={`text-4xl font-black ${mockKpis.attendancePercentage >= 80 ? "text-green-600" : "text-red-600"}`}>
                {mockKpis.attendancePercentage}%
              </span>
            </div>
            {mockKpis.attendancePercentage < 80 && (
              <p className="text-xs font-bold text-red-600 flex items-center gap-1 mt-2">
                <AlertTriangle className="w-4 h-4" /> ¡Atención! Estás en riesgo de reprobar por fallas.
              </p>
            )}
          </div>
          
          {/* Barra de progreso visual */}
          <div className="w-full md:w-1/2 bg-white border-2 border-blue-900/10 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full ${mockKpis.attendancePercentage >= 80 ? "bg-green-500" : "bg-red-500"}`} 
              style={{ width: `${mockKpis.attendancePercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="border-2 border-red-900/20 bg-red-50/50 rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex justify-between items-center text-red-900/60 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest">Ausencias</span>
            <UserX className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-red-700">{mockKpis.absences}</div>
        </div>

        <div className="border-2 border-yellow-900/20 bg-yellow-50/50 rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex justify-between items-center text-yellow-900/80 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest">Retardos</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-yellow-700">{mockKpis.lates}</div>
        </div>

        <div className="border-2 border-blue-900/20 bg-blue-50/50 rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex justify-between items-center text-blue-900/60 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest">Justificadas</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-blue-700">{mockKpis.excused}</div>
        </div>
        
        <div className="border-2 border-green-900/20 bg-green-50/50 rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex justify-between items-center text-green-900/60 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest">Clases Totales</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-green-700">{mockKpis.totalClasses}</div>
        </div>
      </div>

      {/* --- SECCIÓN 2: REGISTRO DE NOVEDADES --- */}
      <div className={bentoCardClass}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-blue-900/80 pb-3 mb-4 gap-4">
          <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2">
            <Calendar className="w-5 h-5"/> Detalle de Novedades
          </h3>
          
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilter("TODOS")} className={`${filterBtnClass} ${filter === "TODOS" ? "bg-blue-900 text-white border-blue-900" : "border-blue-900/20 text-blue-900/60"}`}>Todos</button>
            <button onClick={() => setFilter("AUSENTE")} className={`${filterBtnClass} ${filter === "AUSENTE" ? "bg-red-600 text-white border-red-600" : "border-red-600/20 text-red-700/60"}`}>Ausencias</button>
            <button onClick={() => setFilter("LLEGO_TARDE")} className={`${filterBtnClass} ${filter === "LLEGO_TARDE" ? "bg-yellow-500 text-white border-yellow-500" : "border-yellow-500/30 text-yellow-700/60"}`}>Retardos</button>
          </div>
        </div>

        {/* Mensaje informativo */}
        <div className="flex gap-2 items-start bg-blue-900/5 p-3 rounded-xl border border-blue-900/10 mb-2">
          <Info className="w-4 h-4 text-blue-900/50 shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-blue-900/70">
            Aquí solo se muestran los días en los que se registró una novedad. Los días que asististe puntualmente no aparecen en esta lista.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {filteredRecords.length > 0 ? filteredRecords.map((record) => (
            <div key={record.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-2 border-blue-900/10 rounded-2xl bg-white/40 hover:bg-white/80 transition-colors gap-4">
              
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-blue-950">{record.subject}</span>
                  <span className="text-xs font-bold text-blue-900/50 bg-blue-900/5 px-2 py-0.5 rounded-md">Prof. {record.teacher}</span>
                </div>
                <div className="text-xs font-bold text-blue-900/60 uppercase tracking-widest">
                  {record.date}
                </div>
                
                {record.observations && (
                  <p className="text-sm font-medium text-blue-950/80 italic border-l-2 border-blue-900/20 pl-2 mt-1">
                    "{record.observations}"
                  </p>
                )}
              </div>

              <div className="shrink-0 flex sm:flex-col items-center justify-end sm:items-end gap-2">
                {getStatusBadge(record.status)}
              </div>

            </div>
          )) : (
            <div className="py-12 flex flex-col items-center text-center text-blue-900/40">
              <CheckCircle2 className="w-12 h-12 mb-2 opacity-50" />
              <p className="font-bold text-lg">Sin novedades</p>
              <p className="text-sm">No tienes registros que coincidan con este filtro.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default StudentAttendance;