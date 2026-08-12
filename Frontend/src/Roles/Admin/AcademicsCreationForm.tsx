import { useState, useEffect, type FormEvent } from "react";
import { Save, Plus, Trash2, GraduationCap, MapPin, BookOpen, Search, Edit2, X } from "lucide-react";
import { ModalComponent } from "@/shared/Basics/ModalComponent";

// --- INTERFACES ---
interface ClassroomInput {
  id: number;
  name: string;
  capacity: string;
  floor: string; // <-- NUEVO CAMPO AÑADIDO
  building: string;
}

interface SubjectInput {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface GradeSummary {
  id: number;
  name: string;
  classroomCount: number;
  subjectCount: number;
}

const AcademicsCreationForm = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS DE LA TABLA ---
  const [grades, setGrades] = useState<GradeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- ESTADOS DE VISTAS Y MODAL ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGradeId, setEditingGradeId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
    errorCode: null as number | null
  });

  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  // --- ESTADOS DEL FORMULARIO ---
  const [gradeName, setGradeName] = useState("");
  const [classrooms, setClassrooms] = useState<ClassroomInput[]>([
    { id: Date.now(), name: "", capacity: "", floor: "", building: "" } // <-- ACTUALIZADO
  ]);
  const [subjects, setSubjects] = useState<SubjectInput[]>([
    { id: Date.now(), name: "", code: "", description: "" }
  ]);

  // --- 1. CARGAR LISTADO DE GRADOS (GET) ---
  const fetchGrades = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/academics/grades`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.ok) {
        setGrades(await response.json());
      } else {
        throw new Error("Error al cargar la tabla de grados");
      }
    } catch (error) {
      console.error("Error al cargar grados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  // --- 2. MANEJO DE VISTAS (Abrir/Cerrar Formulario) ---
  const handleOpenCreate = () => {
    setEditingGradeId(null);
    setGradeName("");
    setClassrooms([{ id: Date.now(), name: "", capacity: "", floor: "", building: "" }]); // <-- ACTUALIZADO
    setSubjects([{ id: Date.now(), name: "", code: "", description: "" }]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = async (gradeId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/academics/grades/${gradeId}`, {
         headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        setGradeName(data.gradeName);
        
        // Si no vienen aulas, ponemos una vacía por defecto
        if (data.classrooms && data.classrooms.length > 0) {
            setClassrooms(data.classrooms);
        } else {
            setClassrooms([{ id: Date.now(), name: "", capacity: "", floor: "", building: "" }]); // <-- ACTUALIZADO
        }

        // Si no vienen materias, ponemos una vacía por defecto
        if (data.subjects && data.subjects.length > 0) {
            setSubjects(data.subjects);
        } else {
            setSubjects([{ id: Date.now(), name: "", code: "", description: "" }]);
        }

        setEditingGradeId(gradeId);
        setIsFormOpen(true);
      } else {
        throw new Error("No se pudo cargar el detalle del grado");
      }
    } catch (error) {
      console.error("Error:", error);
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Ocurrió un problema al cargar los datos del grado.",
        errorCode: null
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingGradeId(null);
  };

  // --- 3. MANEJADORES DE CURSOS Y MATERIAS ---
  const addClassroom = () => setClassrooms([...classrooms, { id: Date.now(), name: "", capacity: "", floor: "", building: "" }]); // <-- ACTUALIZADO
  const removeClassroom = (id: number) => { if (classrooms.length > 1) setClassrooms(classrooms.filter(c => c.id !== id)); };
  const handleClassroomChange = (id: number, field: keyof ClassroomInput, value: string) => {
    setClassrooms(classrooms.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addSubject = () => setSubjects([...subjects, { id: Date.now(), name: "", code: "", description: "" }]);
  const removeSubject = (id: number) => { if (subjects.length > 1) setSubjects(subjects.filter(s => s.id !== id)); };
  const handleSubjectChange = (id: number, field: keyof SubjectInput, value: string) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // --- 4. GUARDAR / ACTUALIZAR (POST / PUT) ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = { gradeName, classrooms, subjects };

    try {
      const method = editingGradeId ? 'PUT' : 'POST';
      const url = editingGradeId ? `${apiUrl}/academics/grades/${editingGradeId}` : `${apiUrl}/academics/grades`;
      
      const response = await fetch(url, {
        method: method,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setModalConfig({
            isOpen: true,
            type: "success",
            title: "¡Éxito!",
            message: editingGradeId ? "Estructura académica actualizada." : "Estructura académica creada.",
            errorCode: null
        });
        handleCloseForm();
        fetchGrades(); // Recargar la tabla
      } else {
        throw new Error("Fallo al guardar la estructura académica");
      }

    } catch (error) {
      console.error(error);
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "No se pudo guardar la información.",
        errorCode: null
      });
    } finally {
      setIsSaving(false);
    }
  };

  // --- 5. ELIMINAR GRADO (DELETE) ---
  const handleDelete = async (id: number, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el grado: ${name}? Se borrarán sus aulas y materias asociadas.`)) {
      try {
        const response = await fetch(`${apiUrl}/academics/grades/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        
        if (response.ok) {
            setModalConfig({
                isOpen: true,
                type: "success",
                title: "¡Eliminado!",
                message: "El grado ha sido eliminado correctamente.",
                errorCode: null
            });
            fetchGrades(); // Recargar tabla
        } else {
            throw new Error("Error al intentar eliminar el grado");
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        setModalConfig({
            isOpen: true,
            type: "error",
            title: "Error",
            message: "No se pudo eliminar el grado.",
            errorCode: null
        });
      }
    }
  };

  // --- FILTRO DE BÚSQUEDA ---
  const filteredGrades = grades.filter(grade => 
    grade.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 placeholder:text-blue-900/40 font-medium transition-all";
  const searchInputClass = "w-full md:max-w-xs bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-2 pl-8 font-medium transition-all placeholder:text-blue-900/40";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* CABECERA DINÁMICA */}
      <div className="mb-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-blue-950 mb-2">
            {isFormOpen ? (editingGradeId ? "Editar Grado Académico" : "Creación Académica") : "Gestión Académica"}
          </h2>
          <p className="text-blue-900/70 font-medium">
            {isFormOpen 
              ? "Define el grado escolar junto con sus aulas y pénsum académico." 
              : "Administre los grados, aulas y materias de la institución."}
          </p>
        </div>
        
        {!isFormOpen ? (
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-blue-900 text-white font-bold hover:bg-blue-800 px-5 py-2.5 rounded-xl transition-all shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
          >
            <Plus className="w-5 h-5" /> Nuevo Grado
          </button>
        ) : (
          <button 
            onClick={handleCloseForm}
            className="flex items-center gap-2 text-blue-900 font-bold hover:bg-blue-900/10 px-4 py-2 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" /> Cancelar
          </button>
        )}
      </div>

      {/* --- VISTA 1: TABLA DE GRADOS --- */}
      {!isFormOpen && (
        <>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-900/50" />
            <input
              type="text"
              placeholder="Buscar grado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={searchInputClass}
            />
          </div>

          <div className={bentoCardClass}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-blue-900/50">
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Grado</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-center">Aulas Asignadas</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-center">Materias en Pénsum</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-10 font-bold text-blue-900/50 animate-pulse">
                        Cargando estructura académica...
                      </td>
                    </tr>
                  ) : filteredGrades.length > 0 ? (
                    filteredGrades.map((grade) => (
                      <tr key={grade.id} className="border-b border-blue-900/10 hover:bg-blue-900/5 transition-colors">
                        <td className="py-4 px-2 font-bold flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-blue-900/60" /> 
                          {grade.name}
                        </td>
                        <td className="py-4 px-2 text-center font-medium text-blue-900/80">{grade.classroomCount}</td>
                        <td className="py-4 px-2 text-center font-medium text-blue-900/80">{grade.subjectCount}</td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => handleOpenEdit(grade.id)}
                              className="p-2 text-blue-900 hover:bg-blue-900/20 rounded-lg transition-colors inline-flex"
                              title="Editar Estructura"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(grade.id, grade.name)}
                              className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors inline-flex"
                              title="Eliminar Estructura"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-10 font-medium text-blue-900/50">
                        No se encontraron grados registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* --- VISTA 2: FORMULARIO DE CREACIÓN / EDICIÓN --- */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* PASO 1: DATOS DEL GRADO */}
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

          {/* PASO 2: CURSOS / AULAS */}
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

                  {/* NUEVO CAMPO: PISO */}
                  <div className="w-full md:w-24">
                    <label className={labelClass}>Piso:</label>
                    <input type="number" placeholder="Ej: 2" className={inputClass} value={classroom.floor} onChange={(e) => handleClassroomChange(classroom.id, "floor", e.target.value)} />
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
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PASO 3: MATERIAS (PÉNSUM) */}
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
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* BOTÓN DE GUARDADO */}
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
              {isSaving ? "Guardando..." : (editingGradeId ? "Guardar Cambios" : "Crear Estructura")}
            </button>
          </div>
        </form>
      )}

      {/* MODAL REUTILIZABLE */}
      <ModalComponent 
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        errorCode={modalConfig.errorCode}
      />
    </div>
  );
};

export default AcademicsCreationForm;