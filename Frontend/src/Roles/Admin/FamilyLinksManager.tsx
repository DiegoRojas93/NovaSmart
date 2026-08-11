import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Link2, Trash2, Users, Shield, GraduationCap, Save, Edit2, X, Search } from "lucide-react";
import { ModalComponent } from "@/shared/Basics/ModalComponent"; // Importamos el modal

// --- INTERFACES ---
interface Person {
  id: number;
  name: string;
  identification: string;
}

interface FamilyLink {
  guardianId: number;
  guardianName: string;
  studentId: number;
  studentName: string;
  relationship: string;
}

const FamilyLinksManager = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS DE DATOS ---
  const [links, setLinks] = useState<FamilyLink[]>([]);
  const [guardians, setGuardians] = useState<Person[]>([]);
  const [students, setStudents] = useState<Person[]>([]);
  
  // --- ESTADOS DE UI ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el buscador

  // --- ESTADOS DEL MODAL ---
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
    errorCode: null as number | null
  });

  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  // --- ESTADO DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    guardianId: "",
    studentId: "",
    relationship: ""
  });

  // --- CARGA INICIAL DE DATOS ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem("token")}` };
      
      const [linksRes, guardiansRes, studentsRes] = await Promise.all([
        fetch(`${apiUrl}/family-links`, { headers }),
        fetch(`${apiUrl}/users/guardians`, { headers }),
        fetch(`${apiUrl}/users/students`, { headers })
      ]);

      if (linksRes.ok) setLinks(await linksRes.json());
      if (guardiansRes.ok) setGuardians(await guardiansRes.json());
      if (studentsRes.ok) setStudents(await studentsRes.json());
      
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- MANEJADORES ---
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (link: FamilyLink) => {
    setIsEditing(true);
    setFormData({
      guardianId: link.guardianId.toString(),
      studentId: link.studentId.toString(),
      relationship: link.relationship
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ guardianId: "", studentId: "", relationship: "" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = isEditing 
        ? `${apiUrl}/family-links/${formData.guardianId}/${formData.studentId}`
        : `${apiUrl}/family-links`;
        
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload = {
        guardianId: Number(formData.guardianId),
        studentId: Number(formData.studentId),
        relationship: formData.relationship
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Error al guardar el vínculo");

      await fetchData();
      handleCancelEdit();
      
      // Reemplazo del Alert por el Modal
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "¡Éxito!",
        message: isEditing ? "Vínculo actualizado correctamente." : "Vínculo creado exitosamente.",
        errorCode: null
      });

    } catch (error) {
      console.error(error);
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Hubo un error al procesar la solicitud.",
        errorCode: null
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLink = async (guardianId: number, studentId: number, guardianName: string, studentName: string) => {
    if (confirm(`¿Estás seguro de eliminar el vínculo entre ${guardianName} y ${studentName}?`)) {
      try {
        const response = await fetch(`${apiUrl}/family-links/${guardianId}/${studentId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.ok) {
          // 1. En lugar de filtrarlo localmente, volvemos a consultar al backend
          await fetchData();
          
          // 2. Mostramos el Modal de éxito
          setModalConfig({
            isOpen: true,
            type: "success",
            title: "¡Eliminado!",
            message: "El vínculo familiar ha sido eliminado correctamente.",
            errorCode: null
          });
        } else {
          throw new Error("No se pudo eliminar el vínculo");
        }
      } catch (error) {
        console.error(error);
        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Error al intentar eliminar el vínculo.",
          errorCode: null
        });
      }
    }
  };

  // --- FILTRO DE BÚSQUEDA ---
  const filteredLinks = links.filter(link => 
    link.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- CLASES ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const searchInputClass = "w-full md:w-72 bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1.5 pl-8 font-medium transition-all placeholder:text-blue-900/40 text-sm";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Vínculos Familiares</h2>
        <p className="text-blue-900/70 font-medium">
          Asocie a los estudiantes con sus respectivos acudientes legales para el control de comunicaciones y reportes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- CAJA 1: FORMULARIO --- */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className={bentoCardClass}>
            <div className="flex justify-between items-center mb-2">
              <h3 className={bentoTitleClass}>
                <Link2 className="w-5 h-5"/> {isEditing ? "Editar Enlace" : "Crear Enlace"}
              </h3>
              {isEditing && (
                <button type="button" onClick={handleCancelEdit} className="text-red-500 hover:bg-red-100 p-1 rounded-md transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-5 mt-2">
              <div>
                <label className={labelClass}><Shield className="w-3 h-3 inline pb-0.5"/> Acudiente (Familiar):</label>
                <select name="guardianId" className={selectClass} value={formData.guardianId} onChange={handleChange} required disabled={isEditing}>
                  <option value="" className="bg-white text-gray-400">Seleccione un acudiente...</option>
                  {guardians.map(g => <option key={g.id} value={g.id} className="bg-white">{g.name} - {g.identification}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}><GraduationCap className="w-3 h-3 inline pb-0.5"/> Estudiante:</label>
                <select name="studentId" className={selectClass} value={formData.studentId} onChange={handleChange} required disabled={isEditing}>
                  <option value="" className="bg-white text-gray-400">Seleccione un estudiante...</option>
                  {students.map(s => <option key={s.id} value={s.id} className="bg-white">{s.name} - {s.identification}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Parentesco:</label>
                <select name="relationship" className={selectClass} value={formData.relationship} onChange={handleChange} required>
                  <option value="" className="bg-white text-gray-400">¿Qué es del estudiante?</option>
                  <option value="Padre" className="bg-white">Padre</option>
                  <option value="Madre" className="bg-white">Madre</option>
                  <option value="Abuelo" className="bg-white">Abuelo</option>
                  <option value="Abuela" className="bg-white">Abuela</option>
                  <option value="Tio" className="bg-white">Tío</option>
                  <option value="Tia" className="bg-white">Tía</option>
                  <option value="Hermano" className="bg-white">Hermano</option>
                  <option value="Hermana" className="bg-white">Hermana</option>
                  <option value="Padrastro" className="bg-white">Padrastro</option>
                  <option value="Madrastra" className="bg-white">Madrastra</option>
                  <option value="Acudiente" className="bg-white">Acudiente Legal (Otro)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSaving}
              className={`mt-4 flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-900 text-blue-950 font-black rounded-xl transition-all uppercase tracking-widest ${
                isSaving 
                  ? "opacity-50 cursor-not-allowed bg-blue-900/10" 
                  : "hover:bg-blue-900 hover:text-white shadow-[3px_3px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5"
              }`}
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Guardando..." : (isEditing ? "Actualizar" : "Vincular")}
            </button>
          </form>
        </div>

        {/* --- CAJA 2: TABLA DE VÍNCULOS EXISTENTES --- */}
        <div className="lg:col-span-2">
          <div className={`${bentoCardClass} h-full`}>
            
            {/* CABECERA CON EL BUSCADOR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2 gap-4">
              <h3 className={bentoTitleClass}><Users className="w-5 h-5"/> Familiares Asignados</h3>
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2 top-2 h-4 w-4 text-blue-900/50" />
                <input
                  type="text"
                  placeholder="Buscar familiar o estudiante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={searchInputClass}
                />
              </div>
            </div>
            
            <div className="overflow-x-auto mt-2">
              {isLoading ? (
                <div className="py-10 text-center font-bold text-blue-900/50 animate-pulse">
                  Cargando vínculos...
                </div>
              ) : filteredLinks.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-blue-900/50">
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Acudiente</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Parentesco</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Estudiante</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLinks.map((link) => (
                      <tr key={`${link.guardianId}-${link.studentId}`} className="border-b border-blue-900/10 hover:bg-blue-900/5 transition-colors">
                        <td className="py-3 px-2 font-bold">{link.guardianName}</td>
                        <td className="py-3 px-2">
                          <span className="bg-blue-900/10 text-blue-900 font-bold px-2 py-1 rounded-md text-xs">
                            {link.relationship}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-medium text-blue-900/80">{link.studentName}</td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => handleEdit(link)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors inline-flex"
                              title="Editar vínculo"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteLink(link.guardianId, link.studentId, link.guardianName, link.studentName)}
                              className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors inline-flex"
                              title="Eliminar vínculo"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-10 flex flex-col items-center justify-center text-blue-900/40">
                  <Link2 className="w-12 h-12 mb-3 opacity-50" />
                  <p className="font-bold">No se encontraron vínculos.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* RENDERIZADO DEL MODAL */}
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

export default FamilyLinksManager;