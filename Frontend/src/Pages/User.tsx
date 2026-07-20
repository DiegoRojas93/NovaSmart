import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

const User = () => {
  // 1. Estados para guardar los datos
  const [institution, setInstitution] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Utilidades de React Router y Variables de Entorno
  const { userId } = useParams(); // Ahora usamos userId, ya que es lo que espera la ruta en AppRouter
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    // 3. Función para obtener los datos del backend
    const fetchData = async () => {
      try {
        // Recuperamos el token guardado en el Login
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No tienes acceso. Por favor, inicia sesión.");
        }

        const headers = {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        };

        // --- A. OBTENER USUARIO LOGUEADO ---
        // Se utiliza el endpoint /users/{id} definido en UserController.java
        const userResponse = await fetch(`${apiUrl}/users/${userId}`, {
          method: "GET",
          headers: headers
        });

        if (!userResponse.ok) {
          throw new Error("No se pudo cargar la información del usuario");
        }

        const userData = await userResponse.json();
        setUser(userData);

        // --- B. OBTENER INSTITUCIÓN DEL USUARIO ---
        // Usamos el institutionId que viene dentro de los datos del usuario (asumiendo que tu modelo UserModel tiene institutionId)
        if (userData.institutionId) {
            // Se utiliza el endpoint /institutions/{id} definido en InstitutionsController.java
            const instResponse = await fetch(`${apiUrl}/institutions/${userData.institutionId}`, {
              method: "GET",
              headers: headers
            });
            
            if (!instResponse.ok) {
              throw new Error("No se pudo cargar la información de la institución");
            }
            
            const instData = await instResponse.json();
            setInstitution(instData);
        }

      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, userId]);

  // 4. Función para cerrar sesión de forma segura
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/Login", { replace: true });
  };

  // Manejo de pantallas de carga y error
  if (loading) return <div className="h-screen flex justify-center items-center text-xl font-semibold">Cargando tu panel...</div>;
  if (error) return (
    <div className="h-screen flex flex-col justify-center items-center">
      <p className="text-red-500 text-xl font-bold mb-4">{error}</p>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600">Volver al Login</button>
    </div>
  );
  
  // Si no hay institución, podemos mostrar un mensaje, pero seguimos renderizando la vista
  // if (!institution) return <div className="h-screen flex justify-center items-center">No se encontraron datos de la institución</div>;

  // 5. Construir las URLs completas para las imágenes apuntando al endpoint público /files/
  const logoUrl = institution?.logo ? `${apiUrl}/files/${institution.logo}` : null;
  const bannerUrl = institution?.banner ? `${apiUrl}/files/${institution.banner}` : null;
  const userPhotoUrl = user?.photo ? `${apiUrl}/files/${user.photo}` : null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-100">
      
      {/* NAVBAR SUPERIOR: Botón de Cerrar Sesión y Foto de Usuario */}
      <nav className="w-full bg-white shadow-sm p-4 flex justify-between items-center px-8 z-10">
        <h2 className="text-xl font-bold text-gray-700">NovaSmart Dashboard</h2>
        
        <div className="flex items-center gap-6">
          {/* FOTO DEL USUARIO */}
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium">
              {user ? `${user.firstName} ${user.lastName}` : "Usuario Logueado"}
            </span>
            {userPhotoUrl ? (
              <img 
                src={userPhotoUrl} 
                alt="Foto de perfil" 
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400" 
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold border-2 border-amber-400">
                U
              </div>
            )}
          </div>

          <button 
            onClick={handleLogout}
            className="text-sm bg-gray-200 hover:bg-red-500 hover:text-white transition-colors text-gray-700 font-semibold py-2 px-4 rounded-lg"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* BANNER DE LA INSTITUCIÓN */}
      <div className="w-full h-64 bg-gray-300 relative">
        {bannerUrl ? (
          <img 
            src={bannerUrl} 
            alt="Banner de la Institución" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center text-gray-500">
            Sin Banner Registrado
          </div>
        )}
      </div>

      {/* TARJETA PRINCIPAL CON LOGO Y DATOS */}
      {institution && (
        <div className="text-center bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl -mt-20 relative z-10 border-t-4 border-amber-400 mb-10">
          
          {/* LOGO DE LA INSTITUCIÓN */}
          <div className="w-32 h-32 mx-auto -mt-24 mb-4 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden border-4 border-white">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Logo de la Institución" 
                className="w-full h-full object-contain p-2" 
              />
            ) : (
              <span className="text-gray-400 font-medium">Sin Logo</span>
            )}
          </div>

          {/* DATOS DE TEXTO */}
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {institution.name}
          </h1>
          <p className="text-gray-500 mb-6 text-lg">{institution.city}, {institution.department}</p>
          
          <hr className="mb-6"/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="mb-2 text-gray-700"><strong>NIT:</strong> {institution.nit}</p>
              <p className="mb-2 text-gray-700"><strong>Dirección:</strong> {institution.address}</p>
              <p className="flex items-center text-gray-700">
                <strong>Estado:</strong> 
                <span className={`ml-2 px-3 py-1 text-xs font-bold rounded-full ${institution.status === 'ACTIVA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {institution.status}
                </span>
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="mb-2 text-gray-700"><strong>Misión:</strong> {institution.mission || "No especificada"}</p>
              <p className="text-gray-700"><strong>Visión:</strong> {institution.vision || "No especificada"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;