import { useRef, useState, type ChangeEvent, type SubmitEvent } from "react";

interface FormData {
  user: {
    firstName: string;
    lastName: string;
    birthday: string;
    username: string;
    password: string;
    is_admin: boolean;
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
  emergency_contacts: {
    firstName: string;
    lastName: string;
    relationship: string;
    email: string;
    phone_number: string;
    city: string;
    address: string;
  }
}

const FormInscription = () => {

  const [formData, setFormData] = useState<FormData>({
    user: { firstName: '', lastName: '', birthday: '', username: '', password: '', is_admin: true, status: '' },
    roles: { name: '' },
    contact_info: { documentType: '', identification: '', email: '', phone_number: '', city: '', address: '' },
    emergency_contacts: { firstName: '', lastName: '', relationship: '', email: '', phone_number: '', city: '', address: '' }
  });

  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    type ParentKey = "user" | "roles" | "contact_info" | "emergency_contacts";
    const [parent, child] = name.split(".") as [ParentKey, string];

    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  };

  const selectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    type ParentKey = "user" | "roles" | "contact_info" | "emergency_contacts";
    const [parent, child] = name.split(".") as [ParentKey, string];

    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  };

  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files?.length) return;
    if (name === 'photo') setPhotoFile(files[0]);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const dataToSend = new FormData();
      
      dataToSend.append("data", new Blob([JSON.stringify(formData)], { type: "application/json" }));
      if (photoFile) dataToSend.append("photo", photoFile);

      const response = await fetch(`${apiUrl}/institutions/inscription`, {
        method: 'POST',
        body: dataToSend
      });

      if (!response.ok) throw new Error('Error al crear institución');
      const data = await response.json();

      setFormData({
        user: { firstName: '', lastName: '', birthday: '', username: '', password: '', is_admin: true, status: '' },
        roles: { name: '' },
        contact_info: { documentType: '', identification: '', email: '', phone_number: '', city: '', address: '' },
        emergency_contacts: { firstName: '', lastName: '', relationship: '', email: '', phone_number: '', city: '', address: '' }
      });
      setPhotoFile(null);
      if (photoInputRef.current) photoInputRef.current.value = "";

    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al crear la institución');
    }
  };

  // Clases CSS
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-2 relative overflow-hidden group hover:border-blue-900 transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-block border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest mt-2";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 placeholder:text-blue-900/40 font-medium transition-all";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";

  return (
    <form className="w-full flex flex-col gap-6 text-blue-950 pb-10" onSubmit={handleSubmit}>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* DATOS PERSONALES */}
        <div className={bentoCardClass}>
          <h2 className={bentoTitleClass}>Datos Personales</h2>
          <label htmlFor="firstName" className={labelClass}>Nombre:</label>
          <input type="text" id="firstName" name="user.firstName" placeholder="Ej: Diego Fernando" className={inputClass} value={formData.user.firstName} onChange={handleChange} />
          
          <label htmlFor="lastName" className={labelClass}>Apellido:</label>
          <input type="text" id="lastName" name="user.lastName" placeholder="Ej: Rojas Quintero" className={inputClass} value={formData.user.lastName} onChange={handleChange} />
          
          <label htmlFor="birthday" className={labelClass}>Fecha de nacimiento:</label>
          <input type="date" id="birthday" name="user.birthday" className={inputClass} value={formData.user.birthday} onChange={handleChange} />
        </div>

        {/* CREDENCIALES DE CUENTA */}
        <div className={bentoCardClass}>
          <h2 className={bentoTitleClass}>Perfil del Sistema</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className={labelClass}>UserName:</label>
              <input type="text" id="username" name="user.username" placeholder="Ej: DRojas" className={inputClass} value={formData.user.username} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>Contraseña:</label>
              <input type="password" id="password" name="user.password" placeholder="****" className={inputClass} value={formData.user.password} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="user_status" className={labelClass}>Estado:</label>
              <select id="user_status" name="user.status" className={selectClass} value={formData.user.status} onChange={selectChange}>
                <option value="" className="bg-white">Seleccione</option>
                <option value="ACTIVO" className="bg-white">Activo</option>
              </select>
            </div>
            <div>
              <label htmlFor="name" className={labelClass}>Rol:</label>
              <select id="name" name="roles.name" className={selectClass} value={formData.roles.name} onChange={selectChange}>
                <option value="" className="bg-white">Seleccione</option>
                <option value="Rector" className="bg-white">Rector</option>
                <option value="Coordinador" className="bg-white">Coordinador</option>
                <option value="Personal docente" className="bg-white">Personal docente</option>
                <option value="Psícologo" className="bg-white">Psícologo</option>
              </select>
            </div>
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
              <select id="documentType" name="contact_info.documentType" className={selectClass} value={formData.contact_info.documentType} onChange={selectChange}>
                <option value="" className="bg-white">Seleccione</option>
                <option value="CC" className="bg-white">Cédula de Ciudadanía</option>
                <option value="CE" className="bg-white">Cédula de Extranjería</option>
                <option value="NIT" className="bg-white">NIT</option>
              </select>
            </div>
            <div>
              <label htmlFor="identification" className={labelClass}>No. Identificación:</label>
              <input type="text" id="identification" name="contact_info.identification" placeholder="Ej: 1000222333" className={inputClass} value={formData.contact_info.identification} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email:</label>
              <input type="email" id="email" name="contact_info.email" placeholder="correo@ejemplo.com" className={inputClass} value={formData.contact_info.email} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="phone_number" className={labelClass}>Teléfono:</label>
              <input type="text" id="phone_number" name="contact_info.phone_number" placeholder="Ej: 555-555-5555" className={inputClass} value={formData.contact_info.phone_number} onChange={handleChange} />
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
              <select id="relationship" name="emergency_contacts.relationship" className={selectClass} value={formData.emergency_contacts.relationship} onChange={selectChange}>
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
              <input type="text" id="em_phone_number" name="emergency_contacts.phone_number" placeholder="Ej: 555-555-5555" className={inputClass} value={formData.emergency_contacts.phone_number} onChange={handleChange} />
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

      {/* BOTÓN "SELLO" */}
      <div className="mt-4 lg:col-span-2 flex justify-end">
        <button 
          type="submit" 
          className="px-8 py-3 border-4 border-blue-900 text-blue-950 font-black text-xl rounded-2xl hover:bg-blue-900 hover:text-white transition-all uppercase tracking-widest shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
        >
          Registrar Usuario
        </button>
      </div>

    </form>
  )
}

export default FormInscription;