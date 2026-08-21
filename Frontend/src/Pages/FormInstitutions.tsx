// import { useState, useRef, type ChangeEvent, type SubmitEvent } from "react";
// import bannerForm from '../assets/Banner Form.jpg';
// import { Link, replace, useNavigate } from "react-router";

// interface FormData {
//   user: {
//     firstName: string;
//     lastName: string;
//     birthday: string;
//     username: string;
//     password: string;
//     admin: boolean;
//     status: string;
//   };
//   institution: {
//     name: string;
//     nit: string;
//     department: string;
//     city: string;
//     address: string;
//     status: string;
//     vision: string;
//     mission: string;
//   };
//   roles: {
//     name: string;
//   };
//   contact_info: {
//     documentType: string;
//     identification: string;
//     email: string;
//     phoneNumber: string;
//     city: string;
//     address: string;
//   };
//   emergency_contacts: {
//     firstName: string;
//     lastName: string;
//     relationship: string;
//     email: string;
//     phoneNumber: string;
//     city: string;
//     address: string;
//   }
// }

// export const FormInstitutions = () => {

//   // 1. Estados para los datos de texto

//   const [formData, setFormData] = useState<FormData>({
//     user: {
//       firstName: '',
//       lastName: '',
//       birthday: '',
//       username: '',
//       password: '',
//       admin: true,
//       status: ''
//     },
//     institution: {
//       name: '',
//       nit: '',
//       department: '',
//       city: '',
//       address: '',
//       status: '',
//       vision: '',
//       mission: ''
//     },
//     roles: {
//       name: ''
//     },
//     contact_info: {
//       documentType: '',
//       identification: '',
//       email: '',
//       phoneNumber: '',
//       city: '',
//       address: '',
//     },
//     emergency_contacts: {
//       firstName: '',
//       lastName: '',
//       relationship: '',
//       email: '',
//       phoneNumber: '',
//       city: '',
//       address: '',
//     }
//   });

//   // 2. Referencias para los inputs de archivo

//   const logoInputRef = useRef<HTMLInputElement>(null),
//     bannerInputRef = useRef<HTMLInputElement>(null),
//     photoInputRef = useRef<HTMLInputElement>(null);

//   // 3. Manejador de inputs de texto

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
    
//     type ParentKey = "user" | "institution" | "roles" | "contact_info" | "emergency_contacts";

//     const [parent, child] = name.split(".") as [
//       ParentKey,
//       string
//     ];

//     setFormData(prev => ({
//       ...prev,
//       [parent]: {
//         ...prev[parent],
//         [child]: value
//       }
//     }));
//   };

//   // 4. Manejador de selectores

//   const selectChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const { name, value } = e.target;

//     type ParentKey = "user" | "institution" | "roles" | "contact_info" | "emergency_contacts";

//     const [parent, child] = name.split(".") as [
//       ParentKey,
//       string
//     ];

//     setFormData(prev => ({
//       ...prev,
//       [parent]: {
//         ...prev[parent],
//         [child]: value
//       }
//     }));
//   };

//   // 5. Estados para guardar los archivos seleccionados

//   const [ logoFile, setLogoFile ] = useState<File | null>(null),
//     [ bannerFile, setBannerFile ] = useState<File | null>(null),
//     [ photoFile, setPhotoFile ] = useState<File | null>(null);

//   // 6. Manejador de archivos
//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, files } = e.target;
//     if (!files?.length) return;
//     if (name === 'logo') setLogoFile(files[0]);
//     if (name === 'banner') setBannerFile(files[0]);
//     if (name === 'photo') setPhotoFile(files[0]);
//   };

//   // 7. Navegación

//   const navigate = useNavigate();

//   // 8. Enviar formulario

//   const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

//       const dataToSend = new FormData();
      
//       dataToSend.append(
//         "data", 
//         new Blob([JSON.stringify(formData)], { type: "application/json" })
//       );

//       if (logoFile) dataToSend.append("logo", logoFile);
//       if (bannerFile) dataToSend.append("banner", bannerFile);
//       if (photoFile) dataToSend.append("photo", photoFile);


