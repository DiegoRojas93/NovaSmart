// import { useState } from "react"
// import { Bar, BarChart, CartesianGrid, XAxis, Area, AreaChart, Pie, PieChart, Cell } from "recharts"
// import { BookOpen, MapPin, CalendarDays, Layers, LayoutDashboard, NotebookPen, FileText, Home, Clock, Search } from "lucide-react"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// // --- DATOS DE PRUEBA BASADOS EN LA BASE DE DATOS ---

// const scheduleData = [
//   { dia: "Lunes", clases: 45 },
//   { dia: "Martes", clases: 52 },
//   { dia: "Miércoles", clases: 48 },
//   { dia: "Jueves", clases: 55 },
//   { dia: "Viernes", clases: 35 },
//   { dia: "Sábado", clases: 8 },
// ]

// const subjectsPerGrade = [
//   { grado: "Sexto", materias: 10 },
//   { grado: "Séptimo", materias: 10 },
//   { grado: "Octavo", materias: 12 },
//   { grado: "Noveno", materias: 12 },
//   { grado: "Décimo", materias: 14 },
//   { grado: "Once", materias: 15 },
// ]

// // Añadida la propiedad docenteFoto
// const recentAssignments = [
//   { id: 1, materia: "MAT-101 (Cálculo)", docente: "Carlos Pérez", docenteFoto: "https://i.pravatar.cc/150?u=carlos", aula: "Lab. Sistemas", horario: "Lun, Mié 08:00 - 10:00" },
//   { id: 2, materia: "FIS-201 (Física I)", docente: "Ana Gómez", docenteFoto: "https://i.pravatar.cc/150?u=ana_g", aula: "Aula 302", horario: "Mar, Jue 10:30 - 12:30" },
//   { id: 3, materia: "HIS-105 (Historia)", docente: "Luis Rodríguez", docenteFoto: "", aula: "Aula 101", horario: "Vie 07:00 - 09:00" }, // Sin foto para probar el Fallback
//   { id: 4, materia: "QUI-301 (Química)", docente: "Marta Silva", docenteFoto: "https://i.pravatar.cc/150?u=marta", aula: "Lab. Química", horario: "Lun, Jue 14:00 - 16:00" },
// ]

// const activitiesDistribution = [
//   { tipo: "Trabajos en Clase", cantidad: 340, fill: "#1e3a8a" },
//   { tipo: "Tareas en Casa", cantidad: 185, fill: "#3b82f6" },
// ]

// const submissionStatus = [
//   { estado: "Calificados", cantidad: 850, fill: "#22c55e" },
//   { estado: "Entregados", cantidad: 320, fill: "#3b82f6" },
//   { estado: "Pendientes", cantidad: 145, fill: "#f59e0b" },
//   { estado: "No Entregados", cantidad: 65, fill: "#ef4444" },
// ]

// const recentActivities = [
//   { id: 101, titulo: "Taller de Derivadas", materia: "Cálculo 11°", tipo: "CLASSWORK", vence: "Hoy, 23:59" },
//   { id: 102, titulo: "Ensayo Revolución Francesa", materia: "Historia 8°", tipo: "HOMEWORK", vence: "Mañana, 18:00" },
//   { id: 103, titulo: "Laboratorio Movimiento", materia: "Física 10°", tipo: "CLASSWORK", vence: "Jueves, 12:00" },
//   { id: 104, titulo: "Reading Comprehension", materia: "Inglés 9°", tipo: "HOMEWORK", vence: "Viernes, 23:59" },
// ]

// const areaChartConfig = { clases: { label: "Clases", color: "#1e3a8a" } } satisfies ChartConfig
// const barChartConfig = { materias: { label: "Materias", color: "#1e3a8a" } } satisfies ChartConfig
// const pieActivitiesConfig = { cantidad: { label: "Actividades" } } satisfies ChartConfig
// const pieSubmissionsConfig = { cantidad: { label: "Entregas" } } satisfies ChartConfig

// const AcademicsDashboard = () => {
//   // --- ESTADOS ---
//   const [activeTab, setActiveTab] = useState<"STRUCTURE" | "ACTIVITIES">("STRUCTURE");
//   const [searchTerm, setSearchTerm] = useState("");

//   const cardAnimationClass = "bg-transparent border-2 border-blue-900/20 shadow-none transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-900/40 animate-in fade-in slide-in-from-bottom-4 fill-mode-both rounded-3xl";

//   // Función para obtener iniciales
//   const getInitials = (name: string) => {
//     return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
//   };

