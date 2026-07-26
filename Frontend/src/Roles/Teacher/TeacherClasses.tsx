import { useState } from "react";
import { BookOpen, MapPin, Clock, Users, ChevronDown, ChevronUp, CheckSquare, Award, UserCircle } from "lucide-react";

// --- INTERFACES ---
interface Student {
  id: string;
  name: string;
  document: string;
}

interface AssignedClass {
  id: string;
  subject: string;
  subjectCode: string;
  course: string;
  classroom: string;
  schedules: string[]; // Ej: ["Lun 07:00-09:00", "Mié 07:00-09:00"]
  students: Student[];
}

// --- DATOS SIMULADOS (Basados en classroom_subjects + enrollments + schedules) ---
const mockClasses: AssignedClass[] = [
  {
    id: "CS1",
    subject: "Cálculo",
    subjectCode: "MAT-101",
    course: "1101",
    classroom: "Aula 301 - Bloque A",
    schedules: ["Lunes 07:00 - 09:00", "Miércoles 07:00 - 09:00"],
    students: [
      { id: "S1", name: "Álvarez, María Camila", document: "100222333" },
      { id: "S2", name: "Bermúdez, Carlos Andrés", document: "100444555" },
      { id: "S3", name: "Castro, Luis Fernando", document: "100666777" },
    ]
  },
  {
    id: "CS2",
    subject: "Cálculo",
    subjectCode: "MAT-101",
    course: "1102",
    classroom: "Aula 302 - Bloque A",
    schedules: ["Martes 09:30 - 11:30", "Jueves 09:30 - 11:30"],
    students: [
      { id: "S4", name: "Díaz, Ana Sofía", document: "100888999" },
      { id: "S5", name: "Gómez, Santiago", document: "101111222" },
    ]
  },
  {
    id: "CS3",
    subject: "Física I",
    subjectCode: "FIS-201",
    course: "1001",
    classroom: "Laboratorio Física - Piso 1",
    schedules: ["Viernes 12:00 - 14:00"],
    students: [
      { id: "S6", name: "Herrera, Laura", document: "102222333" },
      { id: "S7", name: "Jiménez, Pedro", document: "103333444" },
      { id: "S8", name: "López, Valentina", document: "104444555" },
      { id: "S9", name: "Martínez, Juan", document: "105555666" },
    ]
  }
];

const TeacherClasses = () => {
  // Estado para controlar qué tarjeta está expandida (acordeón)
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedClassId(prev => prev === id ? null : id);
  };

  // --- CLASES CSS ESTILO CUADERNO ---
  const chipClass = "bg-blue-900/10 text-blue-950 font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 text-sm border border-blue-900/10";
  const actionBtnClass = "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-black text-sm transition-all border-2 uppercase tracking-wider";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Mis Clases Asignadas</h2>
        <p className="text-blue-900/70 font-medium">
          Directorio completo de sus grupos en el periodo académico vigente. Consulte horarios y listados de alumnos.
        </p>
      </div>

      {/* LISTA DE CLASES */}
      <div className="flex flex-col gap-6">
        {mockClasses.map((cls) => {
          const isExpanded = expandedClassId === cls.id;

          return (
            <div 
              key={cls.id} 
              className={`border-2 rounded-3xl bg-transparent transition-all overflow-hidden ${
                isExpanded ? "border-blue-900 shadow-[6px_6px_0_rgba(30,58,138,0.2)]" : "border-blue-900/30 hover:border-blue-900/60"
              }`}
            >
              {/* CABECERA DE LA TARJETA (Clickeable) */}
              <div 
                onClick={() => toggleExpand(cls.id)}
                className={`p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${
                  isExpanded ? "bg-blue-900/5" : "hover:bg-blue-900/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md transform -rotate-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-blue-950 flex items-center gap-2">
                      {cls.course} <span className="text-blue-900/40">|</span> {cls.subject}
                    </h3>
                    <p className="text-sm font-bold text-blue-900/60 uppercase tracking-widest">{cls.subjectCode}</p>
                  </div>
                </div>

                {/* Chips informativos rápidos */}
                <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                  <span className={chipClass}>
                    <MapPin className="w-4 h-4 text-blue-900/60" /> {cls.classroom}
                  </span>
                  <span className={chipClass}>
                    <Users className="w-4 h-4 text-blue-900/60" /> {cls.students.length} Alumnos
                  </span>
                  <button className="ml-2 p-2 rounded-full bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* CONTENIDO EXPANDIDO (Horarios, Listado y Acciones) */}
              {isExpanded && (
                <div className="p-6 border-t-2 border-blue-900/20 border-dashed animate-in slide-in-from-top-2 duration-300">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Columna Izquierda: Horarios y Acciones */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                      
                      {/* Horarios */}
                      <div>
                        <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Horario Semanal
                        </h4>
                        <div className="flex flex-col gap-2">
                          {cls.schedules.map((schedule, idx) => (
                            <div key={idx} className="bg-white border-2 border-blue-900/10 p-3 rounded-xl font-bold text-blue-950 text-sm shadow-sm flex items-center justify-between">
                              <span>{schedule.split(" ")[0]}</span> {/* Día */}
                              <span className="text-blue-900/60 bg-blue-900/10 px-2 py-0.5 rounded-md">{schedule.split(" ").slice(1).join(" ")}</span> {/* Hora */}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Acciones Rápidas */}
                      <div>
                        <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Award className="w-4 h-4" /> Accesos Rápidos
                        </h4>
                        <div className="flex flex-col gap-3">
                          <button className={`${actionBtnClass} border-blue-900 bg-blue-900 text-white shadow-[3px_3px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5`}>
                            <CheckSquare className="w-5 h-5" /> Tomar Asistencia
                          </button>
                          <button className={`${actionBtnClass} border-blue-900 text-blue-950 bg-transparent hover:bg-blue-900/10`}>
                            <Award className="w-5 h-5" /> Calificar Grupo
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Columna Derecha: Listado de Estudiantes */}
                    <div className="lg:col-span-2">
                      <h4 className="text-xs font-bold text-blue-900/70 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Listado Oficial ({cls.students.length})
                      </h4>
                      
                      <div className="bg-white border-2 border-blue-900/20 rounded-2xl overflow-hidden shadow-sm">
                        <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                          <table className="w-full text-left border-collapse">
                            <thead className="bg-blue-900/5 sticky top-0 backdrop-blur-sm">
                              <tr>
                                <th className="py-2 px-4 font-black text-blue-950 text-xs uppercase tracking-widest border-b-2 border-blue-900/10 w-12 text-center">N°</th>
                                <th className="py-2 px-4 font-black text-blue-950 text-xs uppercase tracking-widest border-b-2 border-blue-900/10">Apellidos y Nombres</th>
                                <th className="py-2 px-4 font-black text-blue-950 text-xs uppercase tracking-widest border-b-2 border-blue-900/10 text-right">Documento</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cls.students.map((student, idx) => (
                                <tr key={student.id} className="border-b border-blue-900/5 hover:bg-blue-900/5 transition-colors">
                                  <td className="py-3 px-4 font-bold text-blue-900/50 text-center text-sm">{idx + 1}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <UserCircle className="w-5 h-5 text-blue-900/40" />
                                      <span className="font-bold text-blue-950 text-sm">{student.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-right font-medium text-blue-900/70 text-sm">
                                    {student.document}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default TeacherClasses;