import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link2, Trash2, Users, Shield, GraduationCap, Save } from "lucide-react";

// --- INTERFACES ---
interface FamilyLink {
  id: string; // ID simulado para el frontend (en BD es una llave compuesta)
  guardianId: string;
  guardianName: string;
  studentId: string;
  studentName: string;
  relationship: string;
}

// --- DATOS SIMULADOS ---
const mockGuardians = [
  { id: "G1", name: "Carlos Eduardo Gómez (CC: 100222333)" },
  { id: "G2", name: "Martha Lucía Silva (CC: 444555666)" }
];

const mockStudents = [
  { id: "S1", name: "Camilo Andrés Gómez (TI: 999888777)" },
  { id: "S2", name: "Ana Silva (TI: 111222333)" }
];

const initialLinks: FamilyLink[] = [
  { id: "1", guardianId: "G1", guardianName: "Carlos Eduardo Gómez", studentId: "S1", studentName: "Camilo Andrés Gómez", relationship: "Padre" },
];

const FamilyLinksManager = () => {
  const [links, setLinks] = useState<FamilyLink[]>(initialLinks);
  const [isSaving, setIsSaving] = useState(false);

  // --- ESTADO DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    guardianId: "",
    studentId: "",
    relationship: ""
  });

  // --- MANEJADORES ---
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateLink = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const guardian = mockGuardians.find(g => g.id === formData.guardianId);
    const student = mockStudents.find(s => s.id === formData.studentId);

    if (!guardian || !student) return;

    const payload = {
      guardian_id: formData.guardianId,
      student_id: formData.studentId,
      relationship: formData.relationship
    };

    console.log("Creando vínculo familiar en BD:", payload);

    // Simulación de guardado
    setTimeout(() => {
      const newLink: FamilyLink = {
        id: Date.now().toString(),
        guardianId: formData.guardianId,
        guardianName: guardian.name.split(" (")[0],
        studentId: formData.studentId,
        studentName: student.name.split(" (")[0],
        relationship: formData.relationship
      };

      setLinks([newLink, ...links]);
      setFormData({ guardianId: "", studentId: "", relationship: "" });
      setIsSaving(false);
      alert("¡Vínculo familiar creado exitosamente!");
    }, 800);
  };

  const handleDeleteLink = (id: string, guardianName: string, studentName: string) => {
    if (confirm(`¿Estás seguro de eliminar el vínculo entre ${guardianName} y ${studentName}?`)) {
      console.log("Eliminando vínculo con ID frontend:", id);
      setLinks(links.filter(link => link.id !== id));
    }
  };

  // --- CLASES ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";

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

        {/* --- CAJA 1: FORMULARIO DE CREACIÓN (Columna Izquierda) --- */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCreateLink} className={bentoCardClass}>
            <h3 className={bentoTitleClass}><Link2 className="w-5 h-5"/> Crear Enlace</h3>
            
            <div className="flex flex-col gap-5 mt-2">
              <div>
                <label className={labelClass}><Shield className="w-3 h-3 inline pb-0.5"/> Acudiente (Familiar):</label>
                <select name="guardianId" className={selectClass} value={formData.guardianId} onChange={handleChange} required>
                  <option value="" className="bg-white text-gray-400">Seleccione un acudiente...</option>
                  {mockGuardians.map(g => <option key={g.id} value={g.id} className="bg-white">{g.name}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}><GraduationCap className="w-3 h-3 inline pb-0.5"/> Estudiante:</label>
                <select name="studentId" className={selectClass} value={formData.studentId} onChange={handleChange} required>
                  <option value="" className="bg-white text-gray-400">Seleccione un estudiante...</option>
                  {mockStudents.map(s => <option key={s.id} value={s.id} className="bg-white">{s.name}</option>)}
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
              {isSaving ? "Enlazando..." : "Vincular"}
            </button>
          </form>
        </div>

        {/* --- CAJA 2: TABLA DE VÍNCULOS EXISTENTES (Columna Derecha) --- */}
        <div className="lg:col-span-2">
          <div className={`${bentoCardClass} h-full`}>
            <h3 className={bentoTitleClass}><Users className="w-5 h-5"/> Familiares Asignados</h3>
            
            <div className="overflow-x-auto mt-2">
              {links.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-blue-900/50">
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Acudiente</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Parentesco</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Estudiante</th>
                      <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-right">Desvincular</th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.map((link) => (
                      <tr key={link.id} className="border-b border-blue-900/10 hover:bg-blue-900/5 transition-colors">
                        <td className="py-3 px-2 font-bold">{link.guardianName}</td>
                        <td className="py-3 px-2">
                          <span className="bg-blue-900/10 text-blue-900 font-bold px-2 py-1 rounded-md text-xs">
                            {link.relationship}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-medium text-blue-900/80">{link.studentName}</td>
                        <td className="py-3 px-2 text-right">
                          <button 
                            onClick={() => handleDeleteLink(link.id, link.guardianName, link.studentName)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors inline-flex"
                            title="Eliminar vínculo"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-10 flex flex-col items-center justify-center text-blue-900/40">
                  <Link2 className="w-12 h-12 mb-3 opacity-50" />
                  <p className="font-bold">No hay vínculos registrados en el sistema.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FamilyLinksManager;