//   // Lógica de filtrado
//   const filteredAssignments = recentAssignments.filter(row => 
//     row.materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     row.docente.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     row.aula.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col gap-6 p-2 md:p-4 text-blue-950 overflow-hidden">
      
//       {/* CABECERA */}
//       <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-700">
//         <h2 className="text-3xl font-black tracking-tight text-blue-950 mb-1">Gestión Académica</h2>
//         <p className="text-blue-900/70 font-medium">Resumen de aulas, horarios, asignaturas y seguimiento de actividades.</p>
//       </div>

//       {/* --- SELECTOR DE PESTAÑAS --- */}
//       <div className="flex bg-blue-900/10 p-1 rounded-2xl w-full sm:w-max animate-in fade-in zoom-in-95 duration-500 mb-2">
//         <button 
//           type="button"
//           onClick={() => setActiveTab("STRUCTURE")}
//           className={`flex-1 sm:px-8 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest ${
//             activeTab === "STRUCTURE" ? "bg-white shadow-sm text-blue-900 scale-100" : "text-blue-900/60 hover:text-blue-900 scale-95 hover:scale-100 hover:bg-blue-900/5"
//           }`}
//         >
//           <LayoutDashboard className="w-4 h-4" /> Estructura General
//         </button>
//         <button 
//           type="button"
//           onClick={() => setActiveTab("ACTIVITIES")}
//           className={`flex-1 sm:px-8 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest ${
//             activeTab === "ACTIVITIES" ? "bg-white shadow-sm text-blue-900 scale-100" : "text-blue-900/60 hover:text-blue-900 scale-95 hover:scale-100 hover:bg-blue-900/5"
//           }`}
//         >
//           <NotebookPen className="w-4 h-4" /> Actividades & Tareas
//         </button>
//       </div>

//       {/* =========================================================
//           PESTAÑA 1: ESTRUCTURA (Horarios, Aulas, Materias)
//       ========================================================= */}
//       {activeTab === "STRUCTURE" && (
//         <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          
//           {/* TARJETAS KPI */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             <Card className={cardAnimationClass} style={{ animationDelay: '100ms' }}>
//               <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//                 <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Asignaturas Activas</CardTitle>
//                 <div className="p-2 bg-blue-900/5 rounded-xl">
//                   <BookOpen className="h-5 w-5 text-blue-900" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-4xl font-black text-blue-950">42</div>
//                 <div className="flex items-center text-xs font-bold mt-2 text-blue-900/50">
//                   En el pénsum institucional
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className={cardAnimationClass} style={{ animationDelay: '150ms' }}>
//               <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//                 <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Aulas Registradas</CardTitle>
//                 <div className="p-2 bg-blue-900/5 rounded-xl">
//                   <MapPin className="h-5 w-5 text-blue-900" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-4xl font-black text-blue-950">28</div>
//                 <div className="flex items-center text-xs font-bold mt-2 text-blue-900/50">
//                   Repartidas en 3 edificios
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className={cardAnimationClass} style={{ animationDelay: '200ms' }}>
//               <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//                 <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Periodo Vigente</CardTitle>
//                 <div className="p-2 bg-blue-900/5 rounded-xl">
//                   <CalendarDays className="h-5 w-5 text-blue-900" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-4xl font-black text-blue-950">2026-I</div>
//                 <div className="flex items-center text-xs font-bold mt-2 text-blue-900/50">
//                   Finaliza: 30 de Junio
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className={cardAnimationClass} style={{ animationDelay: '250ms' }}>
//               <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//                 <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Niveles Configurados</CardTitle>
//                 <div className="p-2 bg-blue-900/5 rounded-xl">
//                   <Layers className="h-5 w-5 text-blue-900" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-4xl font-black text-blue-950">11</div>
//                 <div className="flex items-center text-xs font-bold mt-2 text-blue-900/50">
//                   Grados escolares
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* GRÁFICAS */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card className={cardAnimationClass} style={{ animationDelay: '300ms' }}>
//               <CardHeader>
//                 <CardTitle className="text-xl font-extrabold text-blue-950">Carga Horaria Semanal</CardTitle>
//                 <CardDescription className="text-blue-900/60 font-medium">Volumen de clases programadas por día.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ChartContainer config={areaChartConfig} className="min-h-[250px] w-full">
//                   <AreaChart data={scheduleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                     <defs>
//                       <linearGradient id="fillClases" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="var(--color-clases)" stopOpacity={0.3} />
//                         <stop offset="95%" stopColor="var(--color-clases)" stopOpacity={0} />
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid vertical={false} stroke="#1e3a8a" strokeDasharray="3 3" opacity={0.2} />
//                     <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} stroke="#1e3a8a" tickFormatter={(val) => val.slice(0,3)} fontSize={12} fontWeight="bold" />
//                     <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
//                     <Area type="bump" dataKey="clases" stroke="var(--color-clases)" strokeWidth={3} fillOpacity={1} fill="url(#fillClases)" />
//                   </AreaChart>
//                 </ChartContainer>
//               </CardContent>
//             </Card>

