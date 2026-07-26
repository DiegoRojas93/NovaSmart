import { useState, type FormEvent } from "react";
import { Save, Plus, Trash2, GraduationCap, MapPin, BookOpen } from "lucide-react";

// --- INTERFACES PARA EL ESTADO DINÁMICO ---
interface ClassroomInput {
  id: number;
  name: string;
  capacity: string;
  building: string;
}

interface SubjectInput {
  id: number;
  name: string;
  code: string;
  description: string;
}

const AcademicsCreationForm = () => {
  const [isSaving, setIsSaving] = useState(false);

  // --- ESTADOS DEL FORMULARIO ---
  const [gradeName, setGradeName] = useState("");
  
  // Arreglos dinámicos para los Cursos y Materias
  const [classrooms, setClassrooms] = useState<ClassroomInput[]>([
    { id: Date.now(), name: "", capacity: "", building: "" }
  ]);
  
  const [subjects, setSubjects] = useState<SubjectInput[]>([
    { id: Date.now(), name: "", code: "", description: "" }
  ]);

  // --- MANEJADORES DE CURSOS (AULAS) ---
  const addClassroom = () => {
    setClassrooms([...classrooms, { id: Date.now(), name: "", capacity: "", building: "" }]);
  };

  const removeClassroom = (id: number) => {
    if (classrooms.length > 1) {
      setClassrooms(classrooms.filter(c => c.id !== id));
    }
  };

  const handleClassroomChange = (id: number, field: keyof ClassroomInput, value: string) => {
    setClassrooms(classrooms.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // --- MANEJADORES DE MATERIAS ---
  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now(), name: "", code: "", description: "" }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const handleSubjectChange = (id: number, field: keyof SubjectInput, value: string) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // --- ENVÍO DEL FORMULARIO ---
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      gradeName,
      classrooms,
      subjects
    };

    console.log("Datos a enviar al backend:", payload);

    // Simulación de guardado
    setTimeout(() => {
      alert("¡Grado, cursos y materias creados exitosamente!");
      // Limpiar formulario
      setGradeName("");
      setClassrooms([{ id: Date.now(), name: "", capacity: "", building: "" }]);
      setSubjects([{ id: Date.now(), name: "", code: "", description: "" }]);
      setIsSaving(false);
    }, 1000);
  };

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 placeholder:text-blue-900/40 font-medium transition-all";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Creación Académica</h2>
        <p className="text-blue-900/70 font-medium">Define un nuevo grado escolar junto con sus aulas y pénsum académico.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">

        {/* --- PASO 1: DATOS DEL GRADO --- */}
        <div className={bentoCardClass}>
          <h3 className={bentoTitleClass}><GraduationCap className="w-6 h-6"/> 1. Información del Grado</h3>
          <div className="w-full md:w-1/2">
            <label className={labelClass}>Nombre del Grado Escolar:</label>
            <input 
              type="text" 
              placeholder="Ej: Sexto Grado, Ciclo Inicial..." 
              className={`${inputClass} text-lg`} 
              value={gradeName}
              onChange={(e) => setGradeName(e.target.value)}
              required 
            />
          </div>
        </div>

        {/* --- PASO 2: CURSOS / AULAS --- */}
        <div className={bentoCardClass}>
          <div className="flex justify-between items-center border-b-2 border-blue-900/80 pb-1 mb-2">
            <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2">
              <MapPin className="w-6 h-6"/> 2. Cursos (Aulas)
            </h3>
            <button 
              type="button" 
              onClick={addClassroom}
              className="text-sm font-bold bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4"/> Agregar Curso
            </button>
          </div>
          <p className="text-sm text-blue-900/70 font-medium mb-2">Define las divisiones físicas o grupos para este grado.</p>

          <div className="flex flex-col gap-4">
            {classrooms.map((classroom, index) => (
              <div key={classroom.id} className="flex flex-col md:flex-row gap-4 items-end bg-blue-900/5 p-4 rounded-2xl border border-blue-900/20 relative group">
                <div className="absolute -left-3 -top-3 w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <label className={labelClass}>Nombre / Grupo:</label>
                  <input type="text" placeholder="Ej: 601, 6A..." className={inputClass} value={classroom.name} onChange={(e) => handleClassroomChange(classroom.id, "name", e.target.value)} required />
                </div>
                <div className="w-full md:w-32">
                  <label className={labelClass}>Capacidad:</label>
                  <input type="number" placeholder="Ej: 35" className={inputClass} value={classroom.capacity} onChange={(e) => handleClassroomChange(classroom.id, "capacity", e.target.value)} required />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>Edificio / Ubicación:</label>
                  <input type="text" placeholder="Ej: Bloque A, Piso 2..." className={inputClass} value={classroom.building} onChange={(e) => handleClassroomChange(classroom.id, "building", e.target.value)} />
                </div>
                
                <button 
                  type="button" 
                  onClick={() => removeClassroom(classroom.id)}
                  disabled={classrooms.length === 1}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Eliminar curso"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- PASO 3: MATERIAS (PÉNSUM) --- */}
        <div className={bentoCardClass}>
          <div className="flex justify-between items-center border-b-2 border-blue-900/80 pb-1 mb-2">
            <h3 className="text-xl font-extrabold text-blue-950 inline-flex items-center gap-2">
              <BookOpen className="w-6 h-6"/> 3. Asignaturas (Pénsum)
            </h3>
            <button 
              type="button" 
              onClick={addSubject}
              className="text-sm font-bold bg-blue-900/10 text-blue-900 hover:bg-blue-900 hover:text-white px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4"/> Agregar Materia
            </button>
          </div>
          <p className="text-sm text-blue-900/70 font-medium mb-2">Agrega las materias que cursarán los estudiantes de este grado.</p>

          <div className="flex flex-col gap-4">
            {subjects.map((subject, index) => (
              <div key={subject.id} className="flex flex-col md:flex-row gap-4 items-end bg-blue-900/5 p-4 rounded-2xl border border-blue-900/20 relative group">
                <div className="absolute -left-3 -top-3 w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                  {index + 1}
                </div>
                
                <div className="w-full md:w-32">
                  <label className={labelClass}>Código:</label>
                  <input type="text" placeholder="Ej: MAT-01" className={inputClass} value={subject.code} onChange={(e) => handleSubjectChange(subject.id, "code", e.target.value)} required />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>Nombre Materia:</label>
                  <input type="text" placeholder="Ej: Matemáticas Básicas" className={inputClass} value={subject.name} onChange={(e) => handleSubjectChange(subject.id, "name", e.target.value)} required />
                </div>
                <div className="flex-[2]">
                  <label className={labelClass}>Descripción (Opcional):</label>
                  <input type="text" placeholder="Temática general de la materia..." className={inputClass} value={subject.description} onChange={(e) => handleSubjectChange(subject.id, "description", e.target.value)} />
                </div>
                
                <button 
                  type="button" 
                  onClick={() => removeSubject(subject.id)}
                  disabled={subjects.length === 1}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Eliminar materia"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- BOTÓN DE GUARDADO --- */}
        <div className="flex justify-end mt-4">
          <button 
            type="submit" 
            disabled={isSaving}
            className={`flex items-center gap-3 px-8 py-3 border-4 border-blue-900 text-blue-950 font-black text-xl rounded-2xl transition-all uppercase tracking-widest ${
              isSaving 
                ? "opacity-50 cursor-not-allowed bg-blue-900/10" 
                : "hover:bg-blue-900 hover:text-white shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
            }`}
          >
            <Save className="w-6 h-6" />
            {isSaving ? "Guardando..." : "Crear Estructura"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AcademicsCreationForm;