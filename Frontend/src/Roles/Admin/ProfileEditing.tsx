import { useState, type ChangeEvent, type FormEvent } from "react";
import { Search, Edit2, ArrowLeft, Save, UserX } from "lucide-react";

// --- INTERFACES ---
interface UserSearchResult {
  id: string;
  fullName: string;
  role: string;
  identification: string;
  status: string;
}

interface FormData {
  user: {
    firstName: string;
    lastName: string;
    birthday: string;
    username: string;
    status: string;
  };
  roles: {
    name: string;
  };
  contact_info: {
    documentType: string;
    identification: string;
    email: string;
    phone_number: string;
    city: string;
    address: string;
  };
}

// --- DATOS DE PRUEBA (Simulando la respuesta de tu BD) ---
const mockUsers: UserSearchResult[] = [
  { id: "1001", fullName: "Diego Fernando Rojas", role: "Rector", identification: "1000222333", status: "ACTIVO" },
  { id: "1002", fullName: "Ana María Gómez", role: "Coordinador", identification: "4555666", status: "ACTIVO" },
  { id: "1003", fullName: "Carlos Pérez", role: "Personal docente", identification: "7888999", status: "INACTIVO" },
  { id: "1004", fullName: "María Silva", role: "Estudiante", identification: "11222333", status: "ACTIVO" },
  { id: "1005", fullName: "Luisa Fernanda", role: "Psícologo", identification: "99887766", status: "ACTIVO" },
];

