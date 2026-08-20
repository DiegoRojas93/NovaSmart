import { useState } from "react";
import FormInscription from "../../Roles/Admin/FormInscription";
import Dashboard from "../../Roles/Admin/Dashboard";
import ProfileEditing from "@/Roles/Admin/ProfileEditing";
import AcademicsDashboard from "@/Roles/Admin/AcademicsDashboard";
import AcademicsCreationForm from "@/Roles/Admin/AcademicsCreationForm";
import TeacherForm from "@/Roles/Admin/TeacherForm";
import StudentForm from "@/Roles/Admin/StudentForm";
import GuardianForm from "@/Roles/Admin/GuardianForm";

import StudentEnrollmentForm from "@/Roles/Admin/StudentEnrollmentForm";
import InstitutionProfileForm from "@/Roles/Admin/InstitutionProfileForm";
import AcademicPeriodManager from "@/Roles/Admin/AcademicPeriodManager";
import GlobalAttendanceReport from "@/Roles/Admin/GlobalAttendanceReport";
import GlobalGradesReport from "@/Roles/Admin/GlobalGradesReport";
import FamilyLinksManager from "@/Roles/Admin/FamilyLinksManager";
import TeacherDashboard from "@/Roles/Teacher/TeacherDashboard";
import TeacherAttendance from "@/Roles/Teacher/TeacherAttendance";
import TeacherClasses from "@/Roles/Teacher/TeacherClasses";
import TeacherGrades from "@/Roles/Teacher/TeacherGrades";
import TeacherAssignments from "@/Roles/Teacher/TeacherAssignments";
import TeacherSubmissions from "@/Roles/Teacher/TeacherSubmissions";
import StudentDashboard from "@/Roles/Student/StudentDashboard";
import StudentSchedule from "@/Roles/Student/StudentSchedule";
import StudentPendingTasks from "@/Roles/Student/StudentPendingTasks";
import StudentSubmittedTasks from "@/Roles/Student/StudentSubmittedTasks";
import StudentGrades from "@/Roles/Student/StudentGrades";
import StudentAttendance from "@/Roles/Student/StudentAttendance";

import GuardianGrades from "@/Roles/Guardian/GuardianGrades";
import GuardianSettings from "@/Roles/Guardian/GuardianSettings";
import GuardianDashboard from "@/Roles/Guardian/GuardianDashboard";
import PersonnelManager from "@/Roles/Admin/PersonnelManager";
import ScheduleManager from "@/Roles/Admin/ScheduleManager";
import TeacherClassManager from "@/Roles/Teacher/TeacherClassManager";

interface institutionInfo {
  id: number;
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

interface userInfo {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  username: string;
  password: string;
  admin: boolean;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

interface roleInfo {
  id: number;
  name: string;
}

interface contactInfo {
  id: number;
  documentType: string;
  identification: string;
  email: string;
  phoneNumber: string;
  city: string;
  address: string;
  userId: number;
}
interface emergencyContactInfo {
  id: number;
  documentType: string;
  identification: string;
  email: string;
  phoneNumber: string;
  city: string;
  address: string;
  userId: number;
}

interface SliderProps {
  institutionInfo: institutionInfo;
  userInfo: userInfo;
  roleInfo: roleInfo;
  contactInfo: contactInfo;
  emergencyContactInfo: emergencyContactInfo;
  logoUrl: string;
  bannerUrl: string;
  photoUrl: string;
  sections: string[];
  // --- AGREGAMOS EL PROP A LA INTERFAZ ---
  onRefresh?: () => void;
}

const Sheet = ({ institutionInfo, userInfo, roleInfo, contactInfo, emergencyContactInfo, logoUrl, bannerUrl, photoUrl, sections, onRefresh }: SliderProps) => {

  const [activeTab, setActiveTab] = useState(0);

  // Mapeo dinámico: decide qué componente cargar según el nombre de la sección
  const renderSectionContent = (sectionName: string) => {
    switch (sectionName) {

      // Admin

      case "Perfil de la Institución":
        return <InstitutionProfileForm 
                 initialIntitutionData={ institutionInfo } 
                 logoUrl={ logoUrl } 
                 bannerUrl={ bannerUrl } 
                 onRefresh={ onRefresh }
               />; 
      case "Periodos Académicos":
        return <AcademicPeriodManager/>; 
      case "Formulario de inscripción":
        // return <FormInscription />; 
        return <PersonnelManager institutionId={ institutionInfo.id } />
      case "Dashboard":
        return <Dashboard institutionId={ institutionInfo.id } />;
      case "Formulario de actualización":
        return <ProfileEditing />;
      case "Vínculos Familiares":
        return <FamilyLinksManager />;
      case "Dashboard 2":
        return <AcademicsDashboard institutionId={ institutionInfo.id } />;
      case "Creación y asignación academica":
        return <AcademicsCreationForm />;
      // case "Docentes: Formulario de inscripción":
      //   return <TeacherForm />;
      // case "Estudiantes: Formulario de inscripción":
      //   return <StudentForm />;
      // case "Acudiente: Formulario de inscripción":
      //   return <GuardianForm />;
      case "Horarios: Docentes":
        return <ScheduleManager institutionId={ institutionInfo.id } />;
      case "Horarios: Estudientes":
        return <StudentEnrollmentForm institutionId={ institutionInfo.id } />;
      case "Asistencia Global":
        return <GlobalAttendanceReport institutionId={ institutionInfo.id } />;
      case "Calificaciones":
        return <GlobalGradesReport institutionId={ institutionInfo.id } />;

      // Personal Docente

      case "Dashboard Docente":
        return <TeacherDashboard institutionId={ institutionInfo.id } teacherId={ roleInfo.id } />;
      case "Toma de Asistencia":
        // return <TeacherAttendance />;
        return <TeacherClassManager institutionId={ institutionInfo.id } teacherId={ roleInfo.id } />;
      // case "Mis clases":
      //   return <TeacherClasses />;
      case "Registro de Calificaciones":
        return <TeacherGrades institutionId={ institutionInfo.id } teacherId={ roleInfo.id } />;
      case "Asignar Tareas":
        return <TeacherAssignments institutionId={ institutionInfo.id } teacherId={ roleInfo.id } />;
      case "Calificar Entregas":
        return <TeacherSubmissions institutionId={ institutionInfo.id } teacherId={ roleInfo.id } />;

      // Estudiante

      case "Resumen de Hoy":
        return <StudentDashboard institutionId={ institutionInfo.id } studentId={ userInfo.id } />;
      // case "Horario Semanal":
      //   return <StudentSchedule />;
      case "Pendientes":
        return <StudentPendingTasks institutionId={ institutionInfo.id } studentId={ userInfo.id }/>;
      case "Entregados":
        return <StudentSubmittedTasks institutionId={ institutionInfo.id } studentId={ userInfo.id } />;
      case "Mis Calificaciones":
        return <StudentGrades institutionId={ institutionInfo.id } studentId={ userInfo.id } />;
      case "Mi Asistencia":
        return <StudentAttendance institutionId={ institutionInfo.id } studentId={ userInfo.id } />;

      // Acudientes

      case "Resumen de estudiantes":
        return <GuardianDashboard guardianId={ userInfo.id }/>;
      case "Boletines":
        return <GuardianGrades institutionId={ institutionInfo.id } guardianId={ userInfo.id } />;
      case "Actualizar Datos":
        return <GuardianSettings guardianId={ userInfo.id } profileImage={ photoUrl } />;

      default:
        return <div className="p-4 text-blue-900/70 font-medium">Aún no hay contenido asignado para esta sección.</div>;
    }
  };

  if (!sections || sections.length === 0) {
    return <div className="text-blue-900/70 italic text-center mt-10">Esta vista no tiene secciones configuradas.</div>;
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden text-blue-950">
      
      {/* 1. TABS (PESTAÑAS) */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex flex-wrap gap-2 border-b-2 border-blue-900/30 pb-2">
          {sections.map((sectionName, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`text-base md:text-lg font-bold px-4 py-2 rounded-t-lg transition-all ${
                activeTab === index
                  ? "bg-blue-900 text-white shadow-[2px_-2px_0_rgba(30,58,138,0.3)]"
                  : "text-blue-900/60 hover:bg-blue-900/10 hover:text-blue-900"
              }`}
            >
              {sectionName}
            </button>
          ))}
        </div>
      </div>

      {/* 2. PISTA DEL SLIDER */}
      <div className="w-full flex-1 relative overflow-hidden">
        <div
          className="h-full flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ 
            width: `${sections.length * 100}%`, 
            transform: `translateX(-${(activeTab / sections.length) * 100}%)` 
          }}
        >
          
          {/* 3. VISTAS INTERNAS DINÁMICAS */}
          {sections.map((sectionName, index) => (
            <div 
              key={index} 
              style={{ width: `${100 / sections.length}%` }} 
              className="h-full flex-shrink-0 overflow-y-auto no-scrollbar pr-4 pb-10"
            >
              {renderSectionContent(sectionName)}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Sheet;