import { useState, useRef, type ChangeEvent } from "react";

import bannerForm from '../assets/Banner Form.jpg'
import { replace, useNavigate } from "react-router";

interface FormData {
  user: {
    first_name: string;
    last_name: string;
    date: string;
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
}

export const FormInstitutions = () => {

  // 1. Estados para los datos de texto

  const [formData, setFormData] = useState<FormData>({
    user: {
      first_name: '',
      last_name: '',
      date: '',
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
    }
  });

  // 2. Referencias para los inputs de archivo (útil para limpiarlos después)

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // 3. Manejador de inputs de texto

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    type ParentKey = "user" | "institution";

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

    type ParentKey = "user" | "institution";

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
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // 6. Manejador de selectores

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files?.length) return;
    if (name === 'logo') setLogoFile(files[0]);
    if (name === 'banner') setBannerFile(files[0]);
  };

  // 7. Navigate lo traemos para poder redirigir al usuario a su cuenta creada

  const navigate = useNavigate();

  // 8. Enviar formulario

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      const response = await fetch(`${ apiUrl }/institutions`, {
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
      alert('Institución creada correctamente');

      // 5. Limpiar el formulario
      setFormData({
        user: {
          first_name: '', last_name: '', date: '', username: '', password: '', is_admin: true, status: ''
        },
        institution: {
          name: '', nit: '', department: '', city: '', address: '', status: '', vision: '', mission: ''
        }
      });

      setLogoFile(null);
      setBannerFile(null);
      
      if (logoInputRef.current) logoInputRef.current.value = "";
      if (bannerInputRef.current) bannerInputRef.current.value = "";


      navigate(`/instittution/${ data.institution.id }`, { replace: true })

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
              <label htmlFor="first_name" className="flex-1">Nombre:</label>
              <input
                type="text"
                id="first_name"
                name="user.first_name"
                placeholder="Ej: Diego Fernando"
                className="flex-1"
                value={formData.user.first_name}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="last_name" className="flex-1">Apellido:</label>
              <input
                type="text"
                id="last_name"
                name="user.last_name"
                placeholder="Ej: Rojas Quintero"
                className="flex-1"
                value={formData.user.last_name}
                onChange={handleChange}
              />
            </div>
            <br />

            <div className="flex justify-between">
              <label htmlFor="date" className="flex-1">Fecha de nacimiento:</label>
              <input
                type="date"
                id="date"
                name="user.date"
                className="flex-1"
                value={formData.user.date}
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