//       console.log("Hola")

//       const response = await fetch(`${ apiUrl }/institutions/inscription`, {
//         method: 'POST',
//         body: dataToSend
//       });
//       console.log(response)

//       if (!response.ok) {
//         throw new Error('Error al crear institución');
//       }

//       const data = await response.json();

//       setFormData({
//         user: { firstName: '', lastName: '', birthday: '', username: '', password: '', admin: true, status: '' },
//         institution: { name: '', nit: '', department: '', city: '', address: '', status: '', vision: '', mission: '' },
//         roles: { name: '' },
//         contact_info: { documentType: '', identification: '', email: '', phoneNumber: '', city: '', address: '' },
//         emergency_contacts: { firstName: '', lastName: '', relationship: '', email: '', phoneNumber: '', city: '', address: '' }
//       });

//       setLogoFile(null);
//       setBannerFile(null);
//       setPhotoFile(null);
      
//       if (logoInputRef.current) logoInputRef.current.value = "";
//       if (bannerInputRef.current) bannerInputRef.current.value = "";
//       if (photoInputRef.current) photoInputRef.current.value = "";

//       navigate(`/Login`, { replace: true });

//     } catch (error) {
//       console.error(error);
//       alert('Ocurrió un error al crear la institución');
//     }
//   };

//   // --- CLASES DE ESTILO REUTILIZABLES (Tailwind) ---
//   const inputStyle = "w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secundary-5 focus:border-brand-secundary-4 outline-none transition-colors text-bg-app",
//     labelStyle = "block text-sm font-semibold text-brand-secundary-6 mb-1",
//     sectionCardStyle = "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-5",
//     sectionTitleStyle = "text-xl font-bold text-brand-primary-2 border-b pb-2";

//   return (
//     <section className="w-full min-h-screen flex flex-col lg:flex-row bg-brand-primary-6 items-start">
      
//       {/* SECCIÓN DE LA IMAGEN (Sticky + Más pequeña) */}
//       <div
//         className="w-full lg:w-5/12 xl:w-1/3 bg-brand-secundary-2 lg:sticky lg:top-0 lg:h-screen flex items-center justify-center p-8 border-b-4 lg:border-b-0 lg:border-r-4 border-amber-500 z-10"
//           style={{
//           // Patrón del cuaderno
//           backgroundImage: `
//             conic-gradient(from 90deg at 1px 1px, transparent 25%, rgba(255, 255, 255, 0.15) 0%), 
//             linear-gradient(45deg, transparent calc(50% - 0.5px), rgba(255, 255, 255, 0.15) 0 calc(50% + 0.5px), transparent 0), 
//             linear-gradient(-45deg, transparent calc(50% - 0.5px), rgba(255, 255, 255, 0.15) 0 calc(50% + 0.5px), transparent 0)
//           `,
//           backgroundPosition: '-0.5px -0.5px, 0 0, 0 0',
//           backgroundSize: '1rem 1rem, 2rem 2rem, 2rem 2rem'
//         }}
//         >
//         <img 
//           src={bannerForm} 
//           alt="Banner de registro" 
//           className="w-full max-w-xs sm:max-w-sm lg:max-w-md object-cover rounded-3xl shadow-2xl transform transition-transform hover:scale-105"
//         />
//       </div>

//       {/* SECCIÓN DEL FORMULARIO (Scroll natural) */}
//       <div className="w-full lg:w-7/12 xl:w-2/3 p-4 sm:p-8 lg:p-12 xl:p-16 flex justify-center">
//         <form 
//           className="w-full max-w-3xl flex flex-col gap-8" 
//           onSubmit={handleSubmit}
//         >
//           <div className="text-center mb-2 mt-4 lg:mt-0">
//             <h1 className="text-4xl sm:text-5xl font-black text-brand-primary-2 mb-2">Inscripción</h1>
//             <p className="text-brand-secundary-6">Registra tu institución y crea el usuario administrador.</p>
//           </div>

