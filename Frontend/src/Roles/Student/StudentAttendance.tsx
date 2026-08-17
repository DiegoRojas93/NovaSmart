import { useState, useEffect, useCallback } from "react";
import { UserCheck, UserX, Clock, Calendar, AlertTriangle, CheckCircle2, Info, BookOpen, Loader2 } from "lucide-react";

// --- INTERFACES ---
interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  teacher: string;
  status: "AUSENTE" | "LLEGO_TARDE" | "JUSTIFICADO";
  observations: string;
}

interface KpiData {
  totalClasses: number;
  present: number;
  absences: number;
  lates: number;
  excused: number;
  attendancePercentage: number;
}

interface DashboardData {
  kpisData: Record<string, KpiData>;
  records: AttendanceRecord[];
}

interface Props {
  institutionId: number;
  studentId: number;
}

const StudentAttendance = ({ institutionId, studentId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS ---
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filterStatus, setFilterStatus] = useState<"TODOS" | "AUSENTE" | "LLEGO_TARDE" | "JUSTIFICADO">("TODOS");
  const [filterSubject, setFilterSubject] = useState<string>("ALL");
  const [animateBars, setAnimateBars] = useState(false);

  // --- OBTENER DATOS DEL BACKEND ---
  const fetchAttendance = useCallback(async () => {
    if (!institutionId || !studentId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/student-attendance/${institutionId}/${studentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const dashboardData = await res.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error("Error cargando la asistencia:", error);
    } finally {
      setIsLoading(false);
      // Retraso ligero para que la barra de progreso se anime desde 0 tras cargar
      setTimeout(() => setAnimateBars(true), 100);
    }
  }, [institutionId, studentId, apiUrl]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // --- DERIVADOS Y LÓGICA DE FILTRADO ---
  const records = data?.records || [];
  const kpisData = data?.kpisData || {};
  
  // Obtenemos los KPIs actuales basados en el filtro de materia
  const currentKpis = kpisData[filterSubject] || kpisData["ALL"] || { 
    totalClasses: 0, present: 0, absences: 0, lates: 0, excused: 0, attendancePercentage: 100 
  };

  const uniqueSubjects = Array.from(new Set(records.map(a => a.subject)));

  const filteredRecords = records.filter(record => {
    const matchesStatus = filterStatus === "TODOS" ? true : record.status === filterStatus;
    const matchesSubject = filterSubject === "ALL" ? true : record.subject === filterSubject;
    return matchesStatus && matchesSubject;
  });

  // --- ESTILOS COMPARTIDOS ---
  const bentoCardClass = "border-2 border-blue-900/30 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors shadow-sm";
  const filterBtnClass = "px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all border-2";

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "AUSENTE": return <span className="bg-red-500/10 border border-red-500/20 text-red-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 w-fit shadow-sm"><UserX className="w-3.5 h-3.5"/> Ausencia Injustificada</span>;
      case "LLEGO_TARDE": return <span className="bg-amber-500/10 border border-amber-500/20 text-amber-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 w-fit shadow-sm"><Clock className="w-3.5 h-3.5"/> Llegada Tarde</span>;
      case "JUSTIFICADO": return <span className="bg-blue-600/10 border border-blue-600/20 text-blue-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 w-fit shadow-sm"><CheckCircle2 className="w-3.5 h-3.5"/> Falla Justificada</span>;
      default: return null;
    }
  };

  // --- PANTALLA DE CARGA ---
  if (isLoading || !data) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-blue-900/50">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h3 className="text-xl font-black">Cargando reporte...</h3>
        <p className="font-medium">Calculando tu historial de asistencia</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA (Animada) */}
      <div className="mb-2 border-b-4 border-blue-900/20 pb-4 flex flex-col gap-2">
        <h2 className="text-4xl font-black text-blue-950 mb-1 animate-in fade-in slide-in-from-left-4 duration-700">
          Mi Asistencia
        </h2>
        <p className="text-blue-900/70 font-bold animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
          Reporte de tus inasistencias y retardos registrados por tus docentes en el periodo actual.
        </p>
      </div>

      {/* --- SECCIÓN 1: KPIs GLOBALES ANIMADOS Y DINÁMICOS --- */}
      <div key={filterSubject} className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Barra de Porcentaje Principal */}
        <div className="col-span-2 xl:col-span-4 border-2 border-blue-900/20 bg-blue-900/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm animate-in fade-in zoom-in-95 duration-500">
          <div className="w-full md:w-auto">
            <h3 className="text-sm font-black text-blue-900/60 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Porcentaje de Asistencia {filterSubject !== "ALL" && `en ${filterSubject}`}
            </h3>
            <div className="flex items-end gap-3">
              <span className={`text-6xl font-black leading-none transition-colors duration-500 ${currentKpis.attendancePercentage >= 80 ? "text-green-600" : "text-red-600"}`}>
                {currentKpis.attendancePercentage}%
              </span>
            </div>
            {currentKpis.attendancePercentage < 80 && (
              <p className="text-xs font-bold text-red-600 flex items-center gap-1 mt-3 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-4 h-4 animate-pulse" /> ¡Atención! Estás en riesgo de reprobar por fallas.
              </p>
            )}
          </div>
          
          {/* Barra de progreso visual */}
          <div className="w-full md:w-1/2 bg-blue-900/10 rounded-full h-6 overflow-hidden border border-blue-900/20 relative">
            <div 
              className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${currentKpis.attendancePercentage >= 80 ? "bg-green-500" : "bg-red-500"}`} 
              style={{ width: animateBars ? `${currentKpis.attendancePercentage}%` : "0%" }}
            ></div>
          </div>
        </div>

        {/* Tarjetas Secundarias */}
        {[
          { title: "Ausencias", value: currentKpis.absences, icon: UserX, color: "text-red-700 bg-red-500/10 border-red-500/30" },
          { title: "Retardos", value: currentKpis.lates, icon: Clock, color: "text-amber-700 bg-amber-500/10 border-amber-500/30" },
          { title: "Justificadas", value: currentKpis.excused, icon: CheckCircle2, color: "text-blue-700 bg-blue-600/10 border-blue-600/30" },
          { title: "Clases Totales", value: currentKpis.totalClasses, icon: UserCheck, color: "text-green-700 bg-green-500/10 border-green-500/30" }
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            className={`border-2 rounded-2xl p-5 flex flex-col gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-in slide-in-from-bottom-4 fill-mode-both ${kpi.color}`}
            style={{ animationDelay: `${(idx + 1) * 100}ms` }}
          >
            <div className="flex justify-between items-center opacity-80 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest">{kpi.title}</span>
              <kpi.icon className="w-5 h-5" />
            </div>
            <div className="text-4xl font-black">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* --- SECCIÓN 2: REGISTRO DE NOVEDADES (FILTROS Y LISTA) --- */}
      <div className={bentoCardClass}>
        
        {/* CABECERA Y FILTROS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-blue-900/10 pb-5 mb-2 gap-4">
          <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2">
            <Calendar className="w-5 h-5"/> Detalle de Novedades
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Filtro de Materia (Desplegable) */}
            <div className="relative w-full sm:w-56 shrink-0">
              <BookOpen className="absolute left-3 top-2.5 w-4 h-4 text-blue-900/40" />
              <select 
                className="w-full bg-transparent border-2 border-blue-900/20 focus:border-blue-900 outline-none text-blue-950 py-2 pl-9 pr-3 rounded-xl text-sm font-bold transition-all appearance-none cursor-pointer"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="ALL" className="bg-white">Todas las materias</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject} className="bg-white">{subject}</option>
                ))}
              </select>
            </div>

            {/* Filtros de Estado */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilterStatus("TODOS")} className={`${filterBtnClass} ${filterStatus === "TODOS" ? "bg-blue-900 text-white border-blue-900 shadow-sm" : "bg-transparent border-blue-900/20 text-blue-900/60 hover:border-blue-900/50"}`}>Todos</button>
              <button onClick={() => setFilterStatus("AUSENTE")} className={`${filterBtnClass} ${filterStatus === "AUSENTE" ? "bg-red-600 text-white border-red-600 shadow-sm" : "bg-transparent border-red-600/30 text-red-700 hover:border-red-600/60"}`}>Ausencias</button>
              <button onClick={() => setFilterStatus("LLEGO_TARDE")} className={`${filterBtnClass} ${filterStatus === "LLEGO_TARDE" ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-transparent border-amber-500/30 text-amber-700 hover:border-amber-500/60"}`}>Retardos</button>
            </div>
          </div>
        </div>

        {/* Mensaje informativo */}
        <div className="flex gap-3 items-start bg-blue-900/5 p-4 rounded-2xl border border-blue-900/10 mb-2">
          <Info className="w-5 h-5 text-blue-900/50 shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-blue-900/70 leading-relaxed">
            Aquí solo se muestran los días en los que se registró una novedad. Los días que asististe puntualmente a clase de manera regular <span className="underline decoration-blue-900/30">no</span> aparecen en esta lista para mantener el reporte limpio.
          </p>
        </div>

        {/* LISTA DE REGISTROS ANIMADA */}
        <div className="flex flex-col gap-4">
          {filteredRecords.length > 0 ? filteredRecords.map((record, idx) => (
            <div 
              key={record.id} 
              className="flex flex-col md:flex-row md:items-center justify-between p-5 border-2 border-blue-900/10 rounded-2xl bg-transparent hover:bg-blue-900/5 hover:border-blue-900/30 transition-all duration-300 gap-4 animate-in slide-in-from-bottom-4 fill-mode-both"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              
              <div className="flex-1 flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-lg font-black text-blue-950">{record.subject}</span>
                  <span className="text-xs font-bold text-blue-900/60 bg-blue-900/10 border border-blue-900/20 px-2.5 py-1 rounded-lg">Prof. {record.teacher}</span>
                  <span className="text-xs font-bold text-blue-900/60 uppercase tracking-widest flex items-center gap-1.5 ml-auto md:ml-0">
                    <Calendar className="w-3.5 h-3.5" /> {record.date}
                  </span>
                </div>
                
                {record.observations && (
                  <p className="text-sm font-medium text-blue-950/80 italic border-l-2 border-blue-900/30 pl-3 py-1 bg-white/50 rounded-r-lg">
                    "{record.observations}"
                  </p>
                )}
              </div>

              <div className="shrink-0 flex md:flex-col items-center justify-end md:items-end gap-2 border-t-2 border-blue-900/10 pt-3 md:border-0 md:pt-0">
                {getStatusBadge(record.status)}
              </div>

            </div>
          )) : (
            <div className="py-16 flex flex-col items-center text-center text-blue-900/40 border-2 border-blue-900/20 border-dashed rounded-3xl bg-blue-900/5 animate-in zoom-in-95">
              <CheckCircle2 className="w-16 h-16 mb-3 opacity-50" />
              <p className="font-black text-xl">Sin novedades</p>
              <p className="text-sm font-medium mt-1">No tienes inasistencias que coincidan con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default StudentAttendance;