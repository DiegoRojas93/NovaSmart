interface Props {
  institution: {
    name: string;
    city: string;
    department: string;
    nit: string;
    address: string;
    status: string;
    mission?: string;
    vision?: string;
  };
  logoUrl?: string
}

const CardBannerComponent = ({ institution, logoUrl}: Props) => {

  const {
    name,
    city,
    department,
    nit,
    address,
    status,
    mission,
    vision,
  } = institution;

  return (

    <div className="text-center bg-white p-8 rounded-lg shadow-lg w-full max-w-7xl -mt-40 relative z-10 border-t-7 border-brand-primary-3 mb-10">
      
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
        {name}
      </h1>
      <p className="text-gray-500 mb-6 text-lg">{city}, {department}</p>
      
      <hr className="mb-6"/>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
          <p className="mb-2 text-gray-700"><strong>NIT:</strong> {nit}</p>
          <p className="mb-2 text-gray-700"><strong>Dirección:</strong> {address}</p>
          <p className="flex items-center text-gray-700">
            <strong>Estado:</strong> 
            <span className={`ml-2 px-3 py-1 text-xs font-bold rounded-full ${status === 'ACTIVA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status}
            </span>
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
          <p className="mb-2 text-gray-700"><strong>Misión:</strong> {mission || "No especificada"}</p>
          <p className="text-gray-700"><strong>Visión:</strong> {vision || "No especificada"}</p>
        </div>
      </div>
    </div>
  )
}


export default CardBannerComponent