//           {/* 1. DATOS DEL USUARIO */}
//           <div className={sectionCardStyle}>
//             <h2 className={sectionTitleStyle}>Datos del Usuario</h2>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <div>
//                 <label htmlFor="firstName" className={labelStyle}>Nombre:</label>
//                 <input type="text" id="firstName" name="user.firstName" placeholder="Ej: Diego Fernando" className={inputStyle} value={formData.user.firstName} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="lastName" className={labelStyle}>Apellido:</label>
//                 <input type="text" id="lastName" name="user.lastName" placeholder="Ej: Rojas Quintero" className={inputStyle} value={formData.user.lastName} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="birthday" className={labelStyle}>Fecha de nacimiento:</label>
//                 <input type="date" id="birthday" name="user.birthday" className={inputStyle} value={formData.user.birthday} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="username" className={labelStyle}>Username:</label>
//                 <input type="text" id="username" name="user.username" placeholder="Ej: DRojas" className={inputStyle} value={formData.user.username} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="password" className={labelStyle}>Contraseña:</label>
//                 <input type="password" id="password" name="user.password" placeholder="Ej: 1234" className={inputStyle} value={formData.user.password} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="user_status" className={labelStyle}>Estado de usuario:</label>
//                 <select id="user_status" name="user.status" className={inputStyle} value={formData.user.status} onChange={selectChange}>
//                   <option value="">Seleccione un estado</option>
//                   <option value="ACTIVO">Activo</option>
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="name" className={labelStyle}>Rol usuario:</label>
//                 <select id="name" name="roles.name" className={inputStyle} value={formData.roles.name} onChange={selectChange}>
//                   <option value="">Seleccione un rol</option>
//                   <option value="Rector">Rector</option>
//                   <option value="Coordinador">Coordinador</option>
//                   <option value="Sercretario academico">Secretario académico</option>
//                   <option value="Personal docente">Personal docente</option>
//                   <option value="Psícologo">Psicólogo</option>
//                   <option value="Trabajador social">Trabajador social</option>
//                   <option value="Enfermero">Enfermero</option>
//                 </select>
//               </div>

//               <div className="sm:col-span-2">
//                 <label htmlFor="photo" className={labelStyle}>Foto del usuario:</label>
//                 <input type="file" id="photo" name="photo" accept="image/*" className={`${inputStyle} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-secundary-7 file:text-brand-primary-3 hover:file:bg-brand-secundary-5  hover:file:text-brand-primary-7`} ref={photoInputRef} onChange={handleFileChange} />
//               </div>
//             </div>
//           </div>

//           {/* 2. INFORMACIÓN DE CONTACTO (Usuario) */}
//           <div className={sectionCardStyle}>
//             <h2 className={sectionTitleStyle}>Información de Contacto</h2>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <div>
//                 <label htmlFor="documentType" className={labelStyle}>Tipo de documento:</label>
//                 <select id="documentType" name="contact_info.documentType" className={inputStyle} value={formData.contact_info.documentType} onChange={selectChange}>
//                   <option value="">Seleccione tipo</option>
//                   <option value="CC">Cédula de Ciudadanía</option>
//                   <option value="CE">Cédula de Extranjería</option>
//                   <option value="PAS">Pasaporte</option>
//                   <option value="NIT">NIT</option>
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="identification" className={labelStyle}>Número de identificación:</label>
//                 <input type="text" id="identification" name="contact_info.identification" placeholder="Ej: 1020304050" className={inputStyle} value={formData.contact_info.identification} onChange={handleChange} />
//               </div>

//               <div className="sm:col-span-2">
//                 <label htmlFor="email" className={labelStyle}>Email:</label>
//                 <input type="email" id="email" name="contact_info.email" placeholder="correo@ejemplo.com" className={inputStyle} value={formData.contact_info.email} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="phoneNumber" className={labelStyle}>Número telefónico:</label>
//                 <input type="text" id="phoneNumber" name="contact_info.phoneNumber" placeholder="Ej: 300-555-5555" className={inputStyle} value={formData.contact_info.phoneNumber} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="city" className={labelStyle}>Ciudad:</label>
//                 <input type="text" id="city" name="contact_info.city" placeholder="Ej: Bogotá" className={inputStyle} value={formData.contact_info.city} onChange={handleChange} />
//               </div>

