import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { UserCheck, UserX, Clock, FileText, Search, Calendar as CalendarIcon } from "lucide-react";

// --- INTERFACES ---
interface AttendanceRecord {
  id: string;
  date: string;
  studentName: string;
  subjectName: string;
  courseName: string;
  status: "PRESENTE" | "AUSENTE" | "LLEGO_TARDE" | "JUSTIFICADO";
  observations: string;
}

// --- DATOS SIMULADOS ---
const attendanceTrends = [
  { fecha: "Lun 12", presente: 420, ausente: 15, tarde: 10, justificado: 5 },
  { fecha: "Mar 13", presente: 430, ausente: 8, tarde: 7, justificado: 5 },
  { fecha: "Mié 14", presente: 410, ausente: 20, tarde: 12, justificado: 8 },
  { fecha: "Jue 15", presente: 425, ausente: 12, tarde: 8, justificado: 5 },
  { fecha: "Vie 16", presente: 400, ausente: 30, tarde: 15, justificado: 5 },
];

const mockRecords: AttendanceRecord[] = [
  { id: "1", date: "2026-07-25", studentName: "Camilo Gómez", subjectName: "Matemáticas", courseName: "601", status: "AUSENTE", observations: "No reportó" },
  { id: "2", date: "2026-07-25", studentName: "Ana Silva", subjectName: "Historia", courseName: "902", status: "LLEGO_TARDE", observations: "Retraso por transporte" },
  { id: "3", date: "2026-07-24", studentName: "Carlos Pérez", subjectName: "Física", courseName: "1001", status: "JUSTIFICADO", observations: "Cita médica adjunta" },
  { id: "4", date: "2026-07-24", studentName: "María Ruiz", subjectName: "Química", courseName: "1102", status: "PRESENTE", observations: "" },
];

const GlobalAttendanceReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // --- LÓGICA DE FILTRADO ---
  const filteredRecords = mockRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.courseName.includes(searchTerm);
    const matchesStatus = statusFilter === "" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- CLASES ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all placeholder:text-blue-900/40";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";

  // --- RENDERIZADO DE ETIQUETAS DE ESTADO ---
  const renderStatusBadge = (status: AttendanceRecord['status']) => {
    const styles = {
      PRESENTE: "bg-green-100 text-green-800",
      AUSENTE: "bg-red-100 text-red-800",
      LLEGO_TARDE: "bg-yellow-100 text-yellow-800",
      JUSTIFICADO: "bg-blue-100 text-blue-800"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[status]}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Reporte de Asistencia Global</h2>
        <p className="text-blue-900/70 font-medium">
          Monitoreo en tiempo real del ausentismo y puntualidad en la institución.
        </p>
      </div>

      {/* --- SECCIÓN 1: KPI (Métricas rápidas de HOY) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex justify-between items-center text-blue-900/80">
            <span className="text-xs font-bold uppercase tracking-widest">Presentes Hoy</span>
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-black text-blue-950">92%</div>
          <p className="text-xs text-blue-900/60 font-bold">410 estudiantes</p>
        </div>

        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex justify-between items-center text-blue-900/80">
            <span className="text-xs font-bold uppercase tracking-widest">Ausentes</span>
            <UserX className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-black text-blue-950">4.5%</div>
          <p className="text-xs text-blue-900/60 font-bold">20 estudiantes</p>
        </div>

        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex justify-between items-center text-blue-900/80">
            <span className="text-xs font-bold uppercase tracking-widest">Llegadas Tarde</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-black text-blue-950">2%</div>
          <p className="text-xs text-blue-900/60 font-bold">12 estudiantes</p>
        </div>

        <div className="border-2 border-blue-900/20 bg-transparent rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex justify-between items-center text-blue-900/80">
            <span className="text-xs font-bold uppercase tracking-widest">Justificados</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-950">1.5%</div>
          <p className="text-xs text-blue-900/60 font-bold">8 permisos aprobados</p>
        </div>
      </div>

      {/* --- SECCIÓN 2: GRÁFICA DE TENDENCIA --- */}
      <div className={bentoCardClass}>
        <h3 className={bentoTitleClass}><CalendarIcon className="w-5 h-5"/> Tendencia Semanal</h3>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceTrends} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.1} vertical={false} />
              <XAxis dataKey="fecha" stroke="#1e3a8a" tick={{ fill: '#1e3a8a', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '2px solid rgba(30,58,138,0.2)', fontWeight: 'bold' }}
                cursor={{ fill: 'rgba(30,58,138,0.05)' }}
              />
              <Legend wrapperStyle={{ fontWeight: 'bold', fontSize: '12px' }} />
              {/* Gráfico de barras apiladas */}
              <Bar dataKey="presente" stackId="a" fill="#22c55e" name="Presente" radius={[0, 0, 4, 4]} />
              <Bar dataKey="justificado" stackId="a" fill="#3b82f6" name="Justificado" />
              <Bar dataKey="tarde" stackId="a" fill="#eab308" name="Tarde" />
              <Bar dataKey="ausente" stackId="a" fill="#ef4444" name="Ausente" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- SECCIÓN 3: TABLA DE DETALLES --- */}
      <div className={bentoCardClass}>
        <h3 className={bentoTitleClass}><Search className="w-5 h-5"/> Registro Detallado</h3>
        
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 border-b-2 border-blue-900/10 pb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-0 top-1.5 w-5 h-5 text-blue-900/50" />
            <input 
              type="text" 
              placeholder="Buscar por alumno o curso (Ej: Camilo, 601)..." 
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
              <option value="" className="bg-white">Todos los estados</option>
              <option value="PRESENTE" className="bg-white text-green-700 font-bold">Presente</option>
              <option value="AUSENTE" className="bg-white text-red-700 font-bold">Ausente</option>
              <option value="LLEGO_TARDE" className="bg-white text-yellow-700 font-bold">Llegó Tarde</option>
              <option value="JUSTIFICADO" className="bg-white text-blue-700 font-bold">Justificado</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          {filteredRecords.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-blue-900/50">
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Fecha</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Estudiante</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Curso / Materia</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-center">Estado</th>
                  <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-blue-900/10 hover:bg-blue-900/5 transition-colors">
                    <td className="py-3 px-2 font-medium text-blue-900/80">{record.date}</td>
                    <td className="py-3 px-2 font-bold">{record.studentName}</td>
                    <td className="py-3 px-2">
                      <span className="block font-bold">{record.courseName}</span>
                      <span className="text-xs text-blue-900/70">{record.subjectName}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {renderStatusBadge(record.status)}
                    </td>
                    <td className="py-3 px-2 text-sm italic text-blue-900/70 max-w-xs truncate" title={record.observations}>
                      {record.observations || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-blue-900/50">
              <UserCheck className="w-12 h-12 mb-3 opacity-50" />
              <p className="font-bold">No hay registros de asistencia que coincidan con la búsqueda.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default GlobalAttendanceReport;