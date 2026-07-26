import { useState, type ChangeEvent, type FormEvent } from "react";
import { User, Mail, Phone, MapPin, Save, Lock, Users, Shield, UsersRound } from "lucide-react";

// --- DATOS SIMULADOS ---
const initialGuardianData = {
  // Solo lectura
  firstName: "Carlos Eduardo",
  lastName: "Gómez",
  documentType: "CC",
  documentNumber: "1020304050",
  
  // Editables (De la tabla contact_info del acudiente)
  email: "carlos.gomez@correo.com",
  phone: "310 987 6543",
  address: "Calle 123 # 45-67, Bogotá",
  city: "Bogotá"
};

// Reflejando la estructura de la tabla emergency_contacts
const mockChildrenDb = [
  {
    id: "ST1",
    name: "Camilo Andrés Gómez Silva",
    course: "1101",
    // Datos de la tabla contact_info del estudiante
    phone: "300 123 4567",
    address: "Calle 123 # 45-67, Bogotá",
    city: "Bogotá",
    // Datos de la tabla emergency_contacts
    emergencyContact: {
      firstName: "Carlos Eduardo",
      lastName: "Gómez",
      relationship: "Padre",
      email: "carlos.gomez@correo.com",
      phone: "310 987 6543",
      city: "Bogotá",
      address: "Calle 123 # 45-67, Bogotá"
    }
  },
  {
    id: "ST2",
    name: "Ana Sofía Gómez Silva",
    course: "802",
    phone: "301 234 5678",
    address: "Calle 123 # 45-67, Bogotá",
    city: "Bogotá",
    emergencyContact: {
      firstName: "Marta",
      lastName: "Silva",
      relationship: "Madre",
      email: "marta.silva@correo.com",
      phone: "312 345 6789",
      city: "Bogotá",
      address: "Calle 123 # 45-67, Bogotá"
    }
  }
];

// Opciones basadas en el ENUM "relationships" de la BD
const relationshipOptions = [
  "Padre", "Madre", "Tio", "Tia", "Abuelo", "Abuela", 
  "Hermano", "Hermana", "Padrastro", "Madrastra", 
  "Amigo", "Amiga", "Acudiente"
];