//               <div className="sm:col-span-2">
//                 <label htmlFor="address" className={labelStyle}>Dirección:</label>
//                 <input type="text" id="address" name="contact_info.address" placeholder="Ej: Calle 4 Bis # 10-12" className={inputStyle} value={formData.contact_info.address} onChange={handleChange} />
//               </div>
//             </div>
//           </div>

//           {/* 3. CONTACTO DE EMERGENCIA */}
//           <div className={sectionCardStyle}>
//             <h2 className={sectionTitleStyle}>Contacto de Emergencia</h2>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <div>
//                 <label htmlFor="emergencyFirstName" className={labelStyle}>Nombre:</label>
//                 <input type="text" id="emergencyFirstName" name="emergency_contacts.firstName" placeholder="Ej: Carlos" className={inputStyle} value={formData.emergency_contacts.firstName} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="emergencyLastName" className={labelStyle}>Apellido:</label>
//                 <input type="text" id="emergencyLastName" name="emergency_contacts.lastName" placeholder="Ej: Rojas" className={inputStyle} value={formData.emergency_contacts.lastName} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="relationship" className={labelStyle}>Relación:</label>
//                 <select id="relationship" name="emergency_contacts.relationship" className={inputStyle} value={formData.emergency_contacts.relationship} onChange={selectChange}>
//                   <option value="">Seleccione relación</option>
//                   <option value="Padre">Padre</option>
//                   <option value="Madre">Madre</option>
//                   <option value="Tio">Tío</option>
//                   <option value="Tia">Tía</option>
//                   <option value="Abuelo">Abuelo/a</option>
//                   <option value="Hermano">Hermano/a</option>
//                   <option value="Padrastro">Padrastro</option>
//                   <option value="Madrastra">Madrastra</option>
//                   <option value="Amigo">Amigo</option>
//                   <option value="Amiga">Amiga</option>
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="emergencyPhone" className={labelStyle}>Número telefónico:</label>
//                 <input type="text" id="emergencyPhone" name="emergency_contacts.phoneNumber" placeholder="Ej: 300-555-5555" className={inputStyle} value={formData.emergency_contacts.phoneNumber} onChange={handleChange} />
//               </div>

//               <div className="sm:col-span-2">
//                 <label htmlFor="emergencyEmail" className={labelStyle}>Email:</label>
//                 <input type="email" id="emergencyEmail" name="emergency_contacts.email" placeholder="correo@ejemplo.com" className={inputStyle} value={formData.emergency_contacts.email} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="emergencyCity" className={labelStyle}>Ciudad:</label>
//                 <input type="text" id="emergencyCity" name="emergency_contacts.city" placeholder="Ej: Bogotá" className={inputStyle} value={formData.emergency_contacts.city} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="emergencyAddress" className={labelStyle}>Dirección:</label>
//                 <input type="text" id="emergencyAddress" name="emergency_contacts.address" placeholder="Ej: Calle 4 Bis # 10-12" className={inputStyle} value={formData.emergency_contacts.address} onChange={handleChange} />
//               </div>
//             </div>
//           </div>

//           {/* 4. DATOS DE LA INSTITUCIÓN */}

//           <div className={sectionCardStyle}>
//             <h2 className={sectionTitleStyle}>Datos de la Institución</h2>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <div className="sm:col-span-2">
//                 <label htmlFor="instName" className={labelStyle}>Nombre de la institución:</label>
//                 <input type="text" id="instName" name="institution.name" placeholder="Ej: I.E.D Sorrento" className={inputStyle} value={formData.institution.name} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="nit" className={labelStyle}>NIT:</label>
//                 <input type="text" id="nit" name="institution.nit" placeholder="Ej: 900.000.000-1" className={inputStyle} value={formData.institution.nit} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="inst_status" className={labelStyle}>Estado de institución:</label>
//                 <select id="inst_status" name="institution.status" className={inputStyle} value={formData.institution.status} onChange={selectChange}>
//                   <option value="">Seleccione un estado</option>
//                   <option value="ACTIVA">Activa</option>
//                   <option value="INACTIVA">Inactiva</option>
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="department" className={labelStyle}>Departamento:</label>
//                 <input type="text" id="department" name="institution.department" placeholder="Ej: Cundinamarca" className={inputStyle} value={formData.institution.department} onChange={handleChange} />
//               </div>