//             <Card className={cardAnimationClass} style={{ animationDelay: '350ms' }}>
//               <CardHeader>
//                 <CardTitle className="text-xl font-extrabold text-blue-950">Densidad del Pénsum</CardTitle>
//                 <CardDescription className="text-blue-900/60 font-medium">Cantidad de asignaturas exigidas por grado.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ChartContainer config={barChartConfig} className="min-h-[250px] w-full">
//                   <BarChart data={subjectsPerGrade} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                     <CartesianGrid vertical={false} stroke="#1e3a8a" strokeDasharray="3 3" opacity={0.2} />
//                     <XAxis dataKey="grado" tickLine={false} tickMargin={12} axisLine={false} stroke="#1e3a8a" fontSize={12} fontWeight="bold" />
//                     <ChartTooltip cursor={{fill: '#f1f5f9'}} content={<ChartTooltipContent hideLabel />} />
//                     <Bar dataKey="materias" fill="var(--color-materias)" radius={[6, 6, 0, 0]} maxBarSize={50} />
//                   </BarChart>
//                 </ChartContainer>
//               </CardContent>
//             </Card>
//           </div>

//           {/* TABLA CON FILTRO: ASIGNACIONES RECIENTES */}
//           <Card className={cardAnimationClass} style={{ animationDelay: '400ms' }}>
//             <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//               <div>
//                 <CardTitle className="text-xl font-extrabold text-blue-950">Estructura de Clases</CardTitle>
//                 <CardDescription className="text-blue-900/60 font-medium">Cruce de asignaturas, docentes, aulas y horarios en el periodo vigente.</CardDescription>
//               </div>

//               {/* BUSCADOR */}
//               <div className="relative w-full sm:w-64 shrink-0">
//                 <Search className="absolute left-3 top-2.5 w-4 h-4 text-blue-900/40" />
//                 <input 
//                   type="text" 
//                   placeholder="Buscar clase, docente o aula..."
//                   className="w-full bg-blue-900/5 border-2 border-blue-900/10 focus:border-blue-900 outline-none text-blue-950 py-2 pl-9 pr-3 rounded-xl text-sm font-bold transition-all shadow-sm"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader className="border-b-2 border-blue-900/10">
//                     <TableRow className="hover:bg-transparent border-none">
//                       <TableHead className="font-bold text-blue-950">Asignatura</TableHead>
//                       <TableHead className="font-bold text-blue-950">Docente Titular</TableHead>
//                       <TableHead className="font-bold text-blue-950">Ubicación</TableHead>
//                       <TableHead className="font-bold text-blue-950 text-right">Horario Base</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredAssignments.length > 0 ? (
//                       filteredAssignments.map((row) => (
//                         <TableRow key={row.id} className="border-b border-blue-900/5 hover:bg-blue-900/5 transition-colors group">
//                           <TableCell className="font-bold text-blue-950">{row.materia}</TableCell>
                          
//                           {/* CELDA MODIFICADA: Ahora incluye el Avatar del Docente */}
//                           <TableCell className="text-blue-900/70 font-bold">
//                             <div className="flex items-center gap-3 py-1">
//                               <Avatar className="h-8 w-8 border-2 border-blue-900/10 group-hover:border-blue-900/30 transition-colors">
//                                 <AvatarImage src={row.docenteFoto} alt={row.docente} />
//                                 <AvatarFallback className="bg-blue-900/5 text-blue-900 font-bold text-[10px]">
//                                   {getInitials(row.docente)}
//                                 </AvatarFallback>
//                               </Avatar>
//                               {row.docente}
//                             </div>
//                           </TableCell>

//                           <TableCell className="text-blue-900/70 font-bold">
//                             <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {row.aula}</span>
//                           </TableCell>
//                           <TableCell className="text-right text-blue-900/70 font-bold">{row.horario}</TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={4} className="h-32 text-center border-none">
//                           <div className="flex flex-col items-center justify-center text-blue-900/40 animate-in zoom-in-95">
//                             <Search className="w-8 h-8 mb-2 opacity-50" />
//                             <p className="font-bold">No se encontraron resultados para "{searchTerm}"</p>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* =========================================================
//           PESTAÑA 2: ACTIVIDADES Y TAREAS
//       ========================================================= */}
//       {activeTab === "ACTIVITIES" && (
//         <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-right-4 duration-500">
          
