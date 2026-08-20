import { useState, useEffect, useCallback, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, Legend } from "recharts";
import { GraduationCap, TrendingUp, TrendingDown, Award, Search, BookOpen, Filter, Layers, PieChart as PieChartIcon, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- INTERFACES DEL BACKEND ---
interface Props {
  institutionId: number;
}

interface FilterOption { id: string; name: string; }
interface Kpis { avg: string; aprPerc: number; repPerc: number; excPerc: number; }
interface SubjectAverage { materia: string; promedio: number; }
interface Distribution { name: string; value: number; color: string; }
interface GradeRecord {
  id: string;
  studentName: string;
  studentPhoto: string | null;
  courseName: string;
  subjectName: string;
  period: number;
  grade: number; 
  observations: string;
}

interface ReportData {
  kpis: Kpis;
  subjectAverages: SubjectAverage[];
  distribution: Distribution[];
  detailedRecords: GradeRecord[];
  availableCourses: FilterOption[];
  availableSubjects: FilterOption[];
}

const GlobalGradesReport = ({ institutionId }: Props) => {
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
      const url = new URL(`${apiUrl}/grades-report/${institutionId}`);
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
      console.error("Error cargando el reporte de calificaciones:", error);
    } finally {
      setIsLoading(false);
    }
  }, [institutionId, apiUrl, selectedCourse, selectedSubject]);

  // Ejecutar al montar y cuando cambian los filtros (Curso/Materia)
  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // --- LÓGICA DE FILTRADO LOCAL PARA LA TABLA ---
  const filteredGrades = useMemo(() => {
    if (!data?.detailedRecords) return [];
    
    return data.detailedRecords.filter(record => {
      const matchesSearch = record?.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === "EXCELENCIA") matchesStatus = record.grade >= 4.5;
      if (statusFilter === "APROBADO") matchesStatus = record.grade >= 3.0 && record.grade < 4.5;
      if (statusFilter === "REPROBADO") matchesStatus = record.grade < 3.0;

      return matchesSearch && matchesStatus;
    });
  }, [data?.detailedRecords, searchTerm, statusFilter]);

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

  // --- CLASES ESTILO CUADERNO & ANIMACIONES ---
  const bentoCardClass = "border-2 border-blue-900/20 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-all duration-300 hover:shadow-md hover:border-blue-900/40 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 fill-mode-both";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const inputClass = "w-full bg-blue-900/5 border-2 border-blue-900/10 focus:border-blue-900 rounded-xl outline-none text-blue-950 py-2 px-4 font-bold transition-all shadow-sm placeholder:text-blue-900/40";
  const selectClass = "w-full bg-blue-900/5 border-2 border-blue-900/10 focus:border-blue-900 rounded-xl outline-none text-blue-950 py-2 px-4 font-bold transition-all appearance-none cursor-pointer shadow-sm";

  // --- RENDERIZADO DE ETIQUETAS DE NOTA ---
  const renderGradeBadge = (grade: number) => {
    if (grade >= 4.5) return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 border border-yellow-200 text-[10px] font-black uppercase tracking-widest rounded-full">{grade.toFixed(1)} (Exc)</span>;
    if (grade >= 3.0) return <span className="px-2.5 py-1 bg-green-100 text-green-800 border border-green-200 text-[10px] font-black uppercase tracking-widest rounded-full">{grade.toFixed(1)} (Apr)</span>;
    return <span className="px-2.5 py-1 bg-red-100 text-red-800 border border-red-200 text-[10px] font-black uppercase tracking-widest rounded-full">{grade.toFixed(1)} (Rep)</span>;
  };

  // --- PANTALLA DE CARGA GLOBAL INICIAL ---
  if (isLoading && !data) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-blue-900/50">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h3 className="text-xl font-black">Cargando Reporte de Calificaciones...</h3>
        <p className="font-medium">Sincronizando registros con la base de datos</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 overflow-hidden">
      
      {/* CABECERA */}
      <div className="mb-2 animate-in fade-in slide-in-from-left-4 duration-700">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Reporte de Calificaciones</h2>
        <p className="text-blue-900/70 font-medium">
          Auditoría de rendimiento académico y seguimiento de notas por periodo.
        </p>
      </div>

      {/* BARRA DE FILTROS GLOBALES (Conectada al Backend) */}
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
            <BookOpen className="w-4 h-4"/> Asignatura:
          </label>
          <select className={selectClass} value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="ALL">Todas las asignaturas</option>
            {(data?.availableSubjects || []).map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* PANTALLA DE CARGA DURANTE EL FILTRADO */}
      {isLoading ? (
        <div className="w-full flex flex-col items-center justify-center py-10 text-blue-900/50 animate-in fade-in">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-bold">Calculando promedios y rendimiento...</p>
        </div>
      ) : (
        <>
          {/* --- SECCIÓN 1: KPI DINÁMICOS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border-2 border-blue-900/20 bg-transparent rounded-3xl p-5 flex flex-col gap-1 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-900/40 animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest">Promedio Global</span>
                <div className="p-2 bg-blue-100 rounded-xl"><GraduationCap className="w-5 h-5 text-blue-600" /></div>
              </div>
              <div className="text-4xl font-black text-blue-950">{data?.kpis?.avg || "0.0"} <span className="text-2xl text-blue-900/50">/ 5.0</span></div>
              <p className="text-xs text-blue-900/60 font-bold mt-1">Acorde a los filtros actuales</p>
            </div>

            <div className="border-2 border-blue-900/20 bg-transparent rounded-3xl p-5 flex flex-col gap-1 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-900/40 animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: '150ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest">Aprobación</span>
                <div className="p-2 bg-green-100 rounded-xl"><TrendingUp className="w-5 h-5 text-green-600" /></div>
              </div>
              <div className="text-4xl font-black text-blue-950">{data?.kpis?.aprPerc || 0}%</div>
              <p className="text-xs text-blue-900/60 font-bold mt-1">Alumnos sobre la media (3.0)</p>
            </div>

            <div className="border-2 border-blue-900/20 bg-transparent rounded-3xl p-5 flex flex-col gap-1 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-900/40 animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: '200ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest">Riesgo Académico</span>
                <div className="p-2 bg-red-100 rounded-xl"><TrendingDown className="w-5 h-5 text-red-600" /></div>
              </div>
              <div className="text-4xl font-black text-blue-950">{data?.kpis?.repPerc || 0}%</div>
              <p className="text-xs text-blue-900/60 font-bold mt-1">Alumnos con notas bajo 3.0</p>
            </div>

            <div className="border-2 border-blue-900/20 bg-transparent rounded-3xl p-5 flex flex-col gap-1 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-900/40 animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: '250ms' }}>
              <div className="flex justify-between items-center text-blue-900/80 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest">Excelencia</span>
                <div className="p-2 bg-yellow-100 rounded-xl"><Award className="w-5 h-5 text-yellow-500" /></div>
              </div>
              <div className="text-4xl font-black text-blue-950">{data?.kpis?.excPerc || 0}%</div>
              <p className="text-xs text-blue-900/60 font-bold mt-1">Alumnos con promedio &gt; 4.5</p>
            </div>
          </div>

          {/* --- SECCIÓN 2: GRÁFICOS DINÁMICOS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* GRÁFICA DE DONA (Distribución de Rendimiento) */}
            <div className={`${bentoCardClass} lg:col-span-1 flex flex-col`} style={{ animationDelay: '300ms' }}>
              <h3 className={bentoTitleClass}><PieChartIcon className="w-5 h-5"/> Distribución</h3>
              <div className="h-[250px] w-full flex items-center justify-center mt-2">
                {(data?.distribution || []).length > 0 ? (
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
                        cy="55%" 
                        innerRadius={55} 
                        outerRadius={85} 
                        paddingAngle={2}
                        stroke="transparent"
                      >
                        {(data?.distribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontWeight: 'bold', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-blue-900/40 font-bold animate-in zoom-in-95">Sin datos para graficar</div>
                )}
              </div>
            </div>

            {/* GRÁFICA DE BARRAS (Desempeño por Área) */}
            <div className={`${bentoCardClass} lg:col-span-2`} style={{ animationDelay: '350ms' }}>
              <h3 className={bentoTitleClass}><BookOpen className="w-5 h-5"/> Promedio por Asignatura</h3>
              <p className="text-xs text-blue-900/70 font-medium mb-2">Promedio general calculando únicamente los filtros activos.</p>
              
              <div className="h-[250px] w-full mt-2">
                {(data?.subjectAverages || []).length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.subjectAverages || []} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.1} vertical={false} />
                      <XAxis dataKey="materia" stroke="#1e3a8a" tick={{ fill: '#1e3a8a', fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '2px solid rgba(30,58,138,0.2)', fontWeight: 'bold' }}
                        cursor={{ fill: 'rgba(30,58,138,0.05)' }}
                        formatter={(value: any) => [`${Number(value).toFixed(1)} / 5.0`, 'Promedio']}
                      />
                      <ReferenceLine y={3.0} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Mín. Aprobatorio (3.0)', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                      <Bar dataKey="promedio" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-blue-900/40 font-bold animate-in zoom-in-95">Sin datos para graficar</div>
                )}
              </div>
            </div>
          </div>

          {/* --- SECCIÓN 3: TABLA AUDITORÍA DE NOTAS --- */}
          <div className={bentoCardClass} style={{ animationDelay: '400ms' }}>
            <h3 className={bentoTitleClass}><Search className="w-5 h-5"/> Auditoría Detallada</h3>
            
            {/* Filtros Internos de la Tabla */}
            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-blue-900/40" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre del estudiante..." 
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
                  <option value="">Rendimiento Específico</option>
                  <option value="EXCELENCIA">Excelencia (&gt;= 4.5)</option>
                  <option value="APROBADO">Aprobados (&gt;= 3.0)</option>
                  <option value="REPROBADO">Reprobados (&lt; 3.0)</option>
                </select>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto mt-2">
              {filteredGrades.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-blue-900/10">
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Estudiante</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Curso</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Asignatura</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-center">Periodo</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-center">Calificación</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGrades.map((record) => (
                      <tr key={record.id} className="border-b border-blue-900/5 hover:bg-blue-900/5 transition-colors group">
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
                        <td className="py-3 px-2 font-black text-blue-900/80">{record.courseName}</td>
                        <td className="py-3 px-2 font-bold text-blue-900/80">{record.subjectName}</td>
                        <td className="py-3 px-2 text-center font-bold text-blue-900/50">P{record.period}</td>
                        <td className="py-3 px-2 text-center">
                          {renderGradeBadge(record.grade)}
                        </td>
                        <td className="py-3 px-2 text-sm font-medium text-blue-900/60 max-w-xs truncate" title={record.observations}>
                          {record.observations || "Sin observaciones."}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-blue-900/40 animate-in zoom-in-95">
                  <Search className="w-10 h-10 mb-3 opacity-50" />
                  <p className="font-bold">No se encontraron calificaciones con los filtros seleccionados.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GlobalGradesReport;