import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import { Save, Building2, Map, BookOpen, Image as ImageIcon } from "lucide-react";

// --- INTERFACES BASADAS EN LA BASE DE DATOS ---
// export interface InstitutionFormData {
//   id?: string;
//   nit: string;
//   name: string;
//   department: string;
//   city: string;
//   address: string;
//   vision: string;
//   mission: string;
//   status: string; // ENUM: 'ACTIVA', 'INACTIVA'
// }

interface institutionFormData {
  id?: number;
  nit: string;
  name: string;
  department: string;
  city: string;
  address: string;
  vision: string;
  mission: string;
  logo: string;
  banner: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

interface logoUrl {
  logoUrl: string
}

interface bannerUrl {
  bannerUrl: string
}

interface Props {
  initialIntitutionData?: institutionFormData | null;
  logoUrl: string;
  bannerUrl: string;
}

// const defaultFormData: InstitutionFormData = {
//   nit: "",
//   name: "",
//   department: "",
//   city: "",
//   address: "",
//   vision: "",
//   mission: "",
//   status: "ACTIVA"
// };

const defaultFormData: institutionFormData = {
  nit: "",
  name: "",
  department: "",
  city: "",
  address: "",
  vision: "",
  mission: "",
  logo: "",
  banner: "",
  status: "ACTIVA",
  createdAt: "",
  updatedAt:"",
  deletedAt: ""
};

const InstitutionProfileForm = ({ initialIntitutionData, logoUrl, bannerUrl }: Props) => {

  const [isSaving, setIsSaving] = useState(false),
    [formData, setFormData] = useState<institutionFormData>(defaultFormData);
  
  // Referencias para los archivos multimedia
  const logoInputRef = useRef<HTMLInputElement>(null),
    bannerInputRef = useRef<HTMLInputElement>(null),
    [logoFile, setLogoFile] = useState<File | null>(null),
    [bannerFile, setBannerFile] = useState<File | null>(null);

  // --- EFECTO PARA CARGA INICIAL ---
  useEffect(() => {
    if (initialIntitutionData) {
      setFormData(initialIntitutionData);
    } else {
      // En un caso real, aquí harías un fetch() a tu API para traer la institución principal
      setFormData(defaultFormData);
    }
    console.log(initialIntitutionData)
  }, [initialIntitutionData]);

  // --- MANEJADORES ---
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const { files } = e.target;
    if (files && files.length > 0) {
      if (type === 'logo') setLogoFile(files[0]);
      if (type === 'banner') setBannerFile(files[0]);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      ...formData,
      // Los archivos se enviarían a través de un FormData (multipart/form-data) en la petición real
    };

    console.log("Actualizando Perfil de la Institución:", payload);
    if (logoFile) console.log("Nuevo Logo:", logoFile.name);
    if (bannerFile) console.log("Nuevo Banner:", bannerFile.name);

    setTimeout(() => {
      alert("¡Perfil institucional actualizado exitosamente!");
      setIsSaving(false);
    }, 1000);
  };