//           {/* GRÁFICAS DE DONA Y ESTADO */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
//             <Card className={`${cardAnimationClass} flex flex-col`} style={{ animationDelay: '100ms' }}>
//               <CardHeader className="pb-0">
//                 <CardTitle className="text-xl font-extrabold text-blue-950">Tipo de Actividades</CardTitle>
//                 <CardDescription className="text-blue-900/60 font-medium">Trabajo en clase vs Tareas asignadas</CardDescription>
//               </CardHeader>
//               <CardContent className="flex-1 pb-4 flex flex-col items-center justify-center">
//                 <ChartContainer config={pieActivitiesConfig} className="w-full aspect-square max-h-[260px]">
//                   <PieChart>
//                     <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
//                     <Pie data={activitiesDistribution} dataKey="cantidad" nameKey="tipo" innerRadius={70} strokeWidth={2} stroke="transparent" className="transition-opacity hover:opacity-90">
//                       {activitiesDistribution.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.fill} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ChartContainer>
//               </CardContent>
//             </Card>

//             <Card className={`${cardAnimationClass} flex flex-col`} style={{ animationDelay: '150ms' }}>
//               <CardHeader className="pb-0">
//                 <CardTitle className="text-xl font-extrabold text-blue-950">Estado de Entregas</CardTitle>
//                 <CardDescription className="text-blue-900/60 font-medium">Seguimiento global de cumplimiento estudiantil</CardDescription>
//               </CardHeader>
//               <CardContent className="flex-1 pb-4 flex flex-col items-center justify-center">
//                 <ChartContainer config={pieSubmissionsConfig} className="w-full aspect-square max-h-[260px]">
//                   <PieChart>
//                     <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
//                     <Pie data={submissionStatus} dataKey="cantidad" nameKey="estado" innerRadius={70} strokeWidth={2} stroke="transparent" className="transition-opacity hover:opacity-90">
//                       {submissionStatus.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.fill} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ChartContainer>
//               </CardContent>
//             </Card>
//           </div>

//           {/* TABLA: ACTIVIDADES RECIENTES */}
//           <Card className={cardAnimationClass} style={{ animationDelay: '200ms' }}>
//             <CardHeader>
//               <CardTitle className="text-xl font-extrabold text-blue-950">Actividades Recientes Publicadas</CardTitle>
//               <CardDescription className="text-blue-900/60 font-medium">Últimos trabajos y tareas creados por el cuerpo docente.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader className="border-b-2 border-blue-900/10">
//                     <TableRow className="hover:bg-transparent border-none">
//                       <TableHead className="font-bold text-blue-950">Título de la Actividad</TableHead>
//                       <TableHead className="font-bold text-blue-950 hidden sm:table-cell">Asignatura</TableHead>
//                       <TableHead className="font-bold text-blue-950 text-center">Tipo</TableHead>
//                       <TableHead className="font-bold text-blue-950 text-right">Vencimiento</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {recentActivities.map((row) => (
//                       <TableRow key={row.id} className="border-b border-blue-900/5 hover:bg-blue-900/5 transition-colors">
//                         <TableCell className="font-bold text-blue-950">
//                           <div className="flex items-center gap-2">
//                             <FileText className="w-4 h-4 text-blue-900/40" />
//                             {row.titulo}
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-blue-900/70 font-bold hidden sm:table-cell">{row.materia}</TableCell>
//                         <TableCell className="text-center">
//                           {row.tipo === "CLASSWORK" ? (
//                             <Badge variant="outline" className="bg-blue-900/5 text-blue-900 border-blue-900/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1 gap-1 shadow-none">
//                               <Home className="w-3 h-3" /> Clase
//                             </Badge>
//                           ) : (
//                             <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1 gap-1 shadow-none">
//                               <NotebookPen className="w-3 h-3" /> Tarea
//                             </Badge>
//                           )}
//                         </TableCell>
//                         <TableCell className="text-right text-blue-900/70 font-bold">
//                           <span className="flex items-center justify-end gap-1.5"><Clock className="w-3.5 h-3.5" /> {row.vence}</span>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//     </div>
//   )
// }

// export default AcademicsDashboard

import { useState, useEffect, useCallback } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Area, AreaChart, Pie, PieChart, Cell } from "recharts"
import { BookOpen, MapPin, CalendarDays, Layers, LayoutDashboard, NotebookPen, FileText, Home, Clock, Search, Loader2, Filter } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// --- INTERFACES DEL BACKEND ---
interface Props {
  institutionId: number;
}

