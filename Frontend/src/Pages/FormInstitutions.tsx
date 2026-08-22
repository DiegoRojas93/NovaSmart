import { useState, useRef, type ChangeEvent } from "react";
import bannerForm from '../assets/Banner Form.jpg';
import { Link, useNavigate } from "react-router";
import Stepper, { Step } from '../components/Stepper'; 

// --- INTERFACES ---
interface FormData {
  user: {
    firstName: string;
    lastName: string;
    birthday: string;
    username: string;
    password: string;
    admin: boolean;
    status: string;
  };
  institution: {
    name: string;
    nit: string;
    department: string;
    city: string;
    address: string;
    status: string;
    vision: string;
    mission: string;
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
  }
}

export const FormInstitutions = () => {

  // --- 1. ESTADOS DE DATOS ---
  const [formData, setFormData] = useState<FormData>({
    user: { firstName: '', lastName: '', birthday: '', username: '', password: '', admin: true, status: '' },
    institution: { name: '', nit: '', department: '', city: '', address: '', status: '', vision: '', mission: '' },
    roles: { name: '' },
    contact_info: { documentType: '', identification: '', email: '', phoneNumber: '', city: '', address: '' },
    emergency_contacts: { firstName: '', lastName: '', relationship: '', email: '', phoneNumber: '', city: '', address: '' }
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [ logoFile, setLogoFile ] = useState<File | null>(null);
  const [ bannerFile, setBannerFile ] = useState<File | null>(null);
  const [ photoFile, setPhotoFile ] = useState<File | null>(null);

  const navigate = useNavigate();

  // --- 2. MANEJADORES DE EVENTOS ---
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    type ParentKey = "user" | "institution" | "roles" | "contact_info" | "emergency_contacts";
    const [parent, child] = name.split(".") as [ParentKey, string];

    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [child]: value }
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files?.length) return;
    if (name === 'logo') setLogoFile(files[0]);
    if (name === 'banner') setBannerFile(files[0]);
    if (name === 'photo') setPhotoFile(files[0]);
  };

  // --- 3. ENVÍO DEL FORMULARIO (Se ejecuta al completar el Stepper) ---
  const handleFinalSubmit = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const dataToSend = new FormData();
      
      dataToSend.append("data", new Blob([JSON.stringify(formData)], { type: "application/json" }));
      if (logoFile) dataToSend.append("logo", logoFile);
      if (bannerFile) dataToSend.append("banner", bannerFile);
      if (photoFile) dataToSend.append("photo", photoFile);

      const response = await fetch(`${apiUrl}/institutions/inscription`, {
        method: 'POST',
        body: dataToSend
      });

      if (!response.ok) throw new Error('Error al crear institución');

      navigate(`/Login`, { replace: true });

    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al crear la institución');
    }
  };

  // --- 4. ESTILOS REUTILIZABLES ---
  const inputStyle = "w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-secundary-5 focus:border-brand-secundary-4 outline-none transition-colors text-bg-app shadow-sm";
  const labelStyle = "block text-sm font-bold text-brand-secundary-6 mb-1.5 uppercase tracking-wide";
  const stepContainerClass = "w-full animate-in fade-in slide-in-from-right-4 duration-500 py-4";
  const stepTitleClass = "text-3xl font-black text-brand-primary-2 border-b-2 border-brand-primary-5/30 pb-2 mb-6 inline-block";

  return (
    <section className="w-full min-h-screen flex flex-col lg:flex-row bg-brand-primary-6 items-start">
      
      {/* SECCIÓN DE LA IMAGEN (Sticky + Oculta en móviles muy pequeños para ahorrar espacio) */}
      <div className="w-full lg:w-4/12 xl:w-1/3 bg-brand-secundary-2 lg:sticky lg:top-0 lg:h-screen flex flex-col items-center justify-center p-8 border-b-4 lg:border-b-0 lg:border-r-4 border-amber-500 z-10 hidden md:flex"
         style={{
          backgroundImage: `
            conic-gradient(from 90deg at 1px 1px, transparent 25%, rgba(255, 255, 255, 0.15) 0%), 
            linear-gradient(45deg, transparent calc(50% - 0.5px), rgba(255, 255, 255, 0.15) 0 calc(50% + 0.5px), transparent 0), 
            linear-gradient(-45deg, transparent calc(50% - 0.5px), rgba(255, 255, 255, 0.15) 0 calc(50% + 0.5px), transparent 0)
          `,
          backgroundPosition: '-0.5px -0.5px, 0 0, 0 0',
          backgroundSize: '1rem 1rem, 2rem 2rem, 2rem 2rem'
        }}>
        <img 
          src={bannerForm} 
          alt="Banner de registro" 
          className="w-full max-w-sm object-cover rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-transform hover:scale-105"
        />
        <div className="mt-10 text-center">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Crea tu espacio</h2>
            <p className="text-brand-secundary-7 font-medium">Sigue los pasos para configurar tu institución en NovaSmart.</p>
        </div>
      </div>

      <div className="w-full lg:w-8/12 xl:w-2/3 p-4 sm:p-8 flex flex-col justify-between min-h-screen relative">
        
        {/* Contenedor del Stepper (Sin fondos extra, dejando que el Stepper haga su trabajo) */}
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center mt-10 mb-20">
            
            {/* REACT BITS STEPPER */}
            <Stepper
                initialStep={1}
                onStepChange={(step) => console.log("Paso actual:", step)}
                onFinalStepCompleted={handleFinalSubmit}
                backButtonText="Anterior"
                nextButtonText="Siguiente paso"
            >
                {/* PASO 1: DATOS USUARIO */}
                <Step>
                    <div className={stepContainerClass}>
                        <h2 className={stepTitleClass}>Datos del Usuario</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="firstName" className={labelStyle}>Nombre:</label>
                                <input type="text" id="firstName" name="user.firstName" placeholder="Ej: Diego" className={inputStyle} value={formData.user.firstName} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="lastName" className={labelStyle}>Apellido:</label>
                                <input type="text" id="lastName" name="user.lastName" placeholder="Ej: Rojas" className={inputStyle} value={formData.user.lastName} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="birthday" className={labelStyle}>Fecha nacimiento:</label>
                                <input type="date" id="birthday" name="user.birthday" className={inputStyle} value={formData.user.birthday} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="username" className={labelStyle}>Username:</label>
                                <input type="text" id="username" name="user.username" placeholder="Ej: DRojas" className={inputStyle} value={formData.user.username} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="password" className={labelStyle}>Contraseña:</label>
                                <input type="password" id="password" name="user.password" placeholder="••••••••" className={inputStyle} value={formData.user.password} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="user_status" className={labelStyle}>Estado:</label>
                                <select id="user_status" name="user.status" className={inputStyle} value={formData.user.status} onChange={handleChange}>
                                    <option value="">Seleccione...</option>
                                    <option value="ACTIVO">Activo</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="name" className={labelStyle}>Rol:</label>
                                <select id="name" name="roles.name" className={inputStyle} value={formData.roles.name} onChange={handleChange}>
                                    <option value="">Seleccione un rol...</option>
                                    <option value="Rector">Rector</option>
                                    <option value="Coordinador">Coordinador</option>
                                    <option value="Sercretario academico">Secretario académico</option>
                                    <option value="Personal docente">Personal docente</option>
                                    <option value="Psícologo">Psicólogo</option>
                                    <option value="Trabajador social">Trabajador social</option>
                                    <option value="Enfermero">Enfermero</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </Step>

                {/* PASO 2: CONTACTO */}
                <Step>
                    <div className={stepContainerClass}>
                        <h2 className={stepTitleClass}>Info. de Contacto</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="documentType" className={labelStyle}>Tipo documento:</label>
                                <select id="documentType" name="contact_info.documentType" className={inputStyle} value={formData.contact_info.documentType} onChange={handleChange}>
                                    <option value="">Seleccione...</option>
                                    <option value="CC">Cédula de Ciudadanía</option>
                                    <option value="NIT">NIT</option>
                                    <option value="CE">Cédula de Extranjería</option>
                                    <option value="PAS">Pasaporte</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="identification" className={labelStyle}>Identificación:</label>
                                <input type="text" id="identification" name="contact_info.identification" className={inputStyle} value={formData.contact_info.identification} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="email" className={labelStyle}>Email principal:</label>
                                <input type="email" id="email" name="contact_info.email" placeholder="correo@ejemplo.com" className={inputStyle} value={formData.contact_info.email} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className={labelStyle}>Teléfono:</label>
                                <input type="text" id="phoneNumber" name="contact_info.phoneNumber" className={inputStyle} value={formData.contact_info.phoneNumber} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="city" className={labelStyle}>Ciudad:</label>
                                <input type="text" id="city" name="contact_info.city" className={inputStyle} value={formData.contact_info.city} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="address" className={labelStyle}>Dirección completa:</label>
                                <input type="text" id="address" name="contact_info.address" className={inputStyle} value={formData.contact_info.address} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </Step>

                {/* PASO 3: EMERGENCIA */}
                <Step>
                    <div className={stepContainerClass}>
                        <h2 className={stepTitleClass}>Contacto de Emergencia</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="emergencyFirstName" className={labelStyle}>Nombre:</label>
                                <input type="text" id="emergencyFirstName" name="emergency_contacts.firstName" className={inputStyle} value={formData.emergency_contacts.firstName} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="emergencyLastName" className={labelStyle}>Apellido:</label>
                                <input type="text" id="emergencyLastName" name="emergency_contacts.lastName" className={inputStyle} value={formData.emergency_contacts.lastName} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="relationship" className={labelStyle}>Parentesco:</label>
                                <select id="relationship" name="emergency_contacts.relationship" className={inputStyle} value={formData.emergency_contacts.relationship} onChange={handleChange}>
                                    <option value="">Seleccione...</option>
                                    <option value="Padre">Padre</option>
                                    <option value="Madre">Madre</option>
                                    <option value="Tio">Tío</option>
                                    <option value="Tia">Tía</option>
                                    <option value="Abuelo">Abuelo/a</option>
                                    <option value="Hermano">Hermano/a</option>
                                    <option value="Padrastro">Padrastro</option>
                                    <option value="Madrastra">Madrastra</option>
                                    <option value="Amigo">Amigo</option>
                                    <option value="Amiga">Amiga</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="emergencyPhone" className={labelStyle}>Teléfono:</label>
                                <input type="text" id="emergencyPhone" name="emergency_contacts.phoneNumber" className={inputStyle} value={formData.emergency_contacts.phoneNumber} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="emergencyEmail" className={labelStyle}>Email:</label>
                                <input type="email" id="emergencyEmail" name="emergency_contacts.email" className={inputStyle} value={formData.emergency_contacts.email} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="emergencyAddress" className={labelStyle}>Dirección:</label>
                                <input type="text" id="emergencyAddress" name="emergency_contacts.address" className={inputStyle} value={formData.emergency_contacts.address} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </Step>

                {/* PASO 4: INSTITUCIÓN */}
                <Step>
                    <div className={stepContainerClass}>
                        <h2 className={stepTitleClass}>Datos Institución</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label htmlFor="instName" className={labelStyle}>Nombre oficial:</label>
                                <input type="text" id="instName" name="institution.name" className={inputStyle} value={formData.institution.name} onChange={handleChange} />
                            </div>
                            
                            <div>
                                <label htmlFor="nit" className={labelStyle}>NIT:</label>
                                <input type="text" id="nit" name="institution.nit" className={inputStyle} value={formData.institution.nit} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="inst_status" className={labelStyle}>Estado Institución:</label>
                                <select id="inst_status" name="institution.status" className={inputStyle} value={formData.institution.status} onChange={handleChange}>
                                    <option value="">Seleccione...</option>
                                    <option value="ACTIVA">Activa</option>
                                </select>
                            </div>

                            {/* --- CAMPOS RECUPERADOS --- */}
                            <div>
                                <label htmlFor="department" className={labelStyle}>Departamento:</label>
                                <input type="text" id="department" name="institution.department" placeholder="Ej: Cundinamarca" className={inputStyle} value={formData.institution.department} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="instCity" className={labelStyle}>Ciudad:</label>
                                <input type="text" id="instCity" name="institution.city" placeholder="Ej: Bogotá" className={inputStyle} value={formData.institution.city} onChange={handleChange} />
                            </div>
                            {/* --------------------------- */}

                            <div className="md:col-span-2">
                                <label htmlFor="instAddress" className={labelStyle}>Dirección sede principal:</label>
                                <input type="text" id="instAddress" name="institution.address" className={inputStyle} value={formData.institution.address} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="vision" className={labelStyle}>Visión:</label>
                                <textarea id="vision" name="institution.vision" rows={2} className={`${inputStyle} resize-none`} value={formData.institution.vision} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="mission" className={labelStyle}>Misión:</label>
                                <textarea id="mission" name="institution.mission" rows={2} className={`${inputStyle} resize-none`} value={formData.institution.mission} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </Step>

                {/* PASO 5: ARCHIVOS FINAL */}
                <Step>
                    <div className={stepContainerClass}>
                        <h2 className={stepTitleClass}>Archivos Gráficos</h2>
                        <p className="text-brand-secundary-6 mb-6 font-medium">Sube los recursos gráficos para personalizar el perfil de la institución y del usuario administrador.</p>
                        
                        <div className="flex flex-col gap-6 bg-brand-primary-6/30 p-6 rounded-2xl border border-brand-secundary-7/20">
                            <div>
                                <label htmlFor="photo" className={labelStyle}>Foto de perfil del Administrador:</label>
                                <input type="file" id="photo" name="photo" accept="image/*" className={`${inputStyle} bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-brand-primary-5 file:text-brand-primary-1 hover:file:bg-brand-primary-4 transition-all cursor-pointer`} ref={photoInputRef} onChange={handleFileChange} />
                            </div>
                            <div>
                                <label htmlFor="logo" className={labelStyle}>Logo Institucional:</label>
                                <input type="file" id="logo" name="logo" accept="image/*" className={`${inputStyle} bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-brand-secundary-7 file:text-brand-primary-1 hover:file:bg-brand-secundary-5 transition-all cursor-pointer`} ref={logoInputRef} onChange={handleFileChange} />
                            </div>
                            <div>
                                <label htmlFor="banner" className={labelStyle}>Banner Institucional:</label>
                                <input type="file" id="banner" name="banner" accept="image/*" className={`${inputStyle} bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-brand-secundary-7 file:text-brand-primary-1 hover:file:bg-brand-secundary-5 transition-all cursor-pointer`} ref={bannerInputRef} onChange={handleFileChange} />
                            </div>
                        </div>
                        
                        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                            <span className="text-amber-500 text-xl">⚠️</span>
                            <p className="text-sm text-amber-800 font-medium">Al hacer clic en finalizar, se creará la institución y serás redirigido al inicio de sesión.</p>
                        </div>
                    </div>
                </Step>

            </Stepper>

        </div>

        {/* FOOTER LINKS */}
        <div className="flex justify-center gap-6 pb-8 text-sm font-bold text-brand-secundary-6 relative z-20">
            <Link to="/" className="hover:text-brand-primary-5 hover:underline transition-all">Volver al Inicio</Link>
            <span className="text-brand-secundary-7">|</span>
            <Link to="/Login" className="hover:text-brand-primary-5 hover:underline transition-all">Ya tengo cuenta</Link>
        </div>

      </div>   
    </section>
  );
};