  // --- CLASES CSS ESTILO CUADERNO ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors group hover:border-blue-900";
  const bentoTitleClass = "text-xl font-extrabold text-blue-950 mb-2 inline-flex items-center gap-2 border-b-2 border-blue-900/80 pb-1 w-max";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all";
  const textareaClass = "w-full bg-transparent border-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 p-3 rounded-xl font-medium transition-all resize-none min-h-[100px]";
  const selectClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all appearance-none cursor-pointer";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Perfil de la Institución</h2>
        <p className="text-blue-900/70 font-medium">
          Actualice la información legal, estratégica y gráfica del plantel educativo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* --- CAJA 1: IDENTIFICACIÓN --- */}
          <div className={bentoCardClass}>
            <h3 className={bentoTitleClass}><Building2 className="w-5 h-5"/> Identificación General</h3>
            
            <div>
              <label className={labelClass}>Nombre de la Institución:</label>
              <input type="text" name="name" placeholder={ initialIntitutionData?.name } className={inputClass} value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>NIT:</label>
                <input type="text" name="nit" placeholder={ initialIntitutionData?.nit } className={inputClass} value={formData.nit} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>Estado:</label>
                <select name="status" className={selectClass} value={formData.status} onChange={handleChange} required>
                  <option value="ACTIVA" className="bg-white text-green-700 font-bold">ACTIVA</option>
                  <option value="INACTIVA" className="bg-white text-red-700 font-bold">INACTIVA</option>
                </select>
              </div>
            </div>
          </div>

          {/* --- CAJA 2: UBICACIÓN --- */}
          <div className={bentoCardClass}>
            <h3 className={bentoTitleClass}><Map className="w-5 h-5"/> Ubicación Geográfica</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Departamento / Estado:</label>
                <input type="text" name="department" placeholder={ initialIntitutionData?.department } className={inputClass} value={formData.department} onChange={handleChange} required />
              </div>
              <div>
                <label className={labelClass}>Ciudad / Municipio:</label>
                <input type="text" name="city" placeholder={ initialIntitutionData?.city } className={inputClass} value={formData.city} onChange={handleChange} required />
              </div>
            </div>
            
            <div>
              <label className={labelClass}>Dirección Física:</label>
              <input type="text" name="address" placeholder={ initialIntitutionData?.address } className={inputClass} value={formData.address} onChange={handleChange} required />
            </div>
          </div>

          {/* --- CAJA 3: IDENTIDAD ESTRATÉGICA --- */}
          <div className={`${bentoCardClass} lg:col-span-2`}>
            <h3 className={bentoTitleClass}><BookOpen className="w-5 h-5"/> Identidad Estratégica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Misión Institucional:</label>
                <textarea 
                  name="mission" 
                  placeholder={ initialIntitutionData?.mission }
                  className={textareaClass} 
                  value={formData.mission} 
                  onChange={handleChange} 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Visión Institucional:</label>
                <textarea 
                  name="vision" 
                  placeholder={ initialIntitutionData?.vision } 
                  className={textareaClass} 
                  value={formData.vision} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          {/* --- CAJA 4: MULTIMEDIA --- */}
          <div className={`${bentoCardClass} lg:col-span-2`}>
            <h3 className={bentoTitleClass}><ImageIcon className="w-5 h-5"/> Recursos Multimedia</h3>
            <p className="text-sm text-blue-900/70 font-medium mb-2">
              Estos archivos se actualizarán en toda la plataforma (Sidebar principal, cabeceras de reportes, etc).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-4 border-2 border-dashed border-blue-900/20 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:bg-blue-900/5 transition-colors">
                <label className={labelClass}>Logo Institucional</label>
                <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden border-4 border-blue-900/10">
                  {logoFile ? (
                    <Building2 className="w-10 h-10 text-blue-900/30" />
                  ) : (
                    <img 
                        src={ logoUrl } 
                        alt="Foto de perfil" 
                        
                      />
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg" 
                  className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-900 file:text-white hover:file:bg-blue-800 cursor-pointer" 
                  ref={logoInputRef} 
                  onChange={(e) => handleFileChange(e, 'logo')} 
                />
              </div>

              <div className="p-4 border-2 border-dashed border-blue-900/20 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:bg-blue-900/5 transition-colors">
                <label className={labelClass}>Banner Principal</label>
                <div className="w-full h-24 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden border-4 border-blue-900/10">
                  {
                    bannerFile ? (
                      <ImageIcon className="w-10 h-10 text-blue-900/30" />
                    ) : (
                      <img 
                        src={ bannerUrl } 
                        alt="Banner de la Institución"
                        className="w-full h-full object-cover"
                      />
                    )
                  }
                </div>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg" 
                  className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-900 file:text-white hover:file:bg-blue-800 cursor-pointer" 
                  ref={bannerInputRef} 
                  onChange={(e) => handleFileChange(e, 'banner')} 
                />
              </div>
            </div>
          </div>

        </div>

        {/* BOTÓN "SELLO" */}
        <div className="flex justify-end mt-4">
          <button 
            type="submit" 
            disabled={isSaving}
            className={`flex items-center gap-3 px-8 py-3 border-4 border-blue-900 text-blue-950 font-black text-xl rounded-2xl transition-all uppercase tracking-widest ${
              isSaving 
                ? "opacity-50 cursor-not-allowed bg-blue-900/10" 
                : "hover:bg-blue-900 hover:text-white shadow-[4px_4px_0_rgba(30,58,138,0.3)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
            }`}
          >
            <Save className="w-6 h-6" />
            {isSaving ? "Guardando..." : "Guardar Perfil"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default InstitutionProfileForm;