interface Props {
  onToggle: () => void;
  isSidebarOpen: boolean
}

const MenuButtonComponent = ({ onToggle, isSidebarOpen }: Props ) => {
  return (
    <div className="w-full flex justify-start p-4 top-0 left-0 z-50 relative">
      <button 
        onClick={ onToggle }
        className="bg-amber-400 text-white p-2 rounded-md shadow-md hover:bg-opacity-80 transition flex items-center justify-center fixed"
        aria-label="Alternar menú"
      >
        {isSidebarOpen ? (
          // Ícono de "Cerrar" (X)
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Ícono de "Menú Hamburgesa"
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default MenuButtonComponent