const ProfileEditing = () => {
  // --- ESTADOS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editingUser, setEditingUser] = useState<UserSearchResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    user: { firstName: '', lastName: '', birthday: '', username: '', status: '' },
    roles: { name: '' },
    contact_info: { documentType: '', identification: '', email: '', phone_number: '', city: '', address: '' },
  });

  // --- LÓGICA DE FILTRADO ---
  const filteredUsers = mockUsers.filter(user => {
    const matchesName = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.identification.includes(searchTerm);
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    return matchesName && matchesRole;
  });

  // --- MANEJADORES ---
  const handleEditClick = (user: UserSearchResult) => {
    // Aquí idealmente harías un fetch(`.../users/${user.id}`) para traer todos sus datos.
    // Por ahora, simulamos pre-llenar el formulario con datos básicos.
    const [firstName, ...lastNameArr] = user.fullName.split(" ");
    
    setFormData({
      user: { 
        firstName: firstName || "", 
        lastName: lastNameArr.join(" ") || "", 
        birthday: "1990-01-01", // Simulado
        username: `${firstName.charAt(0)}${lastNameArr[0]}`.toLowerCase(), 
        status: user.status 
      },
      roles: { name: user.role },
      contact_info: { 
        documentType: "CC", 
        identification: user.identification, 
        email: "correo@ejemplo.com", 
        phone_number: "3000000000", 
        city: "Bogotá", 
        address: "Calle Falsa 123" 
      },
    });
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".") as [keyof FormData, string];

    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulación de guardado en API
    setTimeout(() => {
      alert("Usuario actualizado correctamente.");
      setIsSaving(false);
      setEditingUser(null);
    }, 1000);
  };

  // --- CLASES ESTILO CUADERNO (Tinta y Bento) ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-2 relative overflow-hidden transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-block border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest mt-2";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 placeholder:text-blue-900/40 font-medium transition-all";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4">
      
      {/* CABECERA (Cambia dinámicamente si estamos editando) */}
      <div className="mb-2 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-blue-950 mb-2">
            {editingUser ? "Edición de Perfil" : "Directorio de Usuarios"}
          </h2>
          <p className="text-blue-900/70 font-medium">
            {editingUser ? `Modificando la información de ${editingUser.fullName}.` : "Busca y selecciona un usuario para actualizar su información."}
          </p>
        </div>
        
        {editingUser && (
          <button 
            onClick={handleCancelEdit}
            className="flex items-center gap-2 text-blue-900 font-bold hover:bg-blue-900/10 px-4 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Volver
          </button>
        )}
      </div>

      {/* --- VISTA 1: TABLA DE BÚSQUEDA --- */}
      {!editingUser && (
        <div className={bentoCardClass}>
          
          {/* Controles de Filtro */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 border-b-2 border-blue-900/20 pb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-0 top-1.5 w-5 h-5 text-blue-900/50" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o identificación..." 
                className={`${inputClass} pl-8`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/3">
              <select 
                className={selectClass} 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="" className="bg-white">Todos los roles</option>
                <option value="Rector" className="bg-white">Rector</option>
                <option value="Coordinador" className="bg-white">Coordinador</option>
                <option value="Personal docente" className="bg-white">Personal docente</option>
                <option value="Estudiante" className="bg-white">Estudiante</option>
                <option value="Psícologo" className="bg-white">Psícologo</option>
              </select>
            </div>
          </div>

          {/* Tabla de Resultados */}
          <div className="overflow-x-auto">
            {filteredUsers.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-blue-900/50">
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Identificación</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Nombre Completo</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Rol</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-center">Estado</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-blue-900/10 hover:bg-blue-900/5 transition-colors group">
                      <td className="py-3 px-2 font-medium">{u.identification}</td>
                      <td className="py-3 px-2 font-bold">{u.fullName}</td>
                      <td className="py-3 px-2 text-blue-900/80">{u.role}</td>
                      <td className="py-3 px-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          u.status === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button 
                          onClick={() => handleEditClick(u)}
                          className="p-2 text-blue-900 hover:bg-blue-900/20 rounded-lg transition-colors inline-flex"
                          title="Editar Perfil"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-10 flex flex-col items-center justify-center text-blue-900/50">
                <UserX className="w-12 h-12 mb-3 opacity-50" />
                <p className="font-bold">No se encontraron usuarios con esos filtros.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- VISTA 2: FORMULARIO DE EDICIÓN --- */}
      {editingUser && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* CAJA 1: Datos Personales */}
            <div className={bentoCardClass}>
              <h3 className={bentoTitleClass}>Datos Personales</h3>
              
              <label className={labelClass}>Nombres:</label>
              <input type="text" name="user.firstName" className={inputClass} value={formData.user.firstName} onChange={handleChange} required />
              
              <label className={labelClass}>Apellidos:</label>
              <input type="text" name="user.lastName" className={inputClass} value={formData.user.lastName} onChange={handleChange} required />
              
              <label className={labelClass}>Fecha de nacimiento:</label>
              <input type="date" name="user.birthday" className={inputClass} value={formData.user.birthday} onChange={handleChange} />
            </div>

            {/* CAJA 2: Credenciales y Rol */}
            <div className={bentoCardClass}>
              <h3 className={bentoTitleClass}>Perfil del Sistema</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>UserName:</label>
                  <input type="text" name="user.username" className={inputClass} value={formData.user.username} onChange={handleChange} required />
                </div>
                <div>
                  <label className={labelClass}>Rol:</label>
                  <select name="roles.name" className={selectClass} value={formData.roles.name} onChange={handleChange} required>
                    <option value="Rector" className="bg-white">Rector</option>
                    <option value="Coordinador" className="bg-white">Coordinador</option>
                    <option value="Personal docente" className="bg-white">Personal docente</option>
                    <option value="Estudiante" className="bg-white">Estudiante</option>
                    <option value="Psícologo" className="bg-white">Psícologo</option>
                  </select>
                </div>
              </div>

              <div className="mt-2">
                <label className={labelClass}>Estado del Usuario:</label>
                <select name="user.status" className={selectClass} value={formData.user.status} onChange={handleChange} required>
                  <option value="ACTIVO" className="bg-white text-green-700 font-bold">ACTIVO</option>
                  <option value="INACTIVO" className="bg-white text-gray-600 font-bold">INACTIVO</option>
                  <option value="SUSPENDIDO" className="bg-white text-orange-600 font-bold">SUSPENDIDO</option>
                  <option value="GRADUADO" className="bg-white text-blue-600 font-bold">GRADUADO</option>
                </select>
              </div>
            </div>

            {/* CAJA 3: Contacto (Ocupa las dos columnas) */}
            <div className={`${bentoCardClass} lg:col-span-2`}>
              <h3 className={bentoTitleClass}>Información de Contacto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
                <div>
                  <label className={labelClass}>Tipo Doc.:</label>
                  <select name="contact_info.documentType" className={selectClass} value={formData.contact_info.documentType} onChange={handleChange}>
                    <option value="CC" className="bg-white">Cédula de Ciudadanía (CC)</option>
                    <option value="TI" className="bg-white">Tarjeta de Identidad (TI)</option>
                    <option value="CE" className="bg-white">Cédula de Extranjería (CE)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>No. Identificación:</label>
                  <input type="text" name="contact_info.identification" className={inputClass} value={formData.contact_info.identification} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelClass}>Email:</label>
                  <input type="email" name="contact_info.email" className={inputClass} value={formData.contact_info.email} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelClass}>Teléfono:</label>
                  <input type="text" name="contact_info.phone_number" className={inputClass} value={formData.contact_info.phone_number} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelClass}>Ciudad:</label>
                  <input type="text" name="contact_info.city" className={inputClass} value={formData.contact_info.city} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelClass}>Dirección:</label>
                  <input type="text" name="contact_info.address" className={inputClass} value={formData.contact_info.address} onChange={handleChange} />
                </div>
              </div>
            </div>

          </div>

          {/* BOTÓN GUARDAR ("SELLO") */}
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
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};

export default ProfileEditing;