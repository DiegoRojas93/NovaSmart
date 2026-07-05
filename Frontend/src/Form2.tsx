import { useState, useRef } from "react";
import styles from './styles/Form.module.css';

const Form2 = () => {

  // 1. Estados para los datos de texto
  const [formData, setFormData] = useState({
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
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  
  // 3. Estados para guardar los archivos seleccionados
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".");

    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'logo') setLogoFile(files[0]);
    if (name === 'banner') setBannerFile(files[0]);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
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

      const response = await fetch(`${apiUrl}/institutions`, {
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

    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al crear la institución');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>Inscripción</h1>

      {/* --- DATOS DEL USUARIO --- */}
      <div className={styles.division}>
        <label htmlFor="first_name">Nombre:</label>
        <input type="text" id="first_name" name="user.first_name" placeholder="Ej: Diego Fernando" value={formData.user.first_name} onChange={handleChange} />
      </div>
      <br />

      <div className={styles.division}>
        <label htmlFor="last_name">Apellido:</label>
        <input type="text" id="last_name" name="user.last_name" placeholder="Ej: Rojas Quintero" value={formData.user.last_name} onChange={handleChange} />
      </div>
      <br />

      <div className={styles.division}>
        <label htmlFor="date">Fecha de nacimiento:</label>
        <input type="date" id="date" name="user.date" value={formData.user.date} onChange={handleChange} />
      </div>
      <br />

      <div className={styles.division}>
        <label htmlFor="username">UserName:</label>
        <input type="text" id="username" name="user.username" placeholder="Ej: DRojas" value={formData.user.username} onChange={handleChange} />
      </div>
      <br />

      <div className={styles.division}>
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" name="user.password" placeholder="Ej: 1234" value={formData.user.password} onChange={handleChange} />
      </div>
      <br />

      <div className={styles.division}>
        <label htmlFor="user_status">Estado de usuario:</label>
        <select id="user_status" name="user.status" value={formData.user.status} onChange={handleChange}>
          <option value="">Seleccione un estado</option>
          <option value="ACTIVO">Activo</option>
        </select>
      </div>
      
      <hr />

      {/* --- DATOS DE LA INSTITUCIÓN --- */}
      <div className={styles.division}>
        <label htmlFor="name">Nombre de la institución:</label>
        <input type="text" id="name" name="institution.name" placeholder="Ej: I.E.D Sorrento" value={formData.institution.name} onChange={handleChange} />
      </div>
      <br />

      <div className={styles.division}>
        <label htmlFor="nit">NIT:</label>
        <input type="text" id="nit" name="institution.nit" placeholder="Ej: 100000000" value={formData.institution.nit} onChange={handleChange} />
      </div>
      <br />

      <div className={styles.division}>
        <label htmlFor="department">Departamento:</label>
        <input type="text" id="department" name="institution.department" placeholder="Ej: Cundinamarca" value={formData.institution.department} onChange={handleChange} />
      </div>
      <br />

      <div className={styles.division}>
        <label htmlFor="city">Ciudad:</label>
        <input type="text" id="city" name="institution.city" placeholder="Ej: Bogotá" value={formData.institution.city} onChange={handleChange} />
      </div>
      <br />

      <div className={styles.division}>
        <label htmlFor="address">Dirección:</label>
        <input type="text" id="address" name="institution.address" placeholder="Ej: Cra 10 #20-30" value={formData.institution.address} onChange={handleChange} />
      </div>
      <br />

      <div className={styles.division}>
        <label htmlFor="vision">Vision:</label>
        <input type="text" id="vision" name="institution.vision" placeholder="Nuestra vision es ..." value={formData.institution.vision} onChange={handleChange} />
      </div>
      <br />

      <div className={styles.division}>
        <label htmlFor="mission">Mision:</label>
        <input type="text" id="mission" name="institution.mission" placeholder="Nuestra mision es ..." value={formData.institution.mission} onChange={handleChange} />
      </div>
      <br />

      <div className={styles.division}>
        <label htmlFor="inst_status">Estado de institución:</label>
        <select id="inst_status" name="institution.status" value={formData.institution.status} onChange={handleChange}>
          <option value="">Seleccione un estado</option>
          <option value="ACTIVA">Activa</option>
          <option value="INACTIVA">Inactiva</option>
        </select>
      </div>
      <br />

      <hr />

      {/* --- ARCHIVOS --- */}
      <div className={styles.division}>
        <label htmlFor="logo">Logo de la institución:</label>
        <input 
          type="file" 
          id="logo" 
          name="logo" 
          accept="image/*" 
          ref={logoInputRef}
          onChange={handleFileChange} 
        />
      </div>
      <br />

      <div className={styles.division}>
        <label htmlFor="banner">Banner de la institución:</label>
        <input 
          type="file" 
          id="banner" 
          name="banner" 
          accept="image/*" 
          ref={bannerInputRef}
          onChange={handleFileChange} 
        />
      </div>
      <br />

      <button type="submit">Crear</button>
    </form>
  );
};

export default Form2;