import { useState, useEffect, useCallback, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { UserCheck, UserX, Clock, FileText, Search, Calendar as CalendarIcon, PieChart as PieChartIcon, Filter, Layers, BookOpen, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- INTERFACES DEL BACKEND ---
interface Props {
  institutionId: number;
}

interface FilterOption { id: string; name: string; }
interface Kpis { 
  presentesPerc: number; ausentesPerc: number; tardePerc: number; justificadosPerc: number; 
  totalPresentes: number; totalAusentes: number; totalTarde: number; totalJustificados: number; 
}
interface Trend { fecha: string; presente: number; ausente: number; tarde: number; justificado: number; }
interface Distribution { name: string; value: number; color: string; }
interface AttendanceRecord {
  id: string;
  date: string;
  studentName: string;
  studentPhoto: string | null;
  subjectName: string;
  courseName: string;
  status: "PRESENTE" | "AUSENTE" | "LLEGO_TARDE" | "JUSTIFICADO";
  observations: string;
}

interface ReportData {
  kpis: Kpis;
  trends: Trend[];
  distribution: Distribution[];
  recentRecords: AttendanceRecord[];
  availableCourses: FilterOption[];
  availableSubjects: FilterOption[];
}

const GlobalAttendanceReport = ({ institutionId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS DE DATOS Y CARGA ---
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- ESTADOS DE FILTROS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("ALL");
  const [selectedSubject, setSelectedSubject] = useState("ALL");

  // --- FETCH AL BACKEND ---
  const fetchReportData = useCallback(async () => {
    if (!institutionId) return;
    setIsLoading(true);
    try {
      const url = new URL(`${apiUrl}/attendance-report/${institutionId}`);
      if (selectedCourse !== "ALL") url.searchParams.append("courseId", selectedCourse);
      if (selectedSubject !== "ALL") url.searchParams.append("subjectId", selectedSubject);

      const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const reportData = await res.json();
        setData(reportData);
      }
    } catch (error) {
      console.error("Error cargando el reporte de asistencia:", error);
    } finally {
      setIsLoading(false);
    }
  }, [institutionId, apiUrl, selectedCourse, selectedSubject]);

  // Se ejecuta al cargar y cada vez que cambian los filtros (Curso/Materia)
  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // --- LÓGICA DE FILTRADO LOCAL PARA LA TABLA ---
  // (La tabla filtra localmente por Búsqueda y Estado. Curso y Materia ya vienen filtrados del backend)
  const filteredRecords = useMemo(() => {
    if (!data?.recentRecords) return [];
    return data.recentRecords.filter(record => {
      const matchesSearch = record?.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "" || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data?.recentRecords, searchTerm, statusFilter]);

  // --- AYUDANTES ---
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const getPhotoUrl = (photo: string | null) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    return `${apiUrl}/files/${photo}`;
  };

  // --- CLASES ESTILOS ---
  const bentoCardClass = "border-2 border-blue-900/20 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-all duration-300 hover:shadow-md hover:border-blue-900/40 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 fill-mode-both";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const inputClass = "w-full bg-blue-900/5 border-2 border-blue-900/10 focus:border-blue-900 rounded-xl outline-none text-blue-950 py-2 px-4 font-bold transition-all shadow-sm placeholder:text-blue-900/40";
  const selectClass = "w-full bg-blue-900/5 border-2 border-blue-900/10 focus:border-blue-900 rounded-xl outline-none text-blue-950 py-2 px-4 font-bold transition-all appearance-none cursor-pointer shadow-sm";

  const renderStatusBadge = (status: AttendanceRecord['status']) => {
    if (!status) return null;
    const styles = {
      PRESENTE: "bg-green-100 text-green-800 border-green-200",
      AUSENTE: "bg-red-100 text-red-800 border-red-200",
      LLEGO_TARDE: "bg-yellow-100 text-yellow-800 border-yellow-200",
      JUSTIFICADO: "bg-blue-100 text-blue-800 border-blue-200"
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  // --- PANTALLA DE CARGA GLOBAL INICIAL ---
  if (isLoading && !data) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-blue-900/50">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h3 className="text-xl font-black">Cargando Reporte de Asistencia...</h3>
        <p className="font-medium">Sincronizando registros con la base de datos</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 overflow-hidden">
      
      {/* CABECERA */}
      <div className="mb-2 animate-in fade-in slide-in-from-left-4 duration-700">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Reporte de Asistencia Global</h2>
        <p className="text-blue-900/70 font-medium">
          Monitoreo en tiempo real del ausentismo y puntualidad en la institución.
        </p>
      </div>

      {/* BARRA DE FILTROS GLOBALES (Se comunican con el Backend) */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-blue-900/5 p-4 rounded-3xl border-2 border-blue-900/10 animate-in zoom-in-95 duration-500">
        <div className="w-full flex items-center justify-center sm:justify-start gap-2 mb-2 sm:mb-0 sm:w-auto px-2">
          <Filter className="w-5 h-5 text-blue-900/50" />
          <span className="text-sm font-black text-blue-900/60 uppercase tracking-widest">Filtros:</span>
        </div>
        
        <div className="w-full sm:flex-1">
          <label className="text-[10px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
            <Layers className="w-4 h-4"/> Curso / Grado:
          </label>
          <select className={selectClass} value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            <option value="ALL">Todos los cursos</option>
            {(data?.availableCourses || []).map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>
        
        <div className="w-full sm:flex-1">
          <label className="text-[10px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
            <BookOpen className="w-4 h-4"/> Materia:
          </label>
          <select className={selectClass} value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="ALL">Todas las materias</option>
            {(data?.availableSubjects || []).map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* PANTALLA DE CARGA CUANDO SE CAMBIAN LOS FILTROS */}
      {isLoading ? (
        <div className="w-full flex flex-col items-center justify-center py-10 text-blue-900/50 animate-in fade-in">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-bold">Calculando tendencias de asistencia...</p>
        </div>
      ) : (
        <>
          {/* --- SECCIÓN 1: KPIs DINÁMICOS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border-2 border-blue-900/20 bg-transparent rounded-3xl p-5 flex flex-col gap-1 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-900/40 animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest">Presentes Hoy</span>
                <div className="p-2 bg-green-100 rounded-xl"><UserCheck className="w-5 h-5 text-green-600" /></div>
              </div>
              <div className="text-4xl font-black text-blue-950">{data?.kpis?.presentesPerc || 0}%</div>
              <p className="text-xs text-blue-900/60 font-bold mt-1">{data?.kpis?.totalPresentes || 0} estudiantes</p>
            </div>

            <div className="border-2 border-blue-900/20 bg-transparent rounded-3xl p-5 flex flex-col gap-1 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-900/40 animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: '150ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest">Ausentes</span>
                <div className="p-2 bg-red-100 rounded-xl"><UserX className="w-5 h-5 text-red-600" /></div>
              </div>
              <div className="text-4xl font-black text-blue-950">{data?.kpis?.ausentesPerc || 0}%</div>
              <p className="text-xs text-blue-900/60 font-bold mt-1">{data?.kpis?.totalAusentes || 0} estudiantes</p>
            </div>

            <div className="border-2 border-blue-900/20 bg-transparent rounded-3xl p-5 flex flex-col gap-1 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-900/40 animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: '200ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest">Llegadas Tarde</span>
                <div className="p-2 bg-yellow-100 rounded-xl"><Clock className="w-5 h-5 text-yellow-600" /></div>
              </div>
              <div className="text-4xl font-black text-blue-950">{data?.kpis?.tardePerc || 0}%</div>
              <p className="text-xs text-blue-900/60 font-bold mt-1">{data?.kpis?.totalTarde || 0} estudiantes</p>
            </div>

            <div className="border-2 border-blue-900/20 bg-transparent rounded-3xl p-5 flex flex-col gap-1 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-900/40 animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: '250ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest">Justificados</span>
                <div className="p-2 bg-blue-100 rounded-xl"><FileText className="w-5 h-5 text-blue-600" /></div>
              </div>
              <div className="text-4xl font-black text-blue-950">{data?.kpis?.justificadosPerc || 0}%</div>
              <p className="text-xs text-blue-900/60 font-bold mt-1">{data?.kpis?.totalJustificados || 0} permisos</p>
            </div>
          </div>

          {/* --- SECCIÓN 2: GRÁFICOS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* GRÁFICA DE DONA (Distribución de Hoy) */}
            <div className={`${bentoCardClass} lg:col-span-1 flex flex-col`} style={{ animationDelay: '300ms' }}>
              <h3 className={bentoTitleClass}><PieChartIcon className="w-5 h-5"/> Resumen Hoy</h3>
              <div className="flex-1 w-full min-h-[250px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '2px solid rgba(30,58,138,0.2)', fontWeight: 'bold' }}
                      itemStyle={{ color: '#1e3a8a', fontWeight: 'bold' }}
                    />
                    <Pie 
                      data={data?.distribution || []} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={55} 
                      outerRadius={85} 
                      paddingAngle={2}
                      stroke="transparent"
                    >
                      {(data?.distribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontWeight: 'bold', fontSize: '12px', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* GRÁFICA DE BARRAS (Tendencia Semanal) */}
            <div className={`${bentoCardClass} lg:col-span-2`} style={{ animationDelay: '350ms' }}>
              <h3 className={bentoTitleClass}><CalendarIcon className="w-5 h-5"/> Tendencia Semanal</h3>
              <div className="h-[280px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.15} vertical={false} />
                    <XAxis dataKey="fecha" stroke="#1e3a8a" tick={{ fill: '#1e3a8a', fontWeight: 'bold' }} axisLine={false} tickLine={false} tickMargin={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '2px solid rgba(30,58,138,0.2)', fontWeight: 'bold' }}
                      cursor={{ fill: 'rgba(30,58,138,0.05)' }}
                    />
                    <Legend wrapperStyle={{ fontWeight: 'bold', fontSize: '12px' }} />
                    <Bar dataKey="presente" stackId="a" fill="#22c55e" name="Presente" radius={[0, 0, 4, 4]} maxBarSize={40} />
                    <Bar dataKey="justificado" stackId="a" fill="#3b82f6" name="Justificado" maxBarSize={40} />
                    <Bar dataKey="tarde" stackId="a" fill="#eab308" name="Tarde" maxBarSize={40} />
                    <Bar dataKey="ausente" stackId="a" fill="#ef4444" name="Ausente" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* --- SECCIÓN 3: TABLA DE DETALLES --- */}
          <div className={bentoCardClass} style={{ animationDelay: '400ms' }}>
            <h3 className={bentoTitleClass}><Search className="w-5 h-5"/> Registro Detallado</h3>
            
            {/* Filtros Locales de la Tabla */}
            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-blue-900/40" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre del alumno..." 
                  className={`${inputClass} pl-10`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/4">
                <select 
                  className={selectClass} 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="PRESENTE">Presente</option>
                  <option value="AUSENTE">Ausente</option>
                  <option value="LLEGO_TARDE">Llegó Tarde</option>
                  <option value="JUSTIFICADO">Justificado</option>
                </select>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto mt-2">
              {filteredRecords.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-blue-900/10">
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Fecha</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Estudiante</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Curso / Materia</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-center">Estado</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b border-blue-900/5 hover:bg-blue-900/5 transition-colors group">
                        <td className="py-3 px-2 font-bold text-blue-900/70">{record.date}</td>
                        
                        <td className="py-2 px-2 font-bold">
                          <div className="flex items-center gap-3 py-1">
                            <Avatar className="h-9 w-9 border-2 border-blue-900/10 group-hover:border-blue-900/30 transition-colors">
                              <AvatarImage src={getPhotoUrl(record.studentPhoto)!} alt={record.studentName} />
                              <AvatarFallback className="bg-blue-900/5 text-blue-900 font-bold text-xs">
                                {getInitials(record.studentName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-blue-950">{record.studentName}</span>
                          </div>
                        </td>

                        <td className="py-3 px-2">
                          <span className="block font-bold text-blue-950">{record.courseName}</span>
                          <span className="text-xs font-bold text-blue-900/60">{record.subjectName}</span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          {renderStatusBadge(record.status)}
                        </td>
                        <td className="py-3 px-2 text-sm font-medium text-blue-900/60 max-w-xs truncate" title={record.observations}>
                          {record.observations || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-blue-900/40 animate-in zoom-in-95">
                  <UserCheck className="w-10 h-10 mb-3 opacity-50" />
                  <p className="font-bold">No hay registros de asistencia que coincidan con la búsqueda.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GlobalAttendanceReport;