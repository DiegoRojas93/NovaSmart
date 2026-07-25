interface Props {
  firstName: string;
  lastName: string;
  userPhotoUrl?: string
  onHandleLogout: ( route?: string ) => void
}

const NavBarComponent = ({ firstName, lastName, userPhotoUrl, onHandleLogout }: Props) => (
  <nav className="w-full bg-brand-primary-6 shadow-sm p-4 flex justify-between items-center px-8 z-10">
    <h2 className="text-xl font-bold text-gray-700">NovaSmart</h2>
    
    <div className="flex items-center gap-6">

      <div className="flex items-center gap-3">
        <span className="text-gray-600 font-medium">
          { firstName } { lastName }
        </span>
        {userPhotoUrl ? (
          <img 
            src={userPhotoUrl} 
            alt="Foto de perfil" 
            className="w-12 h-12 rounded-full object-cover border-2 border-amber-400" 
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-amber-600 flex items-center justify-center font-bold border-2 border-amber-400">
            {firstName.charAt(0).toUpperCase()} {lastName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <button 
        onClick={ () => onHandleLogout() }
        className="text-sm bg-gray-200 hover:bg-red-500 hover:text-white transition-colors text-gray-700 font-semibold py-2 px-4 rounded-lg"
      >
        Cerrar Sesión
      </button>
    </div>
  </nav>
)


export default NavBarComponent
