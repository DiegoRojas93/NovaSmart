import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { GraduationCap, TrendingUp, TrendingDown, Award, Search, BookOpen } from "lucide-react";

// --- INTERFACES ---
interface GradeRecord {
  id: string;
  studentName: string;
  courseName: string;
  subjectName: string;
  period: number;
  grade: number; // Nota de 1.0 a 5.0 (Típico en Colombia)
  observations: string;
}

// --- DATOS SIMULADOS ---
// Promedios simulados para la gráfica
const subjectAverages = [
  { materia: "Matemáticas", promedio: 3.2 },
  { materia: "Física", promedio: 3.5 },
  { materia: "Química", promedio: 3.4 },
  { materia: "Biología", promedio: 4.1 },
  { materia: "Historia", promedio: 4.3 },
  { materia: "Inglés", promedio: 3.9 },
  { materia: "Educación Física", promedio: 4.8 },
];

// Registros detallados de la tabla student_grades
const mockGrades: GradeRecord[] = [
  { id: "1", studentName: "Camilo Gómez", courseName: "601", subjectName: "Matemáticas", period: 1, grade: 2.8, observations: "Falta entrega de talleres" },
  { id: "2", studentName: "Camilo Gómez", courseName: "601", subjectName: "Historia", period: 1, grade: 4.2, observations: "Excelente participación" },
  { id: "3", studentName: "Ana Silva", courseName: "902", subjectName: "Física", period: 2, grade: 3.1, observations: "Aprobado con lo justo" },
  { id: "4", studentName: "Carlos Pérez", courseName: "1001", subjectName: "Química", period: 2, grade: 4.9, observations: "Sobresaliente" },
  { id: "5", studentName: "María Ruiz", courseName: "1102", subjectName: "Inglés", period: 1, grade: 1.5, observations: "No presentó el examen final" },
];

const GlobalGradesReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" | "APROBADO" | "REPROBADO"

  // --- LÓGICA DE FILTRADO ---
  const filteredGrades = mockGrades.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.courseName.includes(searchTerm) ||
                          record.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === "APROBADO") matchesStatus = record.grade >= 3.0;
    if (statusFilter === "REPROBADO") matchesStatus = record.grade < 3.0;

    return matchesSearch && matchesStatus;
  });

  // --- CLASES ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all placeholder:text-blue-900/40";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";

  // --- RENDERIZADO DE ETIQUETAS DE NOTA ---
  const renderGradeBadge = (grade: number) => {
    // Escala típica: >= 4.5 Excelente, >= 3.0 Aprobado, < 3.0 Reprobado
    if (grade >= 4.5) return <span className="px-2 py-1 bg-green-100 text-green-800 text-[11px] font-black rounded-md">{grade.toFixed(1)} (Exc)</span>;
    if (grade >= 3.0) return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[11px] font-black rounded-md">{grade.toFixed(1)} (Apr)</span>;
    return <span className="px-2 py-1 bg-red-100 text-red-800 text-[11px] font-black rounded-md">{grade.toFixed(1)} (Rep)</span>;
  };

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Reporte de Calificaciones</h2>
        <p className="text-blue-900/70 font-medium">
          Auditoría de rendimiento académico y seguimiento de notas por periodo.
        </p>
      </div>

      {/* --- SECCIÓN 1: KPI (Métricas de la Institución) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex justify-between items-center text-blue-900/80">
            <span className="text-xs font-bold uppercase tracking-widest">Promedio Global</span>
            <GraduationCap className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-950">3.8 / 5.0</div>
          <p className="text-xs text-blue-900/60 font-bold">Estable respecto al mes anterior</p>
        </div>

        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex justify-between items-center text-blue-900/80">
            <span className="text-xs font-bold uppercase tracking-widest">Aprobación</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-black text-blue-950">78%</div>
          <p className="text-xs text-blue-900/60 font-bold">Alumnos sobre la media (3.0)</p>
        </div>

        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex justify-between items-center text-blue-900/80">
            <span className="text-xs font-bold uppercase tracking-widest">Riesgo Académico</span>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-black text-blue-950">22%</div>
          <p className="text-xs text-blue-900/60 font-bold">Alumnos con notas bajo 3.0</p>
        </div>

        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex justify-between items-center text-blue-900/80">
            <span className="text-xs font-bold uppercase tracking-widest">Excelencia</span>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-black text-blue-950">15%</div>
          <p className="text-xs text-blue-900/60 font-bold">Alumnos con promedio &gt; 4.5</p>
        </div>
      </div>

      {/* --- SECCIÓN 2: GRÁFICA DE DESEMPEÑO POR ÁREA --- */}
      <div className={bentoCardClass}>
        <h3 className={bentoTitleClass}><BookOpen className="w-5 h-5"/> Rendimiento Promedio por Asignatura</h3>
        <p className="text-xs text-blue-900/70 font-medium mb-4">Promedio general de todas las aulas cursando la asignatura.</p>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectAverages} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.1} vertical={false} />
              <XAxis dataKey="materia" stroke="#1e3a8a" tick={{ fill: '#1e3a8a', fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '2px solid rgba(30,58,138,0.2)', fontWeight: 'bold' }}
                cursor={{ fill: 'rgba(30,58,138,0.05)' }}
                formatter={(value: number) => [`${value.toFixed(1)} / 5.0`, 'Promedio']}
              />
              {/* Línea de corte para saber qué está aprobado (3.0) */}
              <ReferenceLine y={3.0} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Mín. Aprobatorio (3.0)', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
              
              <Bar dataKey="promedio" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- SECCIÓN 3: TABLA AUDITORÍA DE NOTAS --- */}
      <div className={bentoCardClass}>
        <h3 className={bentoTitleClass}><Search className="w-5 h-5"/> Auditoría Detallada</h3>
        
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 border-b-2 border-blue-900/10 pb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-0 top-1.5 w-5 h-5 text-blue-900/50" />
            <input 
              type="text" 
              placeholder="Buscar por alumno, materia o curso (Ej: Camilo, Física, 601)..." 
              className={`${inputClass} pl-8`}
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
              <option value="" className="bg-white">Todas las notas</option>
              <option value="APROBADO" className="bg-white text-blue-700 font-bold">Aprobados (&gt;= 3.0)</option>
              <option value="REPROBADO" className="bg-white text-red-700 font-bold">Reprobados (&lt; 3.0)</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          {filteredGrades.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-blue-900/50">
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Estudiante</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Curso</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Asignatura</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-center">Periodo</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-center">Calificación</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Observaciones Docente</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((record) => (
                  <tr key={record.id} className="border-b border-blue-900/10 hover:bg-blue-900/5 transition-colors">
                    <td className="py-3 px-2 font-bold">{record.studentName}</td>
                    <td className="py-3 px-2 font-medium text-blue-900/80">{record.courseName}</td>
                    <td className="py-3 px-2 font-medium">{record.subjectName}</td>
                    <td className="py-3 px-2 text-center font-bold text-blue-900/60">P{record.period}</td>
                    <td className="py-3 px-2 text-center">
                      {renderGradeBadge(record.grade)}
                    </td>
                    <td className="py-3 px-2 text-sm italic text-blue-900/70 max-w-xs truncate" title={record.observations}>
                      {record.observations || "Sin observaciones."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-blue-900/50">
              <Search className="w-12 h-12 mb-3 opacity-50" />
              <p className="font-bold">No se encontraron calificaciones con esos criterios.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default GlobalGradesReport;