interface FilterOption { id: string; name: string; }
interface Kpis { activeSubjects: number; registeredClassrooms: number; currentPeriod: string; configuredLevels: number; }
interface ScheduleChart { dia: string; clases: number; }
interface SubjectsPerGrade { grado: string; materias: number; }
interface RecentAssignment { id: number; materia: string; docente: string; docenteFoto: string | null; aula: string; horario: string; }
interface ActivityDistribution { tipo: string; cantidad: number; fill: string; }
interface SubmissionStatus { estado: string; cantidad: number; fill: string; }
interface RecentActivity { id: number; titulo: string; materia: string; tipo: string; vence: string; }

interface StructureData {
  kpis: Kpis;
  scheduleData: ScheduleChart[];
  subjectsPerGrade: SubjectsPerGrade[];
  recentAssignments: RecentAssignment[];
  availableGrades: FilterOption[];
  availableSubjects: FilterOption[];
}

interface ActivitiesData {
  activitiesDistribution: ActivityDistribution[];
  submissionStatus: SubmissionStatus[];
  recentActivities: RecentActivity[];
}

// --- CONFIGURACIÓN SHADCN CHARTS ---
const areaChartConfig = { clases: { label: "Clases", color: "#1e3a8a" } } satisfies ChartConfig
const barChartConfig = { materias: { label: "Materias", color: "#1e3a8a" } } satisfies ChartConfig
const pieActivitiesConfig = { cantidad: { label: "Actividades" } } satisfies ChartConfig
const pieSubmissionsConfig = { cantidad: { label: "Entregas" } } satisfies ChartConfig

const AcademicsDashboard = ({ institutionId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState<"STRUCTURE" | "ACTIVITIES">("STRUCTURE");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados de Datos
  const [structureData, setStructureData] = useState<StructureData | null>(null);
  const [activitiesData, setActivitiesData] = useState<ActivitiesData | null>(null);
  
  // Estados de Carga
  const [isLoadingStructure, setIsLoadingStructure] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // Estados de Filtros Dinámicos
  const [selectedGrade, setSelectedGrade] = useState("ALL");
  const [selectedSubject, setSelectedSubject] = useState("ALL");

  // --- FETCH 1: CARGA INICIAL (Estructura y Filtros) ---
  const fetchStructure = useCallback(async () => {
    if (!institutionId) return;
    setIsLoadingStructure(true);
    try {
      const res = await fetch(`${apiUrl}/academics-dashboard/${institutionId}/structure`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStructureData(data);
      }
    } catch (error) {
      console.error("Error cargando estructura académica:", error);
    } finally {
      setIsLoadingStructure(false);
    }
  }, [institutionId, apiUrl]);

  // --- FETCH 2: CARGA DINÁMICA (Actividades Filtradas) ---
  const fetchActivities = useCallback(async () => {
    if (!institutionId) return;
    setIsLoadingActivities(true);
    try {
      // Construimos la URL con los parámetros dinámicos si no son "ALL"
      const url = new URL(`${apiUrl}/academics-dashboard/${institutionId}/activities`);
      if (selectedGrade !== "ALL") url.searchParams.append("gradeId", selectedGrade);
      if (selectedSubject !== "ALL") url.searchParams.append("subjectId", selectedSubject);

      const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setActivitiesData(data);
      }
    } catch (error) {
      console.error("Error cargando actividades:", error);
    } finally {
      setIsLoadingActivities(false);
    }
  }, [institutionId, apiUrl, selectedGrade, selectedSubject]);

  // Ejecutar Fetch 1 al montar
  useEffect(() => {
    fetchStructure();
  }, [fetchStructure]);

  // Ejecutar Fetch 2 cuando cambian los filtros
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // --- AYUDANTES ---
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const getPhotoUrl = (photo: string | null) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    return `${apiUrl}/files/${photo}`;
  };

  const cardAnimationClass = "bg-transparent border-2 border-blue-900/20 shadow-none transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-900/40 animate-in fade-in slide-in-from-bottom-4 fill-mode-both rounded-3xl";
  const selectClass = "w-full bg-white border-2 border-blue-900/20 focus:border-blue-900 outline-none text-blue-950 px-4 py-2 font-black rounded-xl transition-all appearance-none cursor-pointer";

  // --- PANTALLA DE CARGA GLOBAL ---
  if (isLoadingStructure || !structureData) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-blue-900/50">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h3 className="text-xl font-black">Cargando Gestión Académica...</h3>
        <p className="font-medium">Sincronizando información con la base de datos</p>
      </div>
    );
  }

  // Búsqueda local en Estructura de Clases
  const filteredAssignments = structureData.recentAssignments.filter(row => 
    row.materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.docente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.aula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-2 md:p-4 text-blue-950 overflow-hidden">
      
      {/* CABECERA */}
      <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-700">
        <h2 className="text-3xl font-black tracking-tight text-blue-950 mb-1">Gestión Académica</h2>
        <p className="text-blue-900/70 font-medium">Resumen de aulas, horarios, asignaturas y seguimiento de actividades.</p>
      </div>

      {/* --- SELECTOR DE PESTAÑAS --- */}
      <div className="flex bg-blue-900/10 p-1 rounded-2xl w-full sm:w-max animate-in fade-in zoom-in-95 duration-500 mb-2">
        <button 
          type="button"
          onClick={() => setActiveTab("STRUCTURE")}
          className={`flex-1 sm:px-8 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest ${
            activeTab === "STRUCTURE" ? "bg-white shadow-sm text-blue-900 scale-100" : "text-blue-900/60 hover:text-blue-900 scale-95 hover:scale-100 hover:bg-blue-900/5"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Estructura General
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab("ACTIVITIES")}
          className={`flex-1 sm:px-8 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest ${
            activeTab === "ACTIVITIES" ? "bg-white shadow-sm text-blue-900 scale-100" : "text-blue-900/60 hover:text-blue-900 scale-95 hover:scale-100 hover:bg-blue-900/5"
          }`}
        >
          <NotebookPen className="w-4 h-4" /> Actividades & Tareas
        </button>
      </div>

      {/* =========================================================
          PESTAÑA 1: ESTRUCTURA (Horarios, Aulas, Materias)
      ========================================================= */}
      {activeTab === "STRUCTURE" && (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* TARJETAS KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className={cardAnimationClass} style={{ animationDelay: '100ms' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Asignaturas Activas</CardTitle>
                <div className="p-2 bg-blue-900/5 rounded-xl">
                  <BookOpen className="h-5 w-5 text-blue-900" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-blue-950">{structureData.kpis.activeSubjects}</div>
                <div className="flex items-center text-xs font-bold mt-2 text-blue-900/50">
                  En el pénsum institucional
                </div>
              </CardContent>
            </Card>

            <Card className={cardAnimationClass} style={{ animationDelay: '150ms' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Aulas Registradas</CardTitle>
                <div className="p-2 bg-blue-900/5 rounded-xl">
                  <MapPin className="h-5 w-5 text-blue-900" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-blue-950">{structureData.kpis.registeredClassrooms}</div>
                <div className="flex items-center text-xs font-bold mt-2 text-blue-900/50">
                  Total de salones y laboratorios
                </div>
              </CardContent>
            </Card>

            <Card className={cardAnimationClass} style={{ animationDelay: '200ms' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Periodo Vigente</CardTitle>
                <div className="p-2 bg-blue-900/5 rounded-xl">
                  <CalendarDays className="h-5 w-5 text-blue-900" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-blue-950 truncate">{structureData.kpis.currentPeriod}</div>
                <div className="flex items-center text-xs font-bold mt-2 text-blue-900/50">
                  Ciclo académico actual
                </div>
              </CardContent>
            </Card>

            <Card className={cardAnimationClass} style={{ animationDelay: '250ms' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Niveles Configurados</CardTitle>
                <div className="p-2 bg-blue-900/5 rounded-xl">
                  <Layers className="h-5 w-5 text-blue-900" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-blue-950">{structureData.kpis.configuredLevels}</div>
                <div className="flex items-center text-xs font-bold mt-2 text-blue-900/50">
                  Grados escolares
                </div>
              </CardContent>
            </Card>
          </div>

          {/* GRÁFICAS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={cardAnimationClass} style={{ animationDelay: '300ms' }}>
              <CardHeader>
                <CardTitle className="text-xl font-extrabold text-blue-950">Carga Horaria Semanal</CardTitle>
                <CardDescription className="text-blue-900/60 font-medium">Volumen de clases programadas por día.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={areaChartConfig} className="min-h-[250px] w-full">
                  <AreaChart data={structureData.scheduleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillClases" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-clases)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-clases)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#1e3a8a" strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} stroke="#1e3a8a" tickFormatter={(val) => val.slice(0,3)} fontSize={12} fontWeight="bold" />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Area type="bump" dataKey="clases" stroke="var(--color-clases)" strokeWidth={3} fillOpacity={1} fill="url(#fillClases)" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className={cardAnimationClass} style={{ animationDelay: '350ms' }}>
              <CardHeader>
                <CardTitle className="text-xl font-extrabold text-blue-950">Densidad del Pénsum</CardTitle>
                <CardDescription className="text-blue-900/60 font-medium">Cantidad de asignaturas exigidas por grado.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={barChartConfig} className="min-h-[250px] w-full">
                  <BarChart data={structureData.subjectsPerGrade} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#1e3a8a" strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="grado" tickLine={false} tickMargin={12} axisLine={false} stroke="#1e3a8a" fontSize={12} fontWeight="bold" />
                    <ChartTooltip cursor={{fill: '#f1f5f9'}} content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="materias" fill="var(--color-materias)" radius={[6, 6, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* TABLA: ASIGNACIONES RECIENTES */}
          <Card className={cardAnimationClass} style={{ animationDelay: '400ms' }}>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-extrabold text-blue-950">Estructura de Clases</CardTitle>
                <CardDescription className="text-blue-900/60 font-medium">Cruce de asignaturas, docentes, aulas y horarios en el periodo vigente.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-blue-900/40" />
                <input 
                  type="text" 
                  placeholder="Buscar clase, docente o aula..."
                  className="w-full bg-blue-900/5 border-2 border-blue-900/10 focus:border-blue-900 outline-none text-blue-950 py-2 pl-9 pr-3 rounded-xl text-sm font-bold transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="border-b-2 border-blue-900/10">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="font-bold text-blue-950">Asignatura</TableHead>
                      <TableHead className="font-bold text-blue-950">Docente Titular</TableHead>
                      <TableHead className="font-bold text-blue-950">Ubicación</TableHead>
                      <TableHead className="font-bold text-blue-950 text-right">Horario Base</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.length > 0 ? (
                      filteredAssignments.map((row) => (
                        <TableRow key={row.id} className="border-b border-blue-900/5 hover:bg-blue-900/5 transition-colors group">
                          <TableCell className="font-bold text-blue-950">{row.materia}</TableCell>
                          
                          <TableCell className="text-blue-900/70 font-bold">
                            <div className="flex items-center gap-3 py-1">
                              <Avatar className="h-8 w-8 border-2 border-blue-900/10 group-hover:border-blue-900/30 transition-colors">
                                <AvatarImage src={getPhotoUrl(row.docenteFoto)!} alt={row.docente} />
                                <AvatarFallback className="bg-blue-900/5 text-blue-900 font-bold text-[10px]">
                                  {getInitials(row.docente)}
                                </AvatarFallback>
                              </Avatar>
                              {row.docente}
                            </div>
                          </TableCell>

                          <TableCell className="text-blue-900/70 font-bold">
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {row.aula}</span>
                          </TableCell>
                          <TableCell className="text-right text-blue-900/70 font-bold">{row.horario}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center border-none">
                          <div className="flex flex-col items-center justify-center text-blue-900/40 animate-in zoom-in-95">
                            <Search className="w-8 h-8 mb-2 opacity-50" />
                            <p className="font-bold">No se encontraron resultados para "{searchTerm}"</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* =========================================================
          PESTAÑA 2: ACTIVIDADES Y TAREAS CON FILTROS DINÁMICOS
      ========================================================= */}
      {activeTab === "ACTIVITIES" && (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-right-4 duration-500">
          
          {/* BARRA DE FILTROS SUPERIOR */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-blue-900/5 p-4 rounded-3xl border-2 border-blue-900/10 animate-in zoom-in-95 duration-500">
            <div className="w-full flex items-center justify-center sm:justify-start gap-2 mb-2 sm:mb-0 sm:w-auto px-2">
              <Filter className="w-5 h-5 text-blue-900/50" />
              <span className="text-sm font-black text-blue-900/60 uppercase tracking-widest">Filtros:</span>
            </div>
            
            {/* Filtro Grado Dinámico (Desde BD) */}
            <div className="w-full sm:flex-1">
              <label className="text-[10px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
                <Layers className="w-4 h-4"/> Nivel / Grado Académico:
              </label>
              <select 
                className={selectClass} 
                value={selectedGrade} 
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                <option value="ALL">Todos los grados</option>
                {structureData.availableGrades.map(grade => (
                  <option key={grade.id} value={grade.id}>{grade.name}</option>
                ))}
              </select>
            </div>
            
            {/* Filtro Materia Dinámico (Desde BD) */}
            <div className="w-full sm:flex-1">
              <label className="text-[10px] font-bold text-blue-900/70 uppercase tracking-widest flex items-center gap-1 mb-1">
                <BookOpen className="w-4 h-4"/> Asignatura Específica:
              </label>
              <select 
                className={selectClass} 
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="ALL">Todas las asignaturas</option>
                {structureData.availableSubjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ESTADO DE CARGA AL FILTRAR */}
          {isLoadingActivities || !activitiesData ? (
             <div className="w-full flex flex-col items-center justify-center py-10 text-blue-900/50 animate-in fade-in">
               <Loader2 className="w-10 h-10 animate-spin mb-4" />
               <p className="font-bold">Aplicando filtros y calculando entregas...</p>
             </div>
          ) : (
            <>
              {/* GRÁFICAS DE DONA Y ESTADO */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={`${cardAnimationClass} flex flex-col`} style={{ animationDelay: '100ms' }}>
                  <CardHeader className="pb-0">
                    <CardTitle className="text-xl font-extrabold text-blue-950">Tipo de Actividades</CardTitle>
                    <CardDescription className="text-blue-900/60 font-medium">Trabajo en clase vs Tareas asignadas</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4 flex flex-col items-center justify-center">
                    <ChartContainer config={pieActivitiesConfig} className="w-full aspect-square max-h-[260px]">
                      <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={activitiesData.activitiesDistribution} dataKey="cantidad" nameKey="tipo" innerRadius={70} strokeWidth={2} stroke="transparent" className="transition-opacity hover:opacity-90">
                          {activitiesData.activitiesDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className={`${cardAnimationClass} flex flex-col`} style={{ animationDelay: '150ms' }}>
                  <CardHeader className="pb-0">
                    <CardTitle className="text-xl font-extrabold text-blue-950">Estado de Entregas</CardTitle>
                    <CardDescription className="text-blue-900/60 font-medium">Seguimiento global de cumplimiento estudiantil</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4 flex flex-col items-center justify-center">
                    <ChartContainer config={pieSubmissionsConfig} className="w-full aspect-square max-h-[260px]">
                      <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={activitiesData.submissionStatus} dataKey="cantidad" nameKey="estado" innerRadius={70} strokeWidth={2} stroke="transparent" className="transition-opacity hover:opacity-90">
                          {activitiesData.submissionStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* TABLA: ACTIVIDADES RECIENTES */}
              <Card className={cardAnimationClass} style={{ animationDelay: '200ms' }}>
                <CardHeader>
                  <CardTitle className="text-xl font-extrabold text-blue-950">Actividades Recientes Publicadas</CardTitle>
                  <CardDescription className="text-blue-900/60 font-medium">
                    {selectedGrade !== "ALL" || selectedSubject !== "ALL" 
                      ? "Mostrando resultados de acuerdo a los filtros aplicados."
                      : "Últimos trabajos y tareas creados por el cuerpo docente."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="border-b-2 border-blue-900/10">
                        <TableRow className="hover:bg-transparent border-none">
                          <TableHead className="font-bold text-blue-950">Título de la Actividad</TableHead>
                          <TableHead className="font-bold text-blue-950 hidden sm:table-cell">Asignatura</TableHead>
                          <TableHead className="font-bold text-blue-950 text-center">Tipo</TableHead>
                          <TableHead className="font-bold text-blue-950 text-right">Vencimiento</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activitiesData.recentActivities.length > 0 ? (
                          activitiesData.recentActivities.map((row) => (
                            <TableRow key={row.id} className="border-b border-blue-900/5 hover:bg-blue-900/5 transition-colors">
                              <TableCell className="font-bold text-blue-950">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-blue-900/40" />
                                  {row.titulo}
                                </div>
                              </TableCell>
                              <TableCell className="text-blue-900/70 font-bold hidden sm:table-cell">{row.materia}</TableCell>
                              <TableCell className="text-center">
                                {row.tipo === "CLASSWORK" ? (
                                  <Badge variant="outline" className="bg-blue-900/5 text-blue-900 border-blue-900/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1 gap-1 shadow-none">
                                    <Home className="w-3 h-3" /> Clase
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1 gap-1 shadow-none">
                                    <NotebookPen className="w-3 h-3" /> Tarea
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right text-blue-900/70 font-bold">
                                <span className="flex items-center justify-end gap-1.5"><Clock className="w-3.5 h-3.5" /> {row.vence}</span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="h-32 text-center border-none">
                              <div className="flex flex-col items-center justify-center text-blue-900/40 animate-in zoom-in-95">
                                <Filter className="w-8 h-8 mb-2 opacity-50" />
                                <p className="font-bold">No hay actividades que coincidan con los filtros seleccionados.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

    </div>
  )
}

export default AcademicsDashboard