//               <div>
//                 <label htmlFor="instCity" className={labelStyle}>Ciudad:</label>
//                 <input type="text" id="instCity" name="institution.city" placeholder="Ej: Bogotá" className={inputStyle} value={formData.institution.city} onChange={handleChange} />
//               </div>

//               <div className="sm:col-span-2">
//                 <label htmlFor="instAddress" className={labelStyle}>Dirección:</label>
//                 <input type="text" id="instAddress" name="institution.address" placeholder="Ej: Cra 10 #20-30" className={inputStyle} value={formData.institution.address} onChange={handleChange} />
//               </div>

//               <div className="sm:col-span-2">
//                 <label htmlFor="vision" className={labelStyle}>Visión:</label>
//                 <textarea id="vision" name="institution.vision" placeholder="Nuestra visión es..." rows={3} className={`${inputStyle} resize-none`} value={formData.institution.vision} onChange={handleChange as any} />
//               </div>

//               <div className="sm:col-span-2">
//                 <label htmlFor="mission" className={labelStyle}>Misión:</label>
//                 <textarea id="mission" name="institution.mission" placeholder="Nuestra misión es..." rows={3} className={`${inputStyle} resize-none`} value={formData.institution.mission} onChange={handleChange as any} />
//               </div>
//             </div>
//           </div>

//           {/* 5. ARCHIVOS DE LA INSTITUCIÓN */}
//           <div className={sectionCardStyle}>
//             <h2 className={sectionTitleStyle}>Archivos Gráficos</h2>
            
//             <div className="flex flex-col gap-5">
//               <div>
//                 <label htmlFor="logo" className={labelStyle}>Logo de la institución:</label>
//                 <input type="file" id="logo" name="logo" accept="image/*" className={`${inputStyle} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-secundary-7 file:text-brand-primary-3 hover:file:bg-brand-secundary-5 hover:file:text-brand-primary-7`} ref={logoInputRef} onChange={handleFileChange} />
//               </div>

//               <div>
//                 <label htmlFor="banner" className={labelStyle}>Banner de la institución:</label>
//                 <input type="file" id="banner" name="banner" accept="image/*" className={`${inputStyle} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-secundary-7 file:text-brand-primary-3 hover:file:bg-brand-secundary-5  hover:file:text-brand-primary-7`} ref={bannerInputRef} onChange={handleFileChange} />
//               </div>
//             </div>
//           </div>
          
//           <div className="flex flex-col gap-2 mt-4">
//             <button 
//               type="submit" 
//               className="w-full bg-brand-secundary-3 hover:bg-brand-primary-3 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 text-lg"
//             >
//               Finalizar Inscripción
//             </button>
            
//             {/* ENLACES REUBICADOS AQUÍ */}
//             <div className="flex h-10 mt-4 text-sm text-gray-600 font-semibold items-center">
//               <Link to="/" className="flex-1 text-center hover:text-status-success hover:underline transition-colors">Volver al Home</Link>
//               <Link to="/Login" className="flex-1 text-center hover:text-status-success hover:underline transition-colors border-l-2 border-gray-200">Inicia sesión</Link>
//             </div>
//           </div>
//         </form>
//       </div>   
//     </section>
//   );
// };

import { useState, useRef, type ChangeEvent } from "react";
import bannerForm from '../assets/Banner Form.jpg';
import { Link, useNavigate } from "react-router";
// Asumo que el archivo Stepper está en la misma carpeta o ajusta la ruta
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