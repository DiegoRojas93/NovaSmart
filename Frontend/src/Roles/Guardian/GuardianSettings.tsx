import { useState, useEffect, useCallback, type ChangeEvent, type FormEvent } from "react";
import { User, Mail, Phone, MapPin, Save, Lock, Users, Shield, UsersRound, Image as ImageIcon, Loader2 } from "lucide-react";
import { ModalComponent } from "../../shared/Basics/ModalComponent"; // Asegúrate de que esta ruta sea correcta según la ubicación de tu archivo

// --- INTERFACES ---
interface Props {
  guardianId: number;    // ID del acudiente autenticado
  profileImage?: string; // Foto de perfil del acudiente
}

interface GuardianData {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

interface EmergencyContact {
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  email: string;
  city: string;
  address: string;
}

interface StudentData {
  id: string;
  name: string;
  course: string;
  photo: string | null;
  phone: string;
  address: string;
  city: string;
  emergencyContact: EmergencyContact;
}

const relationshipOptions = [
  "Padre", "Madre", "Tio", "Tia", "Abuelo", "Abuela", 
  "Hermano", "Hermana", "Padrastro", "Madrastra", 
  "Amigo", "Amiga", "Acudiente"
];

const GuardianSettings = ({ guardianId, profileImage }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS GLOBALES ---
  const [activeTab, setActiveTab] = useState<"GUARDIAN" | "STUDENTS">("GUARDIAN");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // --- ESTADOS DE DATOS ---
  const [guardianData, setGuardianData] = useState<GuardianData | null>(null);
  const [childrenData, setChildrenData] = useState<StudentData[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  // --- ESTADOS DEL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");
  const [modalErrorCode, setModalErrorCode] = useState<number | string | null>(null);

  // --- OBTENER DATOS DEL BACKEND ---
  const fetchSettings = useCallback(async () => {
    if (!guardianId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/guardian-settings/${guardianId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGuardianData(data.guardianData);
        setChildrenData(data.childrenData || []);
        if (data.childrenData && data.childrenData.length > 0) {
          setSelectedChildId(data.childrenData[0].id);
        }
      }
    } catch (error) {
      console.error("Error cargando los ajustes:", error);
      // Opcional: Mostrar modal de error si falla al cargar la info principal
    } finally {
      setIsLoading(false);
    }
  }, [guardianId, apiUrl]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // --- MANEJADORES ---
  const handleGuardianChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (guardianData) {
      setGuardianData({ ...guardianData, [name]: value });
    }
  };

  const handleChildChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChildrenData(prev => prev.map(child => 
      child.id === selectedChildId ? { ...child, [name]: value } : child
    ));
  };

  const handleEmergencyChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setChildrenData(prev => prev.map(child => 
      child.id === selectedChildId 
        ? { ...child, emergencyContact: { ...child.emergencyContact, [name]: value } } 
        : child
    ));
  };