const GuardianSettings = () => {
  const [activeTab, setActiveTab] = useState<"GUARDIAN" | "STUDENTS">("GUARDIAN");
  const [isSaving, setIsSaving] = useState(false);
  
  const [guardianData, setGuardianData] = useState(initialGuardianData);
  const [selectedChildId, setSelectedChildId] = useState(mockChildrenDb[0].id);
  const [childrenData, setChildrenData] = useState(mockChildrenDb);

  // --- MANEJADORES ---
  const handleGuardianChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuardianData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    console.log("Guardando actualización de datos:", { guardianData, childrenData });
    setTimeout(() => {
      alert("¡Los datos de contacto han sido actualizados exitosamente en la base de datos!");
      setIsSaving(false);
    }, 1200);
  };

  const activeChild = childrenData.find(c => c.id === selectedChildId) || childrenData[0];

  // --- CLASES CSS ---
  const bentoCardClass = "border-2 border-blue-900/60 rounded-3xl p-6 bg-transparent flex flex-col gap-4 relative transition-colors";
  const labelClass = "text-[11px] font-bold text-blue-900/70 uppercase tracking-widest mb-1 block";
  const inputClass = "w-full bg-transparent border-b-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 py-1 font-medium transition-all";
  const readOnlyInputClass = "w-full bg-blue-900/5 border-b-2 border-blue-900/10 text-blue-900/60 py-1 px-2 rounded-t-md font-bold cursor-not-allowed";
  const selectClass = "w-full bg-white border-2 border-blue-900/30 border-dashed focus:border-solid focus:border-blue-900 outline-none text-blue-950 px-4 py-2 font-black rounded-xl transition-all appearance-none cursor-pointer";

  return (
    <div className="w-full flex flex-col gap-6 text-blue-950 pb-10 px-2 md:px-4 animate-in fade-in duration-500">
      
      <div className="mb-2">
        <h2 className="text-3xl font-black text-blue-950 mb-2">Ajustes de Cuenta</h2>
        <p className="text-blue-900/70 font-medium">
          Mantenga sus datos de contacto y los de sus acudidos actualizados para recibir notificaciones.
        </p>
      </div>

      <div className="flex bg-blue-900/10 p-1 rounded-2xl w-full sm:w-max">
        <button 
          type="button"
          onClick={() => setActiveTab("GUARDIAN")}
          className={`flex-1 sm:px-8 py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
            activeTab === "GUARDIAN" ? "bg-white shadow-sm text-blue-900" : "text-blue-900/60 hover:text-blue-900"
          }`}
        >
          <User className="w-4 h-4" /> Mis Datos
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab("STUDENTS")}
          className={`flex-1 sm:px-8 py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${
            activeTab === "STUDENTS" ? "bg-white shadow-sm text-blue-900" : "text-blue-900/60 hover:text-blue-900"
          }`}
        >
          <Users className="w-4 h-4" /> Mis Acudidos
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2">
        
        {activeTab === "GUARDIAN" && (
          <div className={`${bentoCardClass} animate-in slide-in-from-left-4`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b-2 border-blue-900/10">
                <div>
                  <label className={labelClass}>Nombre Completo (Acudiente)</label>
                  <div className="relative">
                    <input type="text" className={readOnlyInputClass} value={`${guardianData.firstName} ${guardianData.lastName}`} readOnly />
                    <Lock className="absolute right-2 top-2 w-4 h-4 text-blue-900/30" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Documento de Identidad</label>
                  <div className="relative">
                    <input type="text" className={readOnlyInputClass} value={`${guardianData.documentType} ${guardianData.documentNumber}`} readOnly />
                    <Lock className="absolute right-2 top-2 w-4 h-4 text-blue-900/30" />
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className={labelClass}>Correo Electrónico</label>
                <Mail className="absolute left-0 top-7 w-5 h-5 text-blue-900/50" />
                <input type="email" name="email" className={`${inputClass} pl-8`} value={guardianData.email} onChange={handleGuardianChange} required />
              </div>

              <div className="relative">
                <label className={labelClass}>Teléfono Móvil</label>
                <Phone className="absolute left-0 top-7 w-5 h-5 text-blue-900/50" />
                <input type="tel" name="phone" className={`${inputClass} pl-8`} value={guardianData.phone} onChange={handleGuardianChange} />
              </div>

              <div className="relative">
                <label className={labelClass}>Ciudad</label>
                <MapPin className="absolute left-0 top-7 w-5 h-5 text-blue-900/50" />
                <input type="text" name="city" className={`${inputClass} pl-8`} value={guardianData.city} onChange={handleGuardianChange} />
              </div>

              <div className="relative">
                <label className={labelClass}>Dirección de Residencia</label>
                <MapPin className="absolute left-0 top-7 w-5 h-5 text-blue-900/50" />
                <input type="text" name="address" className={`${inputClass} pl-8`} value={guardianData.address} onChange={handleGuardianChange} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "STUDENTS" && (
          <div className={`${bentoCardClass} animate-in slide-in-from-right-4`}>
            
            <div className="mb-4 p-4 bg-blue-900/5 rounded-2xl border border-blue-900/10">
              <label className={labelClass}>Seleccione el estudiante a actualizar:</label>
              <select className={selectClass} value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)}>
                {mockChildrenDb.map(child => <option key={child.id} value={child.id}>{child.name} (Curso {child.course})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="relative">
                <label className={labelClass}>Teléfono del Estudiante (Opcional)</label>
                <Phone className="absolute left-0 top-7 w-5 h-5 text-blue-900/50" />
                <input type="tel" name="phone" className={`${inputClass} pl-8`} value={activeChild.phone} onChange={handleChildChange} />
              </div>
              <div className="relative">
                <label className={labelClass}>Ciudad</label>
                <MapPin className="absolute left-0 top-7 w-5 h-5 text-blue-900/50" />
                <input type="text" name="city" className={`${inputClass} pl-8`} value={activeChild.city} onChange={handleChildChange} />
              </div>
              <div className="relative md:col-span-2">
                <label className={labelClass}>Dirección de Residencia</label>
                <MapPin className="absolute left-0 top-7 w-5 h-5 text-blue-900/50" />
                <input type="text" name="address" className={`${inputClass} pl-8`} value={activeChild.address} onChange={handleChildChange} />
              </div>

              {/* DATOS DE LA TABLA EMERGENCY_CONTACTS */}
              <div className="md:col-span-2 mt-4 pt-6 border-t-2 border-blue-900/10 border-dashed">
                <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-900"/> Contacto de Emergencia
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className={labelClass}>Nombres *</label>
                    <User className="absolute left-0 top-7 w-5 h-5 text-blue-900/50" />
                    <input type="text" name="firstName" className={`${inputClass} pl-8`} value={activeChild.emergencyContact.firstName} onChange={handleEmergencyChange} required />
                  </div>
                  
                  <div className="relative">
                    <label className={labelClass}>Apellidos *</label>
                    <User className="absolute left-0 top-7 w-5 h-5 text-blue-900/50" />
                    <input type="text" name="lastName" className={`${inputClass} pl-8`} value={activeChild.emergencyContact.lastName} onChange={handleEmergencyChange} required />
                  </div>

                  <div className="relative">
                    <label className={labelClass}>Parentesco</label>
                    <UsersRound className="absolute left-2 top-7 w-5 h-5 text-blue-900/50 z-10" />
                    <select name="relationship" className={`${inputClass} pl-10 appearance-none`} value={activeChild.emergencyContact.relationship} onChange={handleEmergencyChange}>
                      {relationshipOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>

                  <div className="relative">
                    <label className={labelClass}>Teléfono</label>
                    <Phone className="absolute left-0 top-7 w-5 h-5 text-blue-900/50" />
                    <input type="tel" name="phone" className={`${inputClass} pl-8`} value={activeChild.emergencyContact.phone} onChange={handleEmergencyChange} />
                  </div>

                  <div className="relative md:col-span-2">
                    <label className={labelClass}>Correo Electrónico</label>
                    <Mail className="absolute left-0 top-7 w-5 h-5 text-blue-900/50" />
                    <input type="email" name="email" className={`${inputClass} pl-8`} value={activeChild.emergencyContact.email} onChange={handleEmergencyChange} />
                  </div>

                  <div className="relative">
                    <label className={labelClass}>Ciudad</label>
                    <MapPin className="absolute left-0 top-7 w-5 h-5 text-blue-900/50" />
                    <input type="text" name="city" className={`${inputClass} pl-8`} value={activeChild.emergencyContact.city} onChange={handleEmergencyChange} />
                  </div>

                  <div className="relative">
                    <label className={labelClass}>Dirección</label>
                    <MapPin className="absolute left-0 top-7 w-5 h-5 text-blue-900/50" />
                    <input type="text" name="address" className={`${inputClass} pl-8`} value={activeChild.emergencyContact.address} onChange={handleEmergencyChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-2 sticky bottom-4 z-50">
          <button 
            type="submit" 
            disabled={isSaving}
            className={`flex items-center gap-3 px-8 py-4 bg-white border-4 border-blue-900 text-blue-950 font-black text-xl rounded-2xl transition-all uppercase tracking-widest shadow-[6px_6px_0_rgba(30,58,138,0.3)] ${
              isSaving 
                ? "opacity-50 cursor-not-allowed bg-blue-50" 
                : "hover:bg-blue-900 hover:text-white hover:shadow-[2px_2px_0_rgba(30,58,138,0.3)] hover:translate-y-1 hover:translate-x-1"
            }`}
          >
            <Save className="w-6 h-6" />
            {isSaving ? "Guardando Cambios..." : "Guardar Ajustes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuardianSettings;