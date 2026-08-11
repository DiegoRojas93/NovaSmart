import { useState, useEffect, useRef, type ChangeEvent, type SubmitEvent } from "react";
import { Users, Plus, Edit2, Search, CheckCircle2, AlertCircle, X, Save } from "lucide-react";
import { ModalComponent } from "@/shared/Basics/ModalComponent";

interface Props {
  institutionId: number;
}

// --- INTERFAZ PARA LA TABLA (Resumen) ---
export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  identification: string;
  roleName: string;
  status: string;
}

// --- INTERFAZ PARA EL FORMULARIO (Detalle Completo) ---
interface FormData {
  institutionId: number | null;
  user: {
    firstName: string;
    lastName: string;
    birthday: string;
    username: string;
    password: string;
    admin: boolean;
    status: string;
  };
  roles: {
    name: string;
  };
  contact_info: {
    documentType: string;
    identification: string;
    email: string;
    phoneNumber: string;
    city: string;
    address: string;
  };
  emergency_contacts: {
    firstName: string;
    lastName: string;
    relationship: string;
    email: string;
    phoneNumber: string;
    city: string;
    address: string;
  };
  profession: string | null;
}

// const defaultFormData: FormData = {
//   user: { firstName: '', lastName: '', birthday: '', username: '', password: '', is_admin: false, status: '' },
//   roles: { name: '' },
//   contact_info: { documentType: '', identification: '', email: '', phone_number: '', city: '', address: '' },
//   emergency_contacts: { firstName: '', lastName: '', relationship: '', email: '', phone_number: '', city: '', address: '' }
// };
const defaultFormData: FormData = {
  institutionId: null,
  user: {
    firstName: '',
    lastName: '',
    birthday: '',
    username: '',
    password: '',
    admin: false,
    status: '',
  },
  roles: {
    name: '',
  },
  contact_info: {
    documentType: '',
    identification: '',
    email: '',
    phoneNumber: '',
    city: '',
    address: '',
  },
  emergency_contacts: {
    firstName: '',
    lastName: '',
    relationship: '',
    email: '',
    phoneNumber: '',
    city: '',
    address: '',
  },
  profession: ''
};

