import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import { Save, User, GraduationCap, Phone, AlertCircle, X } from "lucide-react";

// --- INTERFACES BASADAS EN LA BASE DE DATOS ---
export interface StudentFormData {
  id?: string; // Opcional, solo para edición
  user: {
    firstName: string;
    lastName: string;
    birthday: string;
    username: string;
    password?: string; // Opcional al editar
    is_admin: boolean;
    status: string; // 'ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'GRADUADO'
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

interface Props {
  initialData?: StudentFormData | null;
  onCancel?: () => void; 
}

const defaultFormData: StudentFormData = {
  user: { firstName: '', lastName: '', birthday: '', username: '', password: '', is_admin: false, status: 'ACTIVO' },
  contact_info: { documentType: '', identification: '', email: '', phone_number: '', city: '', address: '' },
  emergency_contacts: { firstName: '', lastName: '', relationship: '', email: '', phone_number: '', city: '', address: '' }
};

const StudentForm = ({ initialData, onCancel }: Props) => {
  const isEditing = !!initialData;
  const [isSaving, setIsSaving] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // --- ESTADO INICIAL ---
  const [formData, setFormData] = useState<StudentFormData>(defaultFormData);

  // --- EFECTO PARA MODO EDICIÓN ---
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  // --- MANEJADORES ---
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".") as [keyof StudentFormData, string];

    if (parent === "id") return; 

    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [child]: value
      }
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) setPhotoFile(files[0]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Forzamos el rol de Estudiante para el backend
      const payloadToBackend = {
        ...formData,
        roles: { name: "Estudiante" } 
      };

      console.log(isEditing ? "Actualizando Estudiante:" : "Creando Estudiante:", payloadToBackend);

      // Simulación de petición HTTP
      setTimeout(() => {
        alert(isEditing ? "¡Perfil del estudiante actualizado!" : "¡Estudiante matriculado exitosamente!");
        
        if (!isEditing) {
          setFormData(defaultFormData);
          setPhotoFile(null);
          if (photoInputRef.current) photoInputRef.current.value = "";
        } else if (onCancel) {
          onCancel();
        }
        
        setIsSaving(false);
      }, 1000);

    } catch (error) {
      console.error(error);
      alert(isEditing ? "Error al actualizar." : "Error al matricular.");
      setIsSaving(false);
    }
  };

  // --- CLASES ESTILO CUADERNO BENTO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-2 relative overflow-hidden group hover:border-blue-900 transition-colors";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest mt-2";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 placeholder:text-blue-900/40 font-medium transition-all";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA DINÁMICA */}
      <div className="mb-2 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-blue-950 mb-2">
            {isEditing ? "Edición de Estudiante" : "Matrícula de Estudiante"}
          </h2>
          <p className="text-blue-900/70 font-medium">
            {isEditing 
              ? `Actualizando el expediente de ${formData.user.firstName} ${formData.user.lastName}.` 
              : "Ingrese los datos del alumno para registrarlo en el sistema académico."}
          </p>
        </div>
        
        {isEditing && onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 text-blue-900 font-bold hover:bg-blue-900/10 px-4 py-2 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" /> Cancelar
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* --- CAJA 1: DATOS PERSONALES --- */}
          <div className={bentoCardClass}>
            <h3 className={bentoTitleClass}><User className="w-5 h-5"/> Datos del Alumno</h3>
            
            <label className={labelClass}>Nombres:</label>
            <input type="text" name="user.firstName" placeholder="Ej: Camilo Andrés" className={inputClass} value={formData.user.firstName} onChange={handleChange} required />
            
            <label className={labelClass}>Apellidos:</label>
            <input type="text" name="user.lastName" placeholder="Ej: Gómez Ruiz" className={inputClass} value={formData.user.lastName} onChange={handleChange} required />
            
            <label className={labelClass}>Fecha de nacimiento:</label>
            <input type="date" name="user.birthday" className={inputClass} value={formData.user.birthday} onChange={handleChange} required />
          </div>

          {/* --- CAJA 2: PERFIL ACADÉMICO --- */}
          <div className={bentoCardClass}>
            <h3 className={bentoTitleClass}><GraduationCap className="w-5 h-5"/> Perfil Académico</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Usuario (Portal):</label>
                <input type="text" name="user.username" placeholder="CGomez" className={inputClass} value={formData.user.username} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>
                  {isEditing ? "Nueva Contraseña:" : "Contraseña inicial:"}
                </label>
                <input 
                  type="password" 
                  name="user.password" 
                  placeholder={isEditing ? "(Opcional)" : "****"} 
                  className={inputClass} 
                  value={formData.user.password || ""} 
                  onChange={handleChange} 
                  required={!isEditing} 
                />
              </div>
            </div>

            <div className="mt-2">
              <label className={labelClass}>Estado del Estudiante:</label>
              <select name="user.status" className={selectClass} value={formData.user.status} onChange={handleChange} required>
                <option value="ACTIVO" className="bg-white">ACTIVO</option>
                <option value="INACTIVO" className="bg-white">INACTIVO</option>
                <option value="SUSPENDIDO" className="bg-white">SUSPENDIDO</option>
                <option value="GRADUADO" className="bg-white">GRADUADO</option>
              </select>
            </div>
            
            <label className={labelClass}>
               {isEditing ? "Actualizar Fotografía:" : "Fotografía del alumno:"}
            </label>
            <input type="file" accept="image/*" className={`${inputClass} text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-900/10 file:text-blue-900 hover:file:bg-blue-900/20`} ref={photoInputRef} onChange={handleFileChange} />
          </div>

          {/* --- CAJA 3: INFORMACIÓN DE CONTACTO --- */}
          <div className={`${bentoCardClass} lg:col-span-2`}>
            <h3 className={bentoTitleClass}><Phone className="w-5 h-5"/> Información de Contacto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-2">
              <div>
                <label className={labelClass}>Tipo Doc.:</label>
                <select name="contact_info.documentType" className={selectClass} value={formData.contact_info.documentType} onChange={handleChange} required>
                  <option value="" className="bg-white">Seleccione</option>
                  <option value="TI" className="bg-white">Tarjeta de Identidad (TI)</option>
                  <option value="CC" className="bg-white">Cédula de Ciudadanía (CC)</option>
                  <option value="CE" className="bg-white">Cédula de Extranjería (CE)</option>
                  <option value="PAS" className="bg-white">Pasaporte</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>No. Identificación:</label>
                <input type="text" name="contact_info.identification" placeholder="Ej: 1000222333" className={inputClass} value={formData.contact_info.identification} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>Email Institucional:</label>
                <input type="email" name="contact_info.email" placeholder="correo@institucion.edu" className={inputClass} value={formData.contact_info.email} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>Teléfono (Si aplica):</label>
                <input type="text" name="contact_info.phone_number" placeholder="Ej: 555-555-5555" className={inputClass} value={formData.contact_info.phone_number} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Ciudad:</label>
                <input type="text" name="contact_info.city" placeholder="Ej: Bogotá" className={inputClass} value={formData.contact_info.city} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Dirección Residencial:</label>
                <input type="text" name="contact_info.address" placeholder="Ej: Calle 4 Biss # 10-12" className={inputClass} value={formData.contact_info.address} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* --- CAJA 4: ACUDIENTE / EMERGENCIA --- */}
          <div className={`${bentoCardClass} lg:col-span-2`}>
            <h3 className={bentoTitleClass}><AlertCircle className="w-5 h-5"/> Contacto Principal (Acudiente)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-2">
              <div>
                <label className={labelClass}>Nombres:</label>
                <input type="text" name="emergency_contacts.firstName" placeholder="Nombre del acudiente" className={inputClass} value={formData.emergency_contacts.firstName} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>Apellidos:</label>
                <input type="text" name="emergency_contacts.lastName" placeholder="Apellidos" className={inputClass} value={formData.emergency_contacts.lastName} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>Parentesco:</label>
                <select name="emergency_contacts.relationship" className={selectClass} value={formData.emergency_contacts.relationship} onChange={handleChange} required>
                  <option value="" className="bg-white">Seleccione</option>
                  <option value="Padre" className="bg-white">Padre</option>
                  <option value="Madre" className="bg-white">Madre</option>
                  <option value="Abuelo" className="bg-white">Abuelo(a)</option>
                  <option value="Tio" className="bg-white">Tío(a)</option>
                  <option value="Acudiente" className="bg-white">Acudiente Legal</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Email del Acudiente:</label>
                <input type="email" name="emergency_contacts.email" placeholder="correo@ejemplo.com" className={inputClass} value={formData.emergency_contacts.email} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Teléfono (Celular):</label>
                <input type="text" name="emergency_contacts.phone_number" placeholder="Ej: 300-000-0000" className={inputClass} value={formData.emergency_contacts.phone_number} onChange={handleChange} required />
              </div>
              <div className="flex gap-4">
                 <div className="w-1/2">
                  <label className={labelClass}>Ciudad:</label>
                  <input type="text" name="emergency_contacts.city" placeholder="Ciudad" className={inputClass} value={formData.emergency_contacts.city} onChange={handleChange} />
                 </div>
                 <div className="w-1/2">
                  <label className={labelClass}>Dirección:</label>
                  <input type="text" name="emergency_contacts.address" placeholder="Dirección" className={inputClass} value={formData.emergency_contacts.address} onChange={handleChange} />
                 </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTÓN "SELLO" DINÁMICO */}
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
            {isSaving ? "Guardando..." : (isEditing ? "Actualizar Alumno" : "Matricular Alumno")}
          </button>
        </div>

      </form>
    </div>
  )
}

export default StudentForm;