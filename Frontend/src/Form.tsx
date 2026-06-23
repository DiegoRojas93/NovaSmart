import { useState } from "react";

import styles from './styles/Form.module.css';

const Form = () => {

  // const [formData, setFormData] = useState({
  //   name: '',
  //   nit: '',
  //   department: '',
  //   city: '',
  //   address: '',
  //   vision: '',
  //   mission: '',
  //   status: ''
  // });

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

  // Capturar cambios de inputs

  // const handleChange = (e) => {

  //   const { name, value } = e.target;

  //   setFormData({
  //     ...formData,
  //     [name]: value
  //   });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const [parent, child] = name.split(".");

    setFormData( prev => ({
      ...prev,
      [ parent ]: {
        ...prev [ parent ],
        [child]: value
      }
    }));
  };

  // Enviar formulario
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // Vite inyectará la URL automáticamente

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

      console.log(`${ apiUrl }/institutions`)

      const response = await fetch(`${ apiUrl }/institutions`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al crear institución');
      }

      const data = await response.json();

      console.log('Institución creada:', data);

      alert('Institución creada correctamente');

      // Limpiar formulario

      // setFormData({
      //   name: '',
      //   nit: '',
      //   department: '',
      //   city: '',
      //   address: '',
      //   vision: '',
      //   mission: '',
      //   status: ''
      // });

      setFormData({

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

    } catch (error) {

      console.error(error);

      alert('Ocurrió un error');
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >

      <h1>Inscripción</h1>

      {/* Nombre del usuario */}

      <div className={styles.division}>
        <label htmlFor="first_name">
          Nombre:
        </label>

        <input
          type="text"
          id="first_name"
          name="user.first_name"
          placeholder="Ej: Diego Fernando"
          value={formData.user.first_name}
          onChange={handleChange}
        />
      </div>

      <br />

      {/* Apellido del usuario */}

      <div className={styles.division}>
        <label htmlFor="last_name">
          Apellido:
        </label>

        <input
          type="text"
          id="last_name"
          name="user.last_name"
          placeholder="Ej: Rojas Quintero"
          value={formData.user.last_name}
          onChange={handleChange}
        />
      </div>

      <br />

      {/* Fecha de nacimiento del usuario */}

      <div className={styles.division}>
        <label htmlFor="date">
          Fecha de nacimiento:
        </label>

        <input
          type="date"
          id="date"
          name="user.date"
          placeholder="Ej: 11/09/1993"
          value={formData.user.date}
          onChange={handleChange}
        />
      </div>

      <br />

      {/* Username del usuario */}

      <div className={styles.division}>
        <label htmlFor="username">
          UserName:
        </label>

        <input
          type="text"
          id="username"
          name="user.username"
          placeholder="Ej: DRojas"
          value={formData.user.username}
          onChange={handleChange}
        />
      </div>

      <br />

      {/* Password del usuario */}

      <div className={styles.division}>
        <label htmlFor="password">
          Contraseña:
        </label>

        <input
          type="password"
          id="password"
          name="user.password"
          placeholder="Ej: 1234"
          value={formData.user.password}
          onChange={handleChange}
        />
      </div>

      <br />

      {/* Estado del usuario */}

      <div className={styles.division}>

        <label htmlFor="status">
          Estado:
        </label>

        <select
          id="status"
          name="user.status"
          value={formData.user.status}
          onChange={handleChange}
        >

          <option value="">
            Seleccione un estado
          </option>

          <option value="ACTIVO">
            Activo
          </option>

        </select>

      </div>

      <hr />

      {/* Nombre de la institución */}

      <div className={styles.division}>
        <label htmlFor="name">
          Nombre de la institución:
        </label>

        <input
          type="text"
          id="name"
          name="institution.name"
          placeholder="Ej: I.E.D Sorrento"
          value={formData.institution.name}
          onChange={handleChange}
        />
      </div>

      <br />

      {/* Nit de la institución */}

      <div className={styles.division}>
        <label htmlFor="nit">
          NIT:
        </label>

        <input
          type="text"
          id="nit"
          name="institution.nit"
          placeholder="Ej: 100000000"
          value={formData.institution.nit}
          onChange={handleChange}
        />
      </div>

      <br />

      {/* Departamento de la institución */}

      <div className={styles.division}>
        <label htmlFor="department">
          Departamento
        </label>

        <input
          type="text"
          id="department"
          name="institution.department"
          placeholder="Ej: Cundinamarca"
          value={formData.institution.department}
          onChange={handleChange}
        />
      </div>

      <br />

      {/* Ciudad de la institución */}

      <div className={styles.division}>
        <label htmlFor="city">
          Ciudad:
        </label>

        <input
          type="text"
          id="city"
          name="institution.city"
          placeholder="Ej: Bogotá"
          value={formData.institution.city}
          onChange={handleChange}
        />
      </div>

      <br />

      {/* Dirección de la institución */}

      <div className={styles.division}>
        <label htmlFor="address">
          Dirección:
        </label>

        <input
          type="text"
          id="address"
          name="institution.address"
          placeholder="Ej: Cra 10 #20-30"
          value={formData.institution.address}
          onChange={handleChange}
        />
      </div>

      <br />

      {/* Vision de la institución */}

      <div className={styles.division}>
        <label htmlFor="vision">
          Vision:
        </label>

        <input
          type="text"
          id="vision"
          name="institution.vision"
          placeholder="Nuestra vision es ..."
          value={formData.institution.vision}
          onChange={handleChange}
        />
      </div>

      <br />

      {/* Mision de la institución */}

      <div className={styles.division}>
        <label htmlFor="mission">
          Mision:
        </label>

        <input
          type="text"
          id="mission"
          name="institution.mission"
          placeholder="Nuestra mision es ..."
          value={formData.institution.mission}
          onChange={handleChange}
        />
      </div>

      <br />

      {/* Status de la institución */}

      <div className={styles.division}>

        <label htmlFor="status">
          Estado:
        </label>

        <select
          id="status"
          name="institution.status"
          value={formData.institution.status}
          onChange={handleChange}
        >

          <option value="">
            Seleccione un estado
          </option>

          <option value="ACTIVA">
            Activa
          </option>

          <option value="INACTIVA">
            Inactiva
          </option>

        </select>

      </div>

      <br />

      <button type="submit">
        Crear
      </button>

    </form>
  )
}

export default Form