const PersonnelManager = ( { institutionId }:Props ) => {

  // --- ESTADOS DE LA TABLA ---
  const [personnel, setPersonnel] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- ESTADOS DEL FORMULARIO ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // --- SHOW PROFESSION ITEM ---

  const showProfession = formData.roles.name === "Personal docente" || formData.roles.name === "Acudiente";

  // --- ESTADOS PARA EL MODAL REUTILIZABLE ---
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
    errorCode: null as number | null
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  // --- 1. CARGAR LISTADO DE PERSONAL (GET) ---
  // const fetchPersonnel = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(`${apiUrl}/personnel`, {
  //       headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setPersonnel(data);
  //     }
  //   } catch (error) {
  //     console.error("Error al cargar el personal:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchPersonnel = async () => {
    setIsLoading(true);
    try {

      console.warn(`${apiUrl}/users/register/all/${institutionId}`)
      // ACTUALIZADO: Apunta a la nueva ruta del controlador
      const response = await fetch(`${apiUrl}/users/register/all/${institutionId}`, { 
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPersonnel(data);
      }
    } catch (error) {
      console.error("Error al cargar el personal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  // --- 2. MANEJO DE VISTAS (Abrir/Cerrar Formulario) ---
  const handleOpenCreate = () => {
    setEditingUserId(null);
    setFormData(defaultFormData);
    setIsFormOpen(true);
  };

  // const handleOpenEdit = async (userId: number) => {
  //   // 1. Aquí harías un fetch `GET /users/register/${userId}` para traer los datos completos
  //   // 2. Llenarías `formData` con la respuesta
  //   alert(`Aquí cargaremos los datos del usuario ID: ${userId} antes de abrir el form`);
    
  //   // Por ahora solo abrimos el form
  //   setEditingUserId(userId);
  //   setIsFormOpen(true);
  // };

  const handleOpenEdit = async (userId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/users/register/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Manejo de la fecha: Asegurar formato YYYY-MM-DD para el input type="date"
        let formattedDate = "";
        if (data.user.birthday) {
           // Si viene como array de Spring [YYYY, MM, DD] o string ISO, extraemos solo la fecha
           formattedDate = new Date(
              Array.isArray(data.user.birthday) 
                ? data.user.birthday.join('-') 
                : data.user.birthday
           ).toISOString().split('T')[0];
        }

        setFormData({
          institutionId: data.institutionId || institutionId,
          user: {
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            birthday: formattedDate,
            username: data.user.username || '',
            password: '', // Dejamos en blanco. El input es opcional al editar.
            admin: data.user.admin || false,
            status: data.user.status || ''
          },
          roles: {
            name: data.roles.name || ''
          },
          contact_info: {
            documentType: data.contact_info.documentType || '',
            identification: data.contact_info.identification || '',
            email: data.contact_info.email || '',
            phoneNumber: data.contact_info.phoneNumber || '',
            city: data.contact_info.city || '',
            address: data.contact_info.address || ''
          },
          emergency_contacts: {
            firstName: data.emergency_contacts.firstName || '',
            lastName: data.emergency_contacts.lastName || '',
            relationship: data.emergency_contacts.relationship || '',
            email: data.emergency_contacts.email || '',
            phoneNumber: data.emergency_contacts.phoneNumber || '',
            city: data.emergency_contacts.city || '',
            address: data.emergency_contacts.address || ''
          },
          profession: data.profession || null
        });

        setEditingUserId(userId);
        setIsFormOpen(true);
      } else {
        throw new Error("No se pudo cargar la información del usuario.");
      }
    } catch (error) {
      console.error(error);
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Ocurrió un problema al cargar los datos del usuario.",
        errorCode: null
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUserId(null);
  };

  // --- 3. MANEJADORES DE INPUTS DEL FORMULARIO ---
  const handleChange = ( e: ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
    const { name, value } = e.target;

    if (name === "roles.name") {
      setFormData(prev => ({
        ...prev,
        roles: {
          ...prev.roles,
          name: value
        },
        profession:
          value === "Personal docente" || value === "Acudiente"
            ? prev.profession
            : null
      }));

      return;
    }

    type ParentKey =
      | "user"
      | "roles"
      | "contact_info"
      | "emergency_contacts";

    const [parent, child] = name.split(".") as [ParentKey, string];

    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files?.length) return;
    if (name === 'photo') setPhotoFile(files[0]);
  };

  // --- 4. GUARDAR O ACTUALIZAR (POST / PUT) ---
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSend = new FormData();

      formData.institutionId = institutionId;

      console.log(formData)

      dataToSend.append("data", new Blob([JSON.stringify(formData)], { type: "application/json" }));

      if (photoFile) dataToSend.append("photo", photoFile);

      const method = editingUserId ? 'PUT' : 'POST';
      const url = editingUserId 
        ? `${apiUrl}/users/register/${editingUserId}` 
        : `${apiUrl}/users/register`;

      const response = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
        body: dataToSend
      });

      if (!response.ok) {
        const error = new Error('Error al procesar el usuario');
        (error as any).status = response.status;
        throw error;
      }

      // Si todo sale bien
      await fetchPersonnel(); // Recargamos la tabla
      handleCloseForm();      // Cerramos el form
      setPhotoFile(null);
      if (photoInputRef.current) photoInputRef.current.value = "";

      setModalConfig({
        isOpen: true,
        type: "success",
        title: "¡Éxito!",
        message: editingUserId ? "Usuario actualizado correctamente." : "Usuario registrado correctamente.",
        errorCode: null
      });

    } catch (error: any) {
      console.error(error);
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Algo salió mal",
        message: "No se pudo procesar la información del usuario.",
        errorCode: error.status || null
      });
    } finally {
      setIsSaving(false);
    }
  };

  // --- FILTRO DE BÚSQUEDA ---
  const filteredPersonnel = personnel.filter(person => 
    person.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.identification.includes(searchTerm) ||
    person.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-2 relative overflow-hidden transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-block border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest mt-2";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 placeholder:text-blue-900/40 font-medium transition-all";
  const searchInputClass = "w-full md:max-w-xs bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-2 pl-8 font-medium transition-all placeholder:text-blue-900/40";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA DINÁMICA */}
      <div className="mb-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-blue-950 mb-2">
            {isFormOpen ? (editingUserId ? "Editar Usuario" : "Nuevo Registro") : "Gestión de Personal"}
          </h2>
          <p className="text-blue-900/70 font-medium">
            {isFormOpen 
              ? "Complete la información personal, credenciales y contacto." 
              : "Administre docentes, coordinadores, acudientes y estudiantes."}
          </p>
        </div>
        
        {!isFormOpen ? (
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-blue-900 text-white font-bold hover:bg-blue-800 px-5 py-2.5 rounded-xl transition-all shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
          >
            <Plus className="w-5 h-5" /> Nuevo Registro
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

      {/* VISTA 1: TABLA DE PERSONAL */}
      {!isFormOpen && (
        <>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-900/50" />
            <input
              type="text"
              placeholder="Buscar por nombre, documento o rol..."
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
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Nombre Completo</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Identificación</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs">Rol</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-center">Estado</th>
                    <th className="py-3 px-2 font-black text-blue-950 uppercase tracking-widest text-xs text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 font-bold text-blue-900/50 animate-pulse">
                        Cargando listado de personal...
                      </td>
                    </tr>
                  ) : filteredPersonnel.length > 0 ? (
                    filteredPersonnel.map((user) => (
                      <tr key={user.id} className="border-b border-blue-900/10 hover:bg-blue-900/5 transition-colors">
                        <td className="py-4 px-2 font-bold flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-900/60" /> 
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="py-4 px-2 font-medium text-blue-900/80">{user.identification}</td>
                        <td className="py-4 px-2 font-medium">
                          <span className="bg-blue-900/10 text-blue-900 px-2 py-1 rounded-md text-xs font-bold uppercase">
                            {user.roleName}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          {user.status === "ACTIVO" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-[10px] font-black uppercase tracking-wider rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider rounded-full">
                              <AlertCircle className="w-3 h-3" /> {user.status}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button 
                            onClick={() => handleOpenEdit(user.id)}
                            className="p-2 text-blue-900 hover:bg-blue-900/20 rounded-lg transition-colors inline-flex"
                            title="Editar Usuario"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-10 font-medium text-blue-900/50">
                        No se encontró personal registrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* VISTA 2: EL FORMULARIO (Misma maquetación que ya tenías) */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* DATOS PERSONALES */}
            <div className={bentoCardClass}>
              <h2 className={bentoTitleClass}>Datos Personales</h2>
              <label htmlFor="firstName" className={labelClass}>Nombre:</label>
              <input type="text" id="firstName" name="user.firstName" placeholder="Ej: Diego Fernando" className={inputClass} value={formData.user.firstName} onChange={handleChange} required />
              
              <label htmlFor="lastName" className={labelClass}>Apellido:</label>
              <input type="text" id="lastName" name="user.lastName" placeholder="Ej: Rojas Quintero" className={inputClass} value={formData.user.lastName} onChange={handleChange} required />
              
              <label htmlFor="birthday" className={labelClass}>Fecha de nacimiento:</label>
              <input type="date" id="birthday" name="user.birthday" className={inputClass} value={formData.user.birthday} onChange={handleChange} required />
            </div>

            {/* CREDENCIALES DE CUENTA */}
            <div className={bentoCardClass}>
              <h2 className={bentoTitleClass}>Perfil del Sistema</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username" className={labelClass}>UserName:</label>
                  <input type="text" id="username" name="user.username" placeholder="Ej: DRojas" className={inputClass} value={formData.user.username} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="password" className={labelClass}>Contraseña:</label>
                  <input type="password" id="password" name="user.password" placeholder={editingUserId ? "(Sin cambios)" : "****"} className={inputClass} value={formData.user.password} onChange={handleChange} required={!editingUserId} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user_status" className={labelClass}>Estado:</label>
                  <select id="user_status" name="user.status" className={selectClass} value={formData.user.status} onChange={handleChange} required>
                    <option value="" className="bg-white">Seleccione</option>
                    <option value="ACTIVO" className="bg-white">Activo</option>
                    <option value="INACTIVO" className="bg-white">Inactivo</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="name" className={labelClass}>Rol:</label>
                  <select id="name" name="roles.name" className={selectClass} value={formData.roles.name} onChange={handleChange} required>
                    <option value="" className="bg-white">Seleccione</option>
                    <option value="Rector" className="bg-white">Rector</option>
                    <option value="Coordinador" className="bg-white">Coordinador</option>
                    <option value="Personal docente" className="bg-white">Personal docente</option>
                    <option value="Estudiante" className="bg-white">Estudiante</option>
                    <option value="Acudiente" className="bg-white">Acudiente</option>
                  </select>
                </div>
                {showProfession && (
                  <div className="col-span-2">
                    <label htmlFor="profession" className={labelClass}>
                      Profesión:
                    </label>

                    <input
                      type="text"
                      id="profession"
                      name="profession"
                      placeholder="Ej: Licenciado en Matemáticas"
                      className={inputClass}
                      value={formData.profession ?? ""}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          profession: e.target.value
                        }))
                      }
                      required
                    />
                  </div>
                )}
              </div>


              <label htmlFor="photo" className={labelClass}>Foto del usuario:</label>
              <input type="file" id="photo" name="photo" accept="image/*" className={`${inputClass} text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-900/10 file:text-blue-900 hover:file:bg-blue-900/20`} ref={photoInputRef} onChange={handleFileChange} />
            </div>

            {/* INFORMACIÓN DE CONTACTO */}
            <div className={`${bentoCardClass} lg:col-span-2`}>
              <h2 className={bentoTitleClass}>Información de Contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-2">
                <div>
                  <label htmlFor="documentType" className={labelClass}>Tipo de documento:</label>
                  <select id="documentType" name="contact_info.documentType" className={selectClass} value={formData.contact_info.documentType} onChange={handleChange} required>
                    <option value="" className="bg-white">Seleccione</option>
                    <option value="CC" className="bg-white">Cédula de Ciudadanía</option>
                    <option value="TI" className="bg-white">Tarjeta de Identidad</option>
                    <option value="NIT" className="bg-white">NIT</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="identification" className={labelClass}>No. Identificación:</label>
                  <input type="text" id="identification" name="contact_info.identification" placeholder="Ej: 1000222333" className={inputClass} value={formData.contact_info.identification} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email:</label>
                  <input type="email" id="email" name="contact_info.email" placeholder="correo@ejemplo.com" className={inputClass} value={formData.contact_info.email} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="phone_number" className={labelClass}>Teléfono:</label>
                  <input type="text" id="phone_number" name="contact_info.phoneNumber" placeholder="Ej: 555-555-5555" className={inputClass} value={formData.contact_info.phoneNumber} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="city" className={labelClass}>Ciudad:</label>
                  <input type="text" id="city" name="contact_info.city" placeholder="Ej: Bogotá" className={inputClass} value={formData.contact_info.city} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="address" className={labelClass}>Dirección:</label>
                  <input type="text" id="address" name="contact_info.address" placeholder="Ej: Calle 4 Biss # 10-12" className={inputClass} value={formData.contact_info.address} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* CONTACTO DE EMERGENCIA */}
            <div className={`${bentoCardClass} lg:col-span-2`}>
              <h2 className={bentoTitleClass}>Contacto de Emergencia</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-2">
                <div>
                  <label htmlFor="em_firstName" className={labelClass}>Nombre:</label>
                  <input type="text" id="em_firstName" name="emergency_contacts.firstName" placeholder="Nombre" className={inputClass} value={formData.emergency_contacts.firstName} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="em_lastName" className={labelClass}>Apellido:</label>
                  <input type="text" id="em_lastName" name="emergency_contacts.lastName" placeholder="Apellido" className={inputClass} value={formData.emergency_contacts.lastName} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="relationship" className={labelClass}>Relación:</label>
                  <select id="relationship" name="emergency_contacts.relationship" className={selectClass} value={formData.emergency_contacts.relationship} onChange={handleChange}>
                    <option value="" className="bg-white">Seleccione</option>
                    <option value="Padre" className="bg-white">Padre / Madre</option>
                    <option value="Abuelo" className="bg-white">Abuelo(a)</option>
                    <option value="Tio" className="bg-white">Tío(a)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="em_email" className={labelClass}>Email:</label>
                  <input type="email" id="em_email" name="emergency_contacts.email" placeholder="correo@ejemplo.com" className={inputClass} value={formData.emergency_contacts.email} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="em_phone_number" className={labelClass}>Teléfono:</label>
                  <input type="text" id="em_phone_number" name="emergency_contacts.phoneNumber" placeholder="Ej: 555-555-5555" className={inputClass} value={formData.emergency_contacts.phoneNumber} onChange={handleChange} />
                </div>
                <div className="flex gap-4">
                   <div className="w-1/2">
                    <label htmlFor="em_city" className={labelClass}>Ciudad:</label>
                    <input type="text" id="em_city" name="emergency_contacts.city" placeholder="Ciudad" className={inputClass} value={formData.emergency_contacts.city} onChange={handleChange} />
                   </div>
                   <div className="w-1/2">
                    <label htmlFor="em_address" className={labelClass}>Dirección:</label>
                    <input type="text" id="em_address" name="emergency_contacts.address" placeholder="Dirección" className={inputClass} value={formData.emergency_contacts.address} onChange={handleChange} />
                   </div>
                </div>
              </div>
            </div>

          </div>

          {/* BOTÓN DE GUARDAR */}
          <div className="mt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className={`flex items-center gap-3 px-8 py-3 border-4 border-blue-900 text-blue-950 font-black text-xl rounded-2xl uppercase tracking-widest transition-all ${
                isSaving 
                  ? "opacity-50 cursor-not-allowed bg-blue-900/10" 
                  : "hover:bg-blue-900 hover:text-white shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
              }`}
            >
              <Save className="w-6 h-6" />
              {isSaving ? "Guardando..." : (editingUserId ? "Guardar Cambios" : "Registrar Usuario")}
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

export default PersonnelManager;