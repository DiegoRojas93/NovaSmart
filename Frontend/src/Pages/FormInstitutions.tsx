import { useState, useRef, type ChangeEvent, type SubmitEvent } from "react";

import bannerForm from '../assets/Banner Form.jpg'
import { replace, useNavigate } from "react-router";

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

export const FormInstitutions = () => {

  // 1. Estados para los datos de texto

  const [formData, setFormData] = useState<FormData>({
    user: {
      firstName: '',
      lastName: '',
      birthday: '',
      username: '',
      password: '',
      is_admin: true,
      status: ''
    },
    institution: {
      name: '',
      nit: '',
      department: '',
      city: '',
      address: '',
      status: '',
      vision: '',
      mission: ''
    },
    roles: {
      name: ''
    },
    contact_info: {
      documentType: '',
      identification: '',
      email: '',
      phone_number: '',
      city: '',
      address: '',
    },
    emergency_contacts: {
      firstName: '',
      lastName: '',
      relationship: '',
      email: '',
      phone_number: '',
      city: '',
      address: '',
    }
  });

  // 2. Referencias para los inputs de archivo (útil para limpiarlos después)

  const logoInputRef = useRef<HTMLInputElement>(null),
    bannerInputRef = useRef<HTMLInputElement>(null),
    photoInputRef = useRef<HTMLInputElement>(null);

  // 3. Manejador de inputs de texto

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    type ParentKey = "user" | "institution" | "roles" | "contact_info" | "emergency_contacts";

    const [parent, child] = name.split(".") as [
      ParentKey,
      string
    ];

    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  };

  // 4. Manejador de selectores

  const selectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    type ParentKey = "user" | "institution" | "roles" | "contact_info" | "emergency_contacts";

    const [parent, child] = name.split(".") as [
      ParentKey,
      string
    ];

    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  };

  // 5. Estados para guardar los archivos seleccionados
  
  const [ logoFile, setLogoFile ] = useState<File | null>(null),
    [ bannerFile, setBannerFile ] = useState<File | null>(null),
    [ photoFile, setPhotoFile ] = useState<File | null>(null);

  // 6. Manejador de selectores

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files?.length) return;
    if (name === 'logo') setLogoFile(files[0]);
    if (name === 'banner') setBannerFile(files[0]);
    if (name === 'photo') setPhotoFile(files[0]);
  };

  // 7. Navigate lo traemos para poder redirigir al usuario a su cuenta creada

  const navigate = useNavigate();

  // 8. Enviar formulario

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

      // 4. Crear el FormData
      const dataToSend = new FormData();
      
      // Adjuntamos el objeto JSON como un Blob para que Spring Boot lo lea con @RequestPart
      dataToSend.append(
        "data", 
        new Blob([JSON.stringify(formData)], { type: "application/json" })
      );

      // Adjuntamos los archivos si el usuario los seleccionó

      if (logoFile) {
        dataToSend.append("logo", logoFile);
      }

      if (bannerFile) {
        dataToSend.append("banner", bannerFile);
      }

      if (photoFile) {
        dataToSend.append("photo", photoFile);
      }

      console.log(dataToSend);

      const response = await fetch(`${ apiUrl }/institutions/inscription`, {
        method: 'POST',
        // IMPORTANTE: No agregues 'Content-Type': 'application/json' aquí.
        // El navegador configurará 'multipart/form-data' automáticamente al detectar el FormData.
        body: dataToSend
      });

      if (!response.ok) {
        throw new Error('Error al crear institución');
      }

      const data = await response.json();
      console.log('Institución creada:', data);
      // alert('Institución creada correctamente');

      // 5. Limpiar el formulario

      setFormData({
        user: {
          firstName: '', lastName: '', birthday: '', username: '', password: '', is_admin: true, status: ''
        },
        institution: {
          name: '', nit: '', department: '', city: '', address: '', status: '', vision: '', mission: ''
        },
        roles: {
          name: ''
        },
        contact_info: {
          documentType: '',
          identification: '',
          email: '',
          phone_number: '',
          city: '',
          address: '',
        },
        emergency_contacts: {
          firstName: '',
          lastName: '',
          relationship: '',
          email: '',
          phone_number: '',
          city: '',
          address: '',
        }
      });

      setLogoFile(null);
      setBannerFile(null);
      setPhotoFile(null);
      
      if (logoInputRef.current) logoInputRef.current.value = "";
      if (bannerInputRef.current) bannerInputRef.current.value = "";
      if (photoInputRef.current) photoInputRef.current.value = "";


      navigate(`/Login`, { replace: true })

    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al crear la institución');
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-col lg:flex-row">

      <figcaption className="h-full w-full grow flex-1 flex justify-center items-center bg-amber-400">
        <img src={ bannerForm } alt="Banner form" className="object-contain w-full h-full"/>
      </figcaption>

      <div className="flex-1 p-4">
        <form className="border-4 rounded-lg border-rd p-4" onSubmit={ handleSubmit }>

          <h1 className="text-4xl text-center text-primary-tx">Inscripción</h1>

          <br />
          <h2 className="text-2xl text-left">Datos del usuario</h2>
          <br />

          <div className="w-full flex-col justify-around items-center">

            <div className="flex justify-between">
              <label htmlFor="firstName" className="flex-1">Nombre:</label>
              <input
                type="text"
                id="firstName"
                name="user.firstName"
                placeholder="Ej: Diego Fernando"
                className="flex-1"
                value={formData.user.firstName}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="lastName" className="flex-1">Apellido:</label>
              <input
                type="text"
                id="lastName"
                name="user.lastName"
                placeholder="Ej: Rojas Quintero"
                className="flex-1"
                value={formData.user.lastName}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="birthday" className="flex-1">Fecha de nacimiento:</label>
              <input
                type="date"
                id="birthday"
                name="user.birthday"
                className="flex-1"
                value={formData.user.birthday}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="username" className="flex-1">UserName:</label>
              <input
                type="text"
                id="username"
                name="user.username"
                placeholder="Ej: DRojas"
                className="flex-1"
                value={formData.user.username}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="password" className="flex-1">Contraseña:</label>
              <input
                type="password"
                id="password"
                name="user.password"
                placeholder="Ej: 1234"
                className="flex-1"
                value={formData.user.password}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="user_status" className="flex-1">Estado de usuario:</label>
              <select
                id="user_status"
                name="user.status"
                className="flex-1"
                value={formData.user.status}
                onChange={selectChange}
              >
                <option value="">Seleccione un estado</option>
                <option value="ACTIVO">Activo</option>
              </select>
            </div>

            <br />

            <div className="flex justify-between">
              <label htmlFor="name" className="flex-1">Rol usuario:</label>
              <select
                id="name"
                name="roles.name"
                className="flex-1"
                value={formData.roles.name}
                onChange={selectChange}
              >
                <option value="">Seleccione un rol</option>
                <option value="Rector">Rector</option>
                <option value="Coordinador">Coordinador</option>
                <option value="Sercretario academico">Sercretario academico</option>
                <option value="Personal docente">Personal docente</option>
                <option value="Psícologo">Psícologo</option>
                <option value="Trabajador social">Trabajador social</option>
                <option value="Enfermero">Enfermero</option>
              </select>
            </div>

            <br />

            <div className="flex justify-between">
              <label htmlFor="photo" className="flex-1">Foto del usuario:</label>
              <input 
                type="file" 
                id="photo" 
                name="photo" 
                accept="image/*" 
                className="flex-1"
                ref={photoInputRef}
                onChange={handleFileChange} 
              />
            </div>
          </div>

          <br />
          <hr />

          <br />
          <h2 className="text-2xl text-left">Información del usuario</h2>
          <br />

          <div className="w-full flex-col justify-around items-center">

            <div className="flex justify-between">
              <label htmlFor="documentType" className="flex-1">Tipo de documento:</label>
              <select
                id="documentType"
                name="contact_info.documentType"
                className="flex-1"
                value={formData.contact_info.documentType}
                onChange={selectChange}
              >
                <option value="">Seleccione su tipo de documento</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="PAS">Pasaporte</option>
                <option value="NIT">NIT</option>

              </select>
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="identification" className="flex-1">Número de identificación:</label>
              <input
                type="test"
                id="identification"
                name="contact_info.identification"
                placeholder="Ej: Rojas Quintero"
                className="flex-1"
                value={formData.contact_info.identification}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="email" className="flex-1">Email:</label>
              <input
                type="email"
                id="email"
                name="contact_info.email"
                className="flex-1"
                value={formData.contact_info.email}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="phone_number" className="flex-1">Número telefonico:</label>
              <input
                type="text"
                id="phone_number"
                name="contact_info.phone_number"
                placeholder="Ej: 555-555-5555"
                className="flex-1"
                value={formData.contact_info.phone_number}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="city" className="flex-1">Ciudad:</label>
              <input
                type="text"
                id="city"
                name="contact_info.city"
                placeholder="Ej: Bogotá"
                className="flex-1"
                value={formData.contact_info.city}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="address" className="flex-1">Dirección:</label>
              <input
                type="text"
                id="address"
                name="contact_info.address"
                placeholder="Ej: Calle 4 Biss # 10-12"
                className="flex-1"
                value={formData.contact_info.address}
                onChange={handleChange}
              />
            </div>

          </div>

          <br />
          <hr />

          <br />
          <h2 className="text-2xl text-left">Contacto de emergencia</h2>
          <br />

          <div className="w-full flex-col justify-around items-center">

            <div className="flex justify-between">
              <label htmlFor="firstName" className="flex-1">Nombre:</label>
              <input
                type="text"
                id="firstName"
                name="emergency_contacts.firstName"
                placeholder="Ej: Diego Fernando"
                className="flex-1"
                value={formData.emergency_contacts.firstName}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="lastName" className="flex-1">Apellido:</label>
              <input
                type="text"
                id="lastName"
                name="emergency_contacts.lastName"
                placeholder="Ej: Rojas Quintero"
                className="flex-1"
                value={formData.emergency_contacts.lastName}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="relationship" className="flex-1">Relación:</label>
              <select
                id="relationship"
                name="emergency_contacts.relationship"
                className="flex-1"
                value={formData.emergency_contacts.relationship}
                onChange={selectChange}
              >
                <option value="">Seleccione un tipo de relación</option>
                <option value="Padre">Padre</option>
                <option value="Madre">Madre</option>
                <option value="Tio">Tio</option>
                <option value="Tia">Tia</option>
                <option value="Abuelo">Abuela</option>
                <option value="Hermano">Hermana</option>
                <option value="Padrastro">Padrastro</option>
                <option value="Madrastra">Madrastra</option>
                <option value="Amigo">Amigo</option>
                <option value="Amiga">Amiga</option>
              </select>
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="email" className="flex-1">Email:</label>
              <input
                type="email"
                id="email"
                name="emergency_contacts.email"
                className="flex-1"
                value={formData.emergency_contacts.email}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="phone_number" className="flex-1">Número telefonico:</label>
              <input
                type="text"
                id="phone_number"
                name="emergency_contacts.phone_number"
                placeholder="Ej: 555-555-5555"
                className="flex-1"
                value={formData.emergency_contacts.phone_number}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="city" className="flex-1">Ciudad:</label>
              <input
                type="text"
                id="city"
                name="emergency_contacts.city"
                placeholder="Ej: Bogotá"
                className="flex-1"
                value={formData.emergency_contacts.city}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="address" className="flex-1">Dirección:</label>
              <input
                type="text"
                id="address"
                name="emergency_contacts.address"
                placeholder="Ej: Calle 4 Biss # 10-12"
                className="flex-1"
                value={formData.emergency_contacts.address}
                onChange={handleChange}
              />
            </div>

          </div>


          <br />
          <hr />

          <br />
          <h2 className="text-2xl text-left">Datos de la institutción</h2>
          <br />

          <div className="w-full flex-col justify-around items-center">

            <div className="flex justify-between">
              <label htmlFor="name" className="flex-1">Nombre de la institución:</label>
              <input
                type="text"
                id="name"
                name="institution.name"
                placeholder="Ej: I.E.D Sorrento"
                className="flex-1"
                value={formData.institution.name}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="nit" className="flex-1">NIT:</label>
              <input
                type="text"
                id="nit"
                name="institution.nit"
                placeholder="Ej: 100000000"
                className="flex-1"
                value={formData.institution.nit}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="department" className="flex-1">Departamento:</label>
              <input
                type="text"
                id="department"
                name="institution.department"
                placeholder="Ej: Cundinamarca"
                className="flex-1"
                value={formData.institution.department}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="city" className="flex-1">Ciudad:</label>
              <input
                type="text"
                id="city"
                name="institution.city"
                placeholder="Ej: Bogotá"
                className="flex-1"
                value={formData.institution.city}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="address" className="flex-1">Dirección:</label>
              <input
                type="text"
                id="address"
                name="institution.address"
                placeholder="Ej: Cra 10 #20-30"
                className="flex-1"
                value={formData.institution.address}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="vision" className="flex-1">Vision:</label>
              <input
                type="text"
                id="vision"
                name="institution.vision"
                placeholder="Nuestra vision es ..."
                className="flex-1"
                value={formData.institution.vision}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="mission" className="flex-1">Mision:</label>
              <input
                type="text"
                id="mission"
                name="institution.mission"
                placeholder="Nuestra mision es ..."
                className="flex-1"
                value={formData.institution.mission}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="inst_status" className="flex-1">Estado de institución:</label>
              <select
                id="inst_status"
                name="institution.status"
                className="flex-1"
                value={formData.institution.status}
                onChange={selectChange}
              >
                <option value="">Seleccione un estado</option>
                <option value="ACTIVA">Activa</option>
                <option value="INACTIVA">Inactiva</option>
              </select>
            </div>
            <br />
          </div>

          <br />
          <hr />

          <br />
          <h2 className="text-2xl text-left">Datos archivos</h2>
          <br />

          <div className="w-full flex-col justify-around items-center">

            <div className="flex justify-between">
              <label htmlFor="logo" className="flex-1">Logo de la institución:</label>
              <input 
                type="file" 
                id="logo" 
                name="logo" 
                accept="image/*" 
                className="flex-1"
                ref={logoInputRef}
                onChange={handleFileChange} 
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="banner" className="flex-1">Banner de la institución:</label>
              <input 
                type="file" 
                id="banner" 
                name="banner" 
                accept="image/*" 
                className="flex-1"
                ref={bannerInputRef}
                onChange={handleFileChange} 
              />
            </div>
            <br />
          </div>
          
          <button type="submit">Crear</button>
        </form>
      </div>   
    </section>
  );
};