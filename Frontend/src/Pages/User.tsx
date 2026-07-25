import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

// Importaciones base
import NavBarComponent from "../shared/PagesComponents/NavBarComponent";
import BannerComponent from "../shared/PagesComponents/BannerComponent";
import CardBannerComponent from "../shared/PagesComponents/CardBannerComponent";
import MenuButtonComponent from "../shared/PagesComponents/MenuButtonComponent";

// IMPORTAMOS EL COMPONENTE Y LA INTERFAZ DESDE EL MISMO ARCHIVO
import SidebarComponent, { type SidebarPage } from "../shared/PagesComponents/SidebarComponent";

// Componentes del Cuaderno
import Sheets from "../shared/BookComponents/Sheets";
import NotebookCover from "../shared/BookComponents/NotebookCover";
import Sheet from "../shared/BookComponents/Sheet";

import rolesData from '../data/profesions.json';

// --- TIPADO DEL JSON ---
interface RoleData {
  sidebarAndPages: SidebarPage[];
}

type RolesJsonType = Record<string, RoleData>;
const typedRolesData: RolesJsonType = rolesData as any;

const User = () => {
  // 1. Estados
  const [institution, setInstitution] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<string>("Dashboard");

  // 2. Utilidades
  const { userId } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // 3. Toggle del sidebar
  const toggleSidevar = () => setIsSidebarOpen(prev => !prev);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No tienes acceso. Por favor, inicia sesión.");

        const headers = {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        };

        const userResponse = await fetch(`${apiUrl}/users/${userId}`, { method: "GET", headers });
        if (!userResponse.ok) throw new Error("No se pudo cargar la información del usuario");
        
        const userData = await userResponse.json();
        setUser(userData);

        if (userData.institutionId) {
          const instResponse = await fetch(`${apiUrl}/institutions/${userData.institutionId}`, { method: "GET", headers });
          if (!instResponse.ok) throw new Error("No se pudo cargar la información de la institución");
            
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

  const handleLogout = ( rute: string = "/" ) => {
    localStorage.removeItem("token");
    navigate(rute, { replace: true });
  };

  if (loading) return <div className="h-screen flex justify-center items-center text-xl font-semibold">Cargando tu panel...</div>;

  if (error) return (
    <div className="h-screen flex flex-col justify-center items-center">
      <p className="text-red-500 text-xl font-bold mb-4">{error}</p>
      <button onClick={() => handleLogout() } className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600">Volver al Login</button>
    </div>
  );

  const logoUrl = `${apiUrl}/files/${institution?.logo}`;
  const bannerUrl = `${apiUrl}/files/${institution?.banner}`;
  const photoUrl = `${apiUrl}/files/${user?.photo}`;

  // Obtenemos las páginas según el rol del usuario (Asumimos "Rector" por defecto para el ejemplo)
  // 1. Mantenemos el rol original intacto
  const userRole = "Rector"; // Nota: Aquí idealmente leerás el rol de la BD (ej. user.roleName)
  
  // 2. Obtenemos las páginas normales para ese rol
  let currentRolePages = typedRolesData[userRole]?.sidebarAndPages || [];

  console.log( userRole, user.admin)

  // 3. Verificamos si es admin en la base de datos
  if (user?.admin) {
    // Obtenemos las páginas exclusivas de administrador
    const adminPages = typedRolesData["Admin"]?.sidebarAndPages || [];

    console.log( adminPages )
    
    // FUSIONAMOS ambo  menús (Primero ponemos las de admin, y luego las de su rol)
    currentRolePages = [...adminPages, ...currentRolePages];
  }

  console.log( currentRolePages )

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-brand-primary-6">
      
      <div className="w-full z-40 relative shadow-md">
        <NavBarComponent
          firstName={ user.firstName }
          lastName={ user.lastName }
          userPhotoUrl={ photoUrl }
          onHandleLogout={ handleLogout }
        />
      </div>

      <div className="flex flex-1 overflow-hidden w-full relative">

        <SidebarComponent 
          institutionName={ institution.name } 
          logoUrl={ logoUrl } 
          isSidebarOpen={ isSidebarOpen}
          onHandleLogout={ handleLogout }
          pages={ currentRolePages }
          currentView={ currentView }
          onSelectView={ setCurrentView }
        />

        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col items-center relative">

          <MenuButtonComponent onToggle={ toggleSidevar } isSidebarOpen={ isSidebarOpen } />

          <BannerComponent bannerUrl={ bannerUrl } />

          <CardBannerComponent
            institution={ institution }
            logoUrl={ logoUrl }
          />
          
          {/* Renderizado Condicional de las Vistas */}
          <section className="w-full min-h-[calc(100vh-80px)] bg-yellow-900 md:p-4 pr-10">
            {(() => {
              // 1. Buscamos el objeto cuya llave coincida con la vista actual
              const activePageObj = currentRolePages.find(p => {
                const obj = p.pages || p.page;
                return obj && Object.keys(obj)[0] === currentView;
              });
              
              // 2. Si no hay vista activa o acaba de entrar, mostramos la Portada
              if (!activePageObj) {
                return (
                  <NotebookCover
                    firstName={ user.firstName }
                    lastName={ user.lastName }
                    rol={ userRole } 
                    foto={ photoUrl }
                  />
                );
              }

              // 3. Extraemos el título de la página y el arreglo de secciones
              const pageObj = activePageObj.pages || activePageObj.page;
              const pageTitle = Object.keys(pageObj!)[0]; 
              const sectionsArray = pageObj![pageTitle].Sections || [];

              // 4. Renderizamos el Cuaderno y le inyectamos el Slider con las secciones
              return (
                <Sheets key={activePageObj.id} title={pageTitle}>
                  <Sheet sections={sectionsArray} />
                </Sheets>
              );

            })()}
          </section>

        </main>
      </div>
    </div>
  ); 
};

export default User;