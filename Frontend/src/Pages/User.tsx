import { useState, useEffect } from "react";

const User = () => {
  // 1. Estado para guardar los datos de la institución
  const [institution, setInstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Obtener la URL base de tu API
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    // 3. Función para obtener los datos del backend
    const fetchInstitution = async () => {
      try {
        // Aquí debes apuntar al ID de la institución que quieres cargar.
        // En un caso real con react-router, tomarías el ID de la URL (ej: /institutions/:id)
        // Por ahora, pondremos un "1" de ejemplo.
        const institutionId = 1; 
        
        const response = await fetch(`${apiUrl}/institutions/${institutionId}`);
        
        if (!response.ok) {
          throw new Error("No se pudo cargar la información de la institución");
        }
        
        const data = await response.json();
        console.log(data)
        setInstitution(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitution();
  }, [apiUrl]);

  // Manejo de estados de carga y error
  if (loading) return <div className="h-screen flex justify-center items-center">Cargando...</div>;
  if (error) return <div className="h-screen flex justify-center items-center text-red-500">{error}</div>;
  if (!institution) return <div className="h-screen flex justify-center items-center">No se encontraron datos</div>;

  // 4. Construir las URLs completas para las imágenes
  // Apuntamos al endpoint "/files/{filename}" de tu FileController en Spring Boot
  const logoUrl = institution.logo ? `${apiUrl}/files/${institution.logo}` : null;
  const bannerUrl = institution.banner ? `${apiUrl}/files/${institution.banner}` : null;

  return (
    <div className="min-h-screen w-screen flex flex-col items-center bg-gray-50 py-10">
      
      {/* Banner */}
      {bannerUrl && (
        <div className="w-full max-w-4xl h-64 mb-8 overflow-hidden rounded-lg shadow-md">
          <img 
            src={bannerUrl} 
            alt="Banner de la Institución" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Contenido Principal */}
      <div className="text-center bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        
        {/* Logo */}
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt="Logo de la Institución" 
            className="w-32 h-32 object-contain mx-auto mb-4 border rounded-full p-2" 
          />
        ) : (
          <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            Sin Logo
          </div>
        )}

        {/* Datos de Texto */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {institution.name}
        </h1>
        <p className="text-gray-600 mb-4">{institution.city}, {institution.department}</p>
        
        <div className="text-left mt-6">
          <p className="mb-2"><strong>NIT:</strong> {institution.nit}</p>
          <p className="mb-2"><strong>Dirección:</strong> {institution.address}</p>
          <p className="mb-2">
            <strong>Estado:</strong> 
            <span className={`ml-2 px-2 py-1 text-sm rounded ${institution.status === 'ACTIVA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {institution.status}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default User;