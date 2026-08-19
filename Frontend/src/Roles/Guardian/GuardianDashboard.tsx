import { useState, useEffect, useCallback } from "react";
import { Calendar, UserCircle, BookOpen, AlertCircle, CheckCircle2, Clock, AlertTriangle, FileText, UserCheck, Users, Loader2 } from "lucide-react";

interface Props {
  guardianId: number; // ID del acudiente autenticado
}

interface StudentAlert {
  id: number;
  type: string;
  message: string;
  urgent: boolean;
}

interface StudentKpis {
  average: number;
  pendingTasks: number;
  absencesThisPeriod: number;
}

interface Student {
  id: string;
  name: string;
  course: string;
  document: string;
  status: string;
  photo: string | null;
  kpis: StudentKpis;
  alerts: StudentAlert[];
}

interface DashboardData {
  guardianName: string;
  students: Student[];
}

const GuardianDashboard = ({ guardianId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    if (!guardianId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/guardian-dashboard/${guardianId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const dashboardData = await res.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error("Error cargando el dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, [guardianId, apiUrl]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const getPhotoUrl = (photo: string | null) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    return `${apiUrl}/files/${photo}`;
  };

  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString('es-ES', options);

  if (isLoading || !data) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-blue-900/50">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h3 className="text-xl font-black">Cargando panel...</h3>
        <p className="font-medium">Obteniendo la información de tus acudidos</p>
      </div>
    );
  }

  const students = data.students || [];
  const isSingle = students.length === 1;
  const bentoCardBase = "border-2 border-blue-900/20 hover:border-blue-900/40 rounded-3xl p-6 md:p-8 bg-transparent relative transition-all duration-300 hover:shadow-md hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 fill-mode-both";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2 border-b-4 border-blue-900/20 pb-4 flex flex-col gap-2">
        <h2 className="text-4xl font-black text-blue-950 mb-1 animate-in fade-in slide-in-from-left-4 duration-700">
          ¡Hola, {data.guardianName}!
        </h2>
        <p className="text-blue-900/80 font-bold capitalize flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
          <Calendar className="w-4 h-4" /> {today}
        </p>
      </div>

      <div className="mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <h3 className="text-2xl font-black text-blue-950 mb-2">Resumen de Estudiantes</h3>
        <p className="text-blue-900/70 font-medium">
          Vista general del rendimiento y estado actual de sus acudidos.
        </p>
      </div>

      {students.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center text-blue-900/40 border-2 border-blue-900/20 border-dashed rounded-3xl bg-blue-900/5 animate-in zoom-in-95">
          <Users className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-2xl font-black mb-1">Sin estudiantes asignados</h3>
          <p className="font-medium max-w-md">No tienes estudiantes asociados a tu cuenta de acudiente en este momento.</p>
        </div>
      ) : (
        <div className={`grid ${isSingle ? "grid-cols-1 max-w-6xl" : "grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(380px,1fr))]"} gap-6`}>
          {students.map((student, idx) => (
            <div 
              key={student.id} 
              className={`${bentoCardBase} flex ${isSingle ? "flex-col md:flex-row items-center md:items-stretch gap-8" : "flex-col gap-6"}`}
              style={{ animationDelay: `${(idx + 1) * 150}ms` }}
            >
              
              {/* PERFIL */}
              <div className={`flex ${isSingle ? "flex-col w-full md:w-1/3 xl:w-1/4 items-center text-center border-b-2 md:border-b-0 md:border-r-2 border-blue-900/10 pb-6 md:pb-0 md:pr-8 justify-center" : "flex-col sm:flex-row items-start sm:items-center border-b-2 border-blue-900/10 pb-5"} gap-4`}>
                <div className={`${isSingle ? "w-32 h-32 md:w-40 md:h-40" : "w-20 h-20"} bg-blue-900/5 text-blue-900 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-blue-900/20 overflow-hidden group`}>
                  {student.photo ? (
                    <img src={getPhotoUrl(student.photo)!} alt={`Foto de ${student.name}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <UserCircle className={`${isSingle ? "w-16 h-16" : "w-10 h-10"} text-blue-900/40`} />
                  )}
                </div>
                
                <div className={`flex flex-col gap-1.5 ${isSingle ? "items-center mt-2" : "flex-1"}`}>
                  <h4 className={`${isSingle ? "text-2xl md:text-3xl" : "text-xl"} font-black text-blue-950 leading-tight`}>
                    {student.name}
                  </h4>
                  <div className={`flex flex-wrap items-center gap-2 mt-1 ${isSingle ? "justify-center" : ""}`}>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-900/60 uppercase tracking-widest bg-blue-900/5 px-2.5 py-1 rounded-lg border border-blue-900/10">
                      <BookOpen className="w-3 h-3" /> Curso {student.course}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-900/60 uppercase tracking-widest bg-blue-900/5 px-2.5 py-1 rounded-lg border border-blue-900/10">
                      <FileText className="w-3 h-3" /> {student.document}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-green-700 uppercase tracking-widest bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/20">
                      <UserCheck className="w-3 h-3" /> {student.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* KPIS Y ALERTAS */}
              <div className={`flex flex-col gap-6 ${isSingle ? "w-full md:w-2/3 xl:w-3/4 justify-center" : "flex-1"}`}>
                <div className={`grid ${isSingle ? "grid-cols-3 gap-6" : "grid-cols-3 gap-3"}`}>
                  <div className="bg-white/60 border-2 border-blue-900/5 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 hover:border-blue-900/20 hover:shadow-sm">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-blue-900/50 mb-1">Promedio</span>
                    <span className={`text-3xl font-black ${student.kpis.average >= 4.0 ? "text-green-600" : student.kpis.average >= 3.0 ? "text-blue-600" : "text-red-600"}`}>
                      {student.kpis.average.toFixed(1)}
                    </span>
                  </div>
                  <div className="bg-white/60 border-2 border-blue-900/5 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 hover:border-blue-900/20 hover:shadow-sm">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-blue-900/50 mb-1">Tareas</span>
                    <span className={`text-3xl font-black ${student.kpis.pendingTasks > 0 ? "text-amber-600" : "text-green-600"}`}>
                      {student.kpis.pendingTasks}
                    </span>
                  </div>
                  <div className="bg-white/60 border-2 border-blue-900/5 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 hover:border-blue-900/20 hover:shadow-sm">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-blue-900/50 mb-1">Fallas</span>
                    <span className={`text-3xl font-black ${student.kpis.absencesThisPeriod > 0 ? "text-red-600" : "text-green-600"}`}>
                      {student.kpis.absencesThisPeriod}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  <h5 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Novedades Recientes
                  </h5>
                  
                  {student.alerts.length > 0 ? student.alerts.map((alert) => (
                    <div key={alert.id} className={`flex items-center gap-3 p-4 border-2 rounded-xl text-sm font-medium transition-colors ${
                      alert.urgent 
                        ? "border-red-500/20 bg-red-500/5 text-red-900 hover:bg-red-500/10" 
                        : "border-amber-500/20 bg-amber-500/5 text-amber-900 hover:bg-amber-500/10"
                    }`}>
                      {alert.urgent ? <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" /> : <Clock className="w-5 h-5 shrink-0 text-amber-600" />}
                      <p className="leading-tight mt-0.5">{alert.message}</p>
                    </div>
                  )) : (
                    <div className="flex items-center gap-3 p-4 border-2 border-green-500/20 bg-green-500/5 hover:bg-green-500/10 rounded-xl text-sm font-medium text-green-800 transition-colors h-full">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      <p className="leading-tight mt-0.5">Todo al día. No hay alertas importantes en este momento.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default GuardianDashboard;