  // --- GUARDAR DATOS EN EL BACKEND ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch(`${apiUrl}/guardian-settings/${guardianId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ guardianData, childrenData })
      });

      if (res.ok) {
        setModalType("success");
        setModalMessage("Tus ajustes han sido guardados y actualizados correctamente en el sistema.");
        setModalErrorCode(null);
        setIsModalOpen(true);
      } else {
        setModalType("error");
        setModalMessage("Hubo un error al intentar actualizar la información. Por favor, verifica los campos.");
        setModalErrorCode(res.status); // Pasamos el código HTTP al Modal
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error guardando settings:", error);
      setModalType("error");
      setModalMessage("Ocurrió un error de conexión. Verifica tu internet e inténtalo de nuevo.");
      setModalErrorCode(null);
      setIsModalOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const getPhotoUrl = (photo: string | null) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    return `${apiUrl}/files/${photo}`;
  };

  // --- CLASES CSS COMPARTIDAS ---
  const bentoCardClass = "border-2 border-blue-900/30 rounded-3xl p-6 md:p-8 bg-transparent flex flex-col gap-4 relative transition-colors shadow-sm";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest mb-1 block transition-colors group-focus-within:text-blue-900";
  const inputContainerClass = "relative group transition-all duration-300 hover:-translate-y-0.5 focus-within:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 fill-mode-both";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1.5 font-medium transition-all pl-8";
  const readOnlyInputClass = "w-full bg-blue-900/5 border-b-2 border-blue-900/10 text-blue-900/60 py-1.5 px-3 rounded-t-lg font-bold cursor-not-allowed";
  const selectClass = "w-full bg-white border-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 px-4 py-2 font-black rounded-xl transition-all appearance-none cursor-pointer hover:border-blue-900/50 hover:shadow-sm";

  // --- PANTALLA DE CARGA ---
  if (isLoading || !guardianData) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-blue-900/50">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h3 className="text-xl font-black">Cargando perfil...</h3>
        <p className="font-medium">Obteniendo tu información y la de tus acudidos</p>
      </div>
    );
  }

  const activeChild = childrenData.find(c => c.id === selectedChildId) || childrenData[0];

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      {/* CABECERA (Animada) */}
      <div className="mb-2 border-b-4 border-blue-900/20 pb-4">
        <h2 className="text-3xl font-black text-blue-950 mb-2 animate-in fade-in slide-in-from-left-4 duration-700">Ajustes de Cuenta</h2>
        <p className="text-blue-900/70 font-medium animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
          Mantenga sus datos de contacto y los de sus acudidos actualizados para recibir notificaciones y alertas oportunamente.
        </p>
      </div>

      {/* PESTAÑAS */}
      <div className="flex bg-blue-900/10 p-1 rounded-2xl w-full sm:w-max animate-in fade-in zoom-in-95 duration-500">
        <button 
          type="button"
          onClick={() => setActiveTab("GUARDIAN")}
          className={`flex-1 sm:px-8 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest ${
            activeTab === "GUARDIAN" ? "bg-white shadow-sm text-blue-900 scale-100" : "text-blue-900/60 hover:text-blue-900 scale-95 hover:scale-100 hover:bg-blue-900/5"
          }`}
        >
          <User className="w-4 h-4" /> Mis Datos
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab("STUDENTS")}
          className={`flex-1 sm:px-8 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest ${
            activeTab === "STUDENTS" ? "bg-white shadow-sm text-blue-900 scale-100" : "text-blue-900/60 hover:text-blue-900 scale-95 hover:scale-100 hover:bg-blue-900/5"
          }`}
        >
          <Users className="w-4 h-4" /> Mis Acudidos
        </button>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2 relative">
        
        {/* --- PESTAÑA: MIS DATOS (GUARDIAN) --- */}
        {activeTab === "GUARDIAN" && (
          <div className={`${bentoCardClass} animate-in fade-in slide-in-from-left-8 duration-500`}>
            
            <div className="flex flex-col xl:flex-row gap-8">
              
              {/* COLUMNA IZQUIERDA: Avatar (Solo lectura) */}
              <div className="flex flex-col items-center gap-4 shrink-0 xl:w-48 animate-in zoom-in-95 fill-mode-both duration-500 delay-100">
                <div className="relative w-36 h-36 rounded-full border-4 border-blue-900/10 overflow-hidden shadow-sm group">
                  {profileImage ? (
                    <img src={getPhotoUrl(profileImage)!} alt="Foto de perfil del acudiente" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-blue-900/5 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-blue-900/20" />
                    </div>
                  )}
                  {/* Overlay indicador de solo lectura */}
                  <div className="absolute inset-0 bg-blue-950/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]">
                    <Lock className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-900/60 bg-blue-900/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-blue-900/10">
                    <Lock className="w-3 h-3" /> Foto (Solo Lectura)
                  </span>
                  <p className="text-[10px] font-bold text-blue-900/40 mt-2 leading-tight px-4">
                    La foto oficial es gestionada por la institución.
                  </p>
                </div>
              </div>

              {/* COLUMNA DERECHA: Datos del Acudiente */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Datos de Solo Lectura (DNI y Nombres) */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b-2 border-blue-900/10 border-dashed">
                  <div className={inputContainerClass} style={{ animationDelay: '100ms' }}>
                    <label className={labelClass}>Nombre Completo (Acudiente)</label>
                    <div className="relative">
                      <input type="text" className={readOnlyInputClass} value={`${guardianData.firstName} ${guardianData.lastName}`} readOnly />
                      <Lock className="absolute right-3 top-2.5 w-4 h-4 text-blue-900/30" />
                    </div>
                  </div>
                  <div className={inputContainerClass} style={{ animationDelay: '150ms' }}>
                    <label className={labelClass}>Documento de Identidad</label>
                    <div className="relative">
                      <input type="text" className={readOnlyInputClass} value={`${guardianData.documentType} ${guardianData.documentNumber}`} readOnly />
                      <Lock className="absolute right-3 top-2.5 w-4 h-4 text-blue-900/30" />
                    </div>
                  </div>
                </div>

                {/* Datos Editables (Contacto) */}
                <div className={inputContainerClass} style={{ animationDelay: '200ms' }}>
                  <label className={labelClass}>Correo Electrónico</label>
                  <Mail className="absolute left-0 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors" />
                  <input type="email" name="email" className={inputClass} value={guardianData.email || ""} onChange={handleGuardianChange} required />
                </div>

                <div className={inputContainerClass} style={{ animationDelay: '250ms' }}>
                  <label className={labelClass}>Teléfono Móvil</label>
                  <Phone className="absolute left-0 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors" />
                  <input type="tel" name="phone" className={inputClass} value={guardianData.phone || ""} onChange={handleGuardianChange} />
                </div>

                <div className={inputContainerClass} style={{ animationDelay: '300ms' }}>
                  <label className={labelClass}>Ciudad</label>
                  <MapPin className="absolute left-0 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors" />
                  <input type="text" name="city" className={inputClass} value={guardianData.city || ""} onChange={handleGuardianChange} />
                </div>

                <div className={inputContainerClass} style={{ animationDelay: '350ms' }}>
                  <label className={labelClass}>Dirección de Residencia</label>
                  <MapPin className="absolute left-0 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors" />
                  <input type="text" name="address" className={inputClass} value={guardianData.address || ""} onChange={handleGuardianChange} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PESTAÑA: MIS ACUDIDOS (STUDENTS) --- */}
        {activeTab === "STUDENTS" && activeChild && (
          <div className={`${bentoCardClass} animate-in fade-in slide-in-from-right-8 duration-500`}>
            
            {/* Selector de Estudiante */}
            <div className="mb-2 p-5 bg-blue-900/5 rounded-2xl border-2 border-blue-900/10 animate-in zoom-in-95 duration-300">
              <label className={`${labelClass} flex items-center gap-2 mb-2`}>
                <UsersRound className="w-4 h-4 text-blue-900" /> Seleccione el estudiante a actualizar:
              </label>
              <select className={selectClass} value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)}>
                {childrenData.map(child => <option key={child.id} value={child.id}>{child.name} (Curso {child.course})</option>)}
              </select>
            </div>

            <div className="flex flex-col xl:flex-row gap-8 mt-4">
              
              {/* COLUMNA IZQUIERDA: Avatar del Estudiante */}
              <div key={activeChild.id} className="flex flex-col items-center gap-4 shrink-0 xl:w-48 animate-in zoom-in-95 fill-mode-both duration-500">
                <div className="relative w-36 h-36 rounded-full border-4 border-blue-900/10 overflow-hidden shadow-sm group">
                  {activeChild.photo ? (
                    <img src={getPhotoUrl(activeChild.photo)!} alt={`Foto de ${activeChild.name}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-blue-900/5 flex items-center justify-center">
                      <User className="w-12 h-12 text-blue-900/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-blue-950/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px]">
                    <Lock className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-900/60 bg-blue-900/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-blue-900/10">
                    <Lock className="w-3 h-3" /> Foto Estudiante
                  </span>
                </div>
              </div>

              {/* COLUMNA DERECHA: Datos de Contacto del Estudiante */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Info de contacto propia del estudiante */}
                <div className={inputContainerClass} style={{ animationDelay: '100ms' }}>
                  <label className={labelClass}>Teléfono del Estudiante (Opcional)</label>
                  <Phone className="absolute left-0 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors" />
                  <input type="tel" name="phone" className={inputClass} value={activeChild.phone || ""} onChange={handleChildChange} />
                </div>
                <div className={inputContainerClass} style={{ animationDelay: '150ms' }}>
                  <label className={labelClass}>Ciudad (Estudiante)</label>
                  <MapPin className="absolute left-0 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors" />
                  <input type="text" name="city" className={inputClass} value={activeChild.city || ""} onChange={handleChildChange} />
                </div>
                <div className={`${inputContainerClass} md:col-span-2`} style={{ animationDelay: '200ms' }}>
                  <label className={labelClass}>Dirección de Residencia (Estudiante)</label>
                  <MapPin className="absolute left-0 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors" />
                  <input type="text" name="address" className={inputClass} value={activeChild.address || ""} onChange={handleChildChange} />
                </div>

                {/* DATOS DE LA TABLA EMERGENCY_CONTACTS */}
                {activeChild.emergencyContact && (
                  <div className="md:col-span-2 mt-4 pt-6 border-t-2 border-blue-900/10 border-dashed">
                    <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                      <Shield className="w-5 h-5 text-blue-900"/> Contacto de Emergencia Principal
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className={inputContainerClass} style={{ animationDelay: '250ms' }}>
                        <label className={labelClass}>Nombres *</label>
                        <User className="absolute left-0 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors" />
                        <input type="text" name="firstName" className={inputClass} value={activeChild.emergencyContact.firstName || ""} onChange={handleEmergencyChange} required />
                      </div>
                      
                      <div className={inputContainerClass} style={{ animationDelay: '300ms' }}>
                        <label className={labelClass}>Apellidos *</label>
                        <User className="absolute left-0 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors" />
                        <input type="text" name="lastName" className={inputClass} value={activeChild.emergencyContact.lastName || ""} onChange={handleEmergencyChange} required />
                      </div>

                      <div className={inputContainerClass} style={{ animationDelay: '350ms' }}>
                        <label className={labelClass}>Parentesco</label>
                        <UsersRound className="absolute left-1 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors z-10" />
                        <select name="relationship" className={`${inputClass} pl-9 appearance-none cursor-pointer`} value={activeChild.emergencyContact.relationship || "Padre"} onChange={handleEmergencyChange}>
                          {relationshipOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>

                      <div className={inputContainerClass} style={{ animationDelay: '400ms' }}>
                        <label className={labelClass}>Teléfono de Emergencia</label>
                        <Phone className="absolute left-0 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors" />
                        <input type="tel" name="phone" className={inputClass} value={activeChild.emergencyContact.phone || ""} onChange={handleEmergencyChange} />
                      </div>

                      <div className={`${inputContainerClass} md:col-span-2`} style={{ animationDelay: '450ms' }}>
                        <label className={labelClass}>Correo Electrónico (Emergencia)</label>
                        <Mail className="absolute left-0 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors" />
                        <input type="email" name="email" className={inputClass} value={activeChild.emergencyContact.email || ""} onChange={handleEmergencyChange} />
                      </div>

                      <div className={inputContainerClass} style={{ animationDelay: '500ms' }}>
                        <label className={labelClass}>Ciudad (Emergencia)</label>
                        <MapPin className="absolute left-0 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors" />
                        <input type="text" name="city" className={inputClass} value={activeChild.emergencyContact.city || ""} onChange={handleEmergencyChange} />
                      </div>

                      <div className={inputContainerClass} style={{ animationDelay: '550ms' }}>
                        <label className={labelClass}>Dirección (Emergencia)</label>
                        <MapPin className="absolute left-0 top-7 w-5 h-5 text-blue-900/40 group-focus-within:text-blue-900 transition-colors" />
                        <input type="text" name="address" className={inputClass} value={activeChild.emergencyContact.address || ""} onChange={handleEmergencyChange} />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* --- BOTÓN DE GUARDAR FIJO --- */}
        <div className="flex justify-end mt-4 sticky bottom-4 z-50 animate-in slide-in-from-bottom-8 duration-700 delay-300">
          <button 
            type="submit" 
            disabled={isSaving}
            className={`flex items-center gap-3 px-8 py-4 bg-white border-4 border-blue-900 text-blue-950 font-black text-xl rounded-2xl transition-all uppercase tracking-widest shadow-[6px_6px_0_rgba(30,58,138,0.3)] ${
              isSaving 
                ? "opacity-50 cursor-not-allowed bg-blue-50 shadow-none translate-y-1 translate-x-1" 
                : "hover:bg-blue-900 hover:text-white hover:shadow-[2px_2px_0_rgba(30,58,138,0.3)] hover:translate-y-1 hover:translate-x-1"
            }`}
          >
            <Save className={`w-6 h-6 ${isSaving ? "animate-pulse" : ""}`} />
            {isSaving ? "Guardando Cambios..." : "Guardar Ajustes"}
          </button>
        </div>
      </form>

      {/* --- COMPONENTE MODAL --- */}
      <ModalComponent 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        message={modalMessage}
        errorCode={modalErrorCode}
      />
    </div>
  );
};

export default GuardianSettings;