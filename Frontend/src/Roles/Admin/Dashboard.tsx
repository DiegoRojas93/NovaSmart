// import { useState } from "react"
// import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, Pie, PieChart, Cell } from "recharts"
// import { Users, GraduationCap, BookOpen, UserCheck, Mail, TrendingUp, TrendingDown, LayoutDashboard, Search } from "lucide-react"

// // --- COMPONENTES SHADCN ---
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// // --- DATOS DE PRUEBA BASADOS EN LA BASE DE DATOS ---

// const chartDataEnrollments = [
//   { mes: "Ene", inscripciones: 186 },
//   { mes: "Feb", inscripciones: 305 },
//   { mes: "Mar", inscripciones: 237 },
//   { mes: "Abr", inscripciones: 73 },
//   { mes: "May", inscripciones: 209 },
//   { mes: "Jun", inscripciones: 214 },
// ]

// const chartDataGrades = [
//   { periodo: "Periodo 1", promedio: 3.8 },
//   { periodo: "Periodo 2", promedio: 4.1 },
//   { periodo: "Periodo 3", promedio: 3.9 },
//   { periodo: "Periodo 4", promedio: 4.5 },
// ]

// const chartDataRoles = [
//   { rol: "Estudiantes", cantidad: 450, fill: "#1e3a8a" },
//   { rol: "Acudientes", cantidad: 380, fill: "#3b82f6" },
//   { rol: "Docentes", cantidad: 45, fill: "#93c5fd" },
//   { rol: "Administrativos", cantidad: 12, fill: "#dbeafe" },
// ]

// const classroomStatus = [
//   { id: 1, aula: "101 - Matemáticas", capacidad: 30, ocupados: 28, edificio: "Bloque A" },
//   { id: 2, aula: "102 - Ciencias", capacidad: 25, ocupados: 25, edificio: "Bloque A" },
//   { id: 3, aula: "201 - Historia", capacidad: 35, ocupados: 15, edificio: "Bloque B" },
//   { id: 4, aula: "Lab. Sistemas", capacidad: 20, ocupados: 20, edificio: "Bloque C" },
// ]

// const recentUsers = [
//   { id: "1001", nombre: "Diego Rojas", rol: "Rector", email: "rectoria@colegio.edu", estado: "ACTIVO", foto: "https://i.pravatar.cc/150?u=diego" },
//   { id: "1002", nombre: "Ana Gómez", rol: "Docente", email: "agomez@colegio.edu", estado: "ACTIVO", foto: "https://i.pravatar.cc/150?u=ana2" },
//   { id: "1003", nombre: "Carlos Pérez", rol: "Docente", email: "cperez@colegio.edu", estado: "INACTIVO", foto: "" },
//   { id: "1004", nombre: "María Silva", rol: "Estudiante", email: "msilva@estudiante.edu", estado: "ACTIVO", foto: "https://i.pravatar.cc/150?u=maria" },
//   { id: "1005", nombre: "Roberto Silva", rol: "Acudiente", email: "roberto.s@correo.com", estado: "ACTIVO", foto: "" },
// ]

// const barChartConfig = { inscripciones: { label: "Inscripciones", color: "#1e3a8a" } } satisfies ChartConfig
// const lineChartConfig = { promedio: { label: "Promedio Global", color: "#1e3a8a" } } satisfies ChartConfig
// const pieChartConfig = {
//   cantidad: { label: "Usuarios" },
//   estudiantes: { label: "Estudiantes", color: "#1e3a8a" },
//   acudientes: { label: "Acudientes", color: "#3b82f6" },
//   docentes: { label: "Docentes", color: "#93c5fd" },
//   administrativos: { label: "Administrativos", color: "#dbeafe" },
// } satisfies ChartConfig


// const Dashboard = () => {
//   // Estado para el buscador del directorio
//   const [searchTerm, setSearchTerm] = useState("");

//   // Clases actualizadas para tarjetas transparentes con bordes azules
//   const cardAnimationClass = "bg-transparent border-2 border-blue-900/20 shadow-none transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-900/40 animate-in fade-in slide-in-from-bottom-4 fill-mode-both rounded-3xl";

//   const getInitials = (name: string) => {
//     return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
//   };

//   // Filtrado de usuarios
//   const filteredUsers = recentUsers.filter(user => 
//     user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.rol.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 min-h-screen text-blue-950 overflow-hidden">
      
//       {/* CABECERA */}
//       <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-700">
//         <h2 className="text-3xl font-black tracking-tight text-blue-950">Panel de Control</h2>
//         <p className="text-blue-900/70 font-medium mt-1">Métricas y personal en tiempo real de la institución educativa.</p>
//       </div>

//       {/* SISTEMA DE PESTAÑAS (Estilo GuardianSettings) */}
//       <Tabs defaultValue="overview" className="w-full flex flex-col animate-in fade-in duration-700 delay-100">
        
//         <div className="w-full flex justify-start mb-6">
//           <TabsList className="flex bg-blue-900/10 p-1 rounded-2xl w-full sm:w-max h-auto">
//             <TabsTrigger 
//               value="overview" 
//               className="flex-1 sm:px-8 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow-sm data-[state=active]:scale-100 text-blue-900/60 hover:text-blue-900 scale-95 hover:scale-100 hover:bg-blue-900/5"
//             >
//               <LayoutDashboard className="w-4 h-4" /> Visión General
//             </TabsTrigger>
//             <TabsTrigger 
//               value="directory" 
//               className="flex-1 sm:px-8 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow-sm data-[state=active]:scale-100 text-blue-900/60 hover:text-blue-900 scale-95 hover:scale-100 hover:bg-blue-900/5"
//             >
//               <Users className="w-4 h-4" /> Directorio y Personal
//             </TabsTrigger>
//           </TabsList>
//         </div>

//         {/* PESTAÑA 1: VISIÓN GENERAL */}
//         <TabsContent value="overview" className="flex flex-col gap-6 focus-visible:outline-none w-full">
          
//           {/* TARJETAS KPI */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
//             <Card className={cardAnimationClass} style={{ animationDelay: '100ms' }}>
//               <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//                 <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Total Estudiantes</CardTitle>
//                 <div className="p-2 bg-blue-900/5 rounded-xl">
//                   <GraduationCap className="h-5 w-5 text-blue-900" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-4xl font-black text-blue-950">450</div>
//                 <div className="flex items-center text-xs font-bold mt-2">
//                   <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
//                   <span className="text-emerald-600">+12%</span>
//                   <span className="text-blue-900/50 ml-1">vs mes anterior</span>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className={cardAnimationClass} style={{ animationDelay: '150ms' }}>
//               <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//                 <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Cuerpo Docente</CardTitle>
//                 <div className="p-2 bg-blue-900/5 rounded-xl">
//                   <BookOpen className="h-5 w-5 text-blue-900" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-4xl font-black text-blue-950">45</div>
//                 <div className="flex items-center text-xs font-bold mt-2">
//                   <TrendingDown className="w-4 h-4 text-amber-500 mr-1" />
//                   <span className="text-amber-600">2 ausencias</span>
//                   <span className="text-blue-900/50 ml-1">el día de hoy</span>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className={cardAnimationClass} style={{ animationDelay: '200ms' }}>
//               <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//                 <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Asistencia Global</CardTitle>
//                 <div className="p-2 bg-blue-900/5 rounded-xl">
//                   <UserCheck className="h-5 w-5 text-blue-900" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-4xl font-black text-blue-950">92%</div>
//                 <div className="flex items-center text-xs font-bold mt-2">
//                   <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
//                   <span className="text-emerald-600">+2.4%</span>
//                   <span className="text-blue-900/50 ml-1">promedio semanal</span>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className={cardAnimationClass} style={{ animationDelay: '250ms' }}>
//               <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//                 <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Matrículas Activas</CardTitle>
//                 <div className="p-2 bg-blue-900/5 rounded-xl">
//                   <Users className="h-5 w-5 text-blue-900" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-4xl font-black text-blue-950">842</div>
//                 <div className="flex items-center text-xs font-bold mt-2">
//                   <span className="text-blue-900/50">Total de usuarios en plataforma</span>
//                 </div>
//               </CardContent>
//             </Card>

//           </div>

//           {/* GRÁFICAS PRINCIPALES */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card className={cardAnimationClass} style={{ animationDelay: '350ms' }}>
//               <CardHeader>
//                 <CardTitle className="text-xl font-extrabold text-blue-950">Inscripciones por Mes</CardTitle>
//                 <CardDescription className="text-blue-900/60 font-medium">Histórico de nuevos registros en 2026.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ChartContainer config={barChartConfig} className="min-h-[250px] w-full">
//                   <BarChart data={chartDataEnrollments} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                     <CartesianGrid vertical={false} stroke="#1e3a8a" strokeDasharray="3 3" opacity={0.2} />
//                     <XAxis dataKey="mes" tickLine={false} tickMargin={12} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} stroke="#1e3a8a" fontSize={12} fontWeight="bold" />
//                     <ChartTooltip cursor={{fill: '#f1f5f9'}} content={<ChartTooltipContent hideLabel />} />
//                     <Bar dataKey="inscripciones" fill="var(--color-inscripciones)" radius={[6, 6, 0, 0]} maxBarSize={50} />
//                   </BarChart>
//                 </ChartContainer>
//               </CardContent>
//             </Card>

//             <Card className={cardAnimationClass} style={{ animationDelay: '400ms' }}>
//               <CardHeader>
//                 <CardTitle className="text-xl font-extrabold text-blue-950">Rendimiento Académico</CardTitle>
//                 <CardDescription className="text-blue-900/60 font-medium">Promedio global de calificaciones por periodo.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ChartContainer config={lineChartConfig} className="min-h-[250px] w-full">
//                   <LineChart data={chartDataGrades} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                     <CartesianGrid vertical={false} stroke="#1e3a8a" strokeDasharray="3 3" opacity={0.2} />
//                     <XAxis dataKey="periodo" tickLine={false} axisLine={false} tickMargin={12} stroke="#1e3a8a" fontSize={12} fontWeight="bold" />
//                     <ChartTooltip cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}} content={<ChartTooltipContent hideLabel />} />
//                     <Line dataKey="promedio" type="monotone" stroke="var(--color-promedio)" strokeWidth={3} dot={{ r: 5, fill: "white", strokeWidth: 2, stroke: "var(--color-promedio)" }} activeDot={{ r: 7, fill: "var(--color-promedio)", stroke: "white" }} />
//                   </LineChart>
//                 </ChartContainer>
//               </CardContent>
//             </Card>
//           </div>

//           {/* DONA Y TABLA DE AULAS */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <Card className={`${cardAnimationClass} flex flex-col`} style={{ animationDelay: '450ms' }}>
//               <CardHeader>
//                 <CardTitle className="text-xl font-extrabold text-blue-950">Distribución de Roles</CardTitle>
//                 <CardDescription className="text-blue-900/60 font-medium">Usuarios activos en la plataforma</CardDescription>
//               </CardHeader>
//               <CardContent className="flex-1 pb-4">
//                 <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[240px]">
//                   <PieChart>
//                     <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
//                     <Pie data={chartDataRoles} dataKey="cantidad" nameKey="rol" innerRadius={65} strokeWidth={2} stroke="transparent" className="transition-opacity hover:opacity-90">
//                       {chartDataRoles.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.fill} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ChartContainer>
//               </CardContent>
//             </Card>

//             <Card className={`${cardAnimationClass} lg:col-span-2`} style={{ animationDelay: '500ms' }}>
//               <CardHeader>
//                 <CardTitle className="text-xl font-extrabold text-blue-950">Ocupación de Aulas</CardTitle>
//                 <CardDescription className="text-blue-900/60 font-medium">Capacidad instalada vs Estudiantes matriculados</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader className="border-b-2 border-blue-900/10">
//                       <TableRow className="hover:bg-transparent border-none">
//                         <TableHead className="font-bold text-blue-950">Aula / Clase</TableHead>
//                         <TableHead className="font-bold text-blue-950 hidden sm:table-cell">Edificio</TableHead>
//                         <TableHead className="font-bold text-blue-950 text-center">Ocupación</TableHead>
//                         <TableHead className="font-bold text-blue-950 text-right">Estado</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {classroomStatus.map((room) => {
//                         const percentage = (room.ocupados / room.capacidad) * 100;
//                         return (
//                           <TableRow key={room.id} className="border-b border-blue-900/5 hover:bg-blue-900/5 transition-colors">
//                             <TableCell className="font-bold text-blue-950">{room.aula}</TableCell>
//                             <TableCell className="text-blue-900/70 font-bold hidden sm:table-cell">{room.edificio}</TableCell>
//                             <TableCell className="text-center text-blue-900/70 font-bold">
//                               {room.ocupados} / {room.capacidad}
//                             </TableCell>
//                             <TableCell className="text-right">
//                               {percentage >= 100 ? (
//                                 <Badge variant="destructive" className="bg-red-500/10 text-red-700 border-red-500/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1">Lleno</Badge>
//                               ) : percentage > 80 ? (
//                                 <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 border border-amber-500/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1">Casi Lleno</Badge>
//                               ) : (
//                                 <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1">Disponible</Badge>
//                               )}
//                             </TableCell>
//                           </TableRow>
//                         )
//                       })}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* PESTAÑA 2: DIRECTORIO CON FILTRO */}
//         <TabsContent value="directory" className="focus-visible:outline-none w-full">
//           <Card className={cardAnimationClass}>
//             <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//               <div>
//                 <CardTitle className="text-xl font-extrabold flex items-center gap-2 text-blue-950">
//                   <Users className="w-5 h-5 text-blue-900" /> Directorio de Comunidad
//                 </CardTitle>
//                 <CardDescription className="text-blue-900/60 font-medium">
//                   Información de contacto de los últimos usuarios registrados.
//                 </CardDescription>
//               </div>
              
//               {/* BUSCADOR */}
//               <div className="relative w-full sm:w-64 shrink-0">
//                 <Search className="absolute left-3 top-2.5 w-4 h-4 text-blue-900/40" />
//                 <input 
//                   type="text" 
//                   placeholder="Buscar usuario, rol o correo..."
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
//                       <TableHead className="font-bold text-blue-950 min-w-[220px]">Usuario</TableHead>
//                       <TableHead className="font-bold text-blue-950">Contacto</TableHead>
//                       <TableHead className="font-bold text-blue-950">Rol</TableHead>
//                       <TableHead className="font-bold text-blue-950 text-right pr-6">Estado</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredUsers.length > 0 ? (
//                       filteredUsers.map((user) => (
//                         <TableRow key={user.id} className="border-b border-blue-900/5 hover:bg-blue-900/5 transition-colors group">
//                           <TableCell className="font-bold text-blue-950">
//                             <div className="flex items-center gap-3 py-1">
//                               <Avatar className="h-9 w-9 border-2 border-blue-900/10 group-hover:border-blue-900/30 transition-colors">
//                                 <AvatarImage src={user.foto} alt={user.nombre} />
//                                 <AvatarFallback className="bg-blue-900/5 text-blue-900 font-bold text-xs">
//                                   {getInitials(user.nombre)}
//                                 </AvatarFallback>
//                               </Avatar>
//                               {user.nombre}
//                             </div>
//                           </TableCell>
//                           <TableCell className="text-blue-900/70 font-bold">
//                             <div className="flex items-center gap-2">
//                               <Mail className="w-4 h-4 text-blue-900/40" /> {user.email}
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <Badge variant="secondary" className="bg-blue-900/5 text-blue-900 hover:bg-blue-900/10 border border-blue-900/10 font-black tracking-widest uppercase text-[10px] px-2.5 py-1">
//                               {user.rol}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="text-right pr-6">
//                             {user.estado === 'ACTIVO' ? (
//                               <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1">
//                                 Activo
//                               </Badge>
//                             ) : (
//                               <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1">
//                                 Inactivo
//                               </Badge>
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={4} className="h-32 text-center">
//                           <div className="flex flex-col items-center justify-center text-blue-900/40">
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
//         </TabsContent>

//       </Tabs>
//     </div>
//   )
// }

// export default Dashboard

import { useState, useEffect, useCallback } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, Pie, PieChart, Cell } from "recharts"
import { Users, GraduationCap, BookOpen, UserCheck, Mail, TrendingUp, TrendingDown, LayoutDashboard, Search, Loader2 } from "lucide-react"

// --- COMPONENTES SHADCN ---
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// --- INTERFACES DEL BACKEND ---
interface Props {
  institutionId: number;
}

interface Kpis {
  totalStudents: number;
  totalTeachers: number;
  globalAttendance: number;
  activeEnrollments: number;
}

interface EnrollmentChart { mes: string; inscripciones: number; }
interface GradesChart { periodo: string; promedio: number; }
interface RolesChart { rol: string; cantidad: number; fill: string; }
interface ClassroomStatus { id: number; aula: string; capacidad: number; ocupados: number; edificio: string; }
interface RecentUser { id: string; nombre: string; rol: string; email: string; estado: string; foto: string | null; }

interface DashboardData {
  kpis: Kpis;
  enrollmentsChart: EnrollmentChart[];
  gradesChart: GradesChart[];
  rolesChart: RolesChart[];
  classroomStatus: ClassroomStatus[];
  recentUsers: RecentUser[];
}

const barChartConfig = { inscripciones: { label: "Inscripciones", color: "#1e3a8a" } } satisfies ChartConfig;
const lineChartConfig = { promedio: { label: "Promedio Global", color: "#1e3a8a" } } satisfies ChartConfig;
const pieChartConfig = {
  cantidad: { label: "Usuarios" },
  estudiantes: { label: "Estudiantes", color: "#1e3a8a" },
  acudientes: { label: "Acudientes", color: "#3b82f6" },
  docentes: { label: "Docentes", color: "#93c5fd" },
  administrativos: { label: "Administrativos", color: "#dbeafe" },
} satisfies ChartConfig;

const Dashboard = ({ institutionId }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // --- ESTADOS ---
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "DIRECTORY">("OVERVIEW");
  const [searchTerm, setSearchTerm] = useState("");

  // --- FETCH AL BACKEND ---
  const fetchDashboardData = useCallback(async () => {
    if (!institutionId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/admin-dashboard/${institutionId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const dashboardData = await res.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error("Error cargando el dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, [institutionId, apiUrl]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- AYUDANTES ---
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const getPhotoUrl = (photo: string | null) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    return `${apiUrl}/files/${photo}`;
  };

  const cardAnimationClass = "bg-transparent border-2 border-blue-900/20 shadow-none transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-900/40 animate-in fade-in slide-in-from-bottom-4 fill-mode-both rounded-3xl";

  // --- ESTADO DE CARGA ---
  if (isLoading || !data) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-blue-900/50">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h3 className="text-xl font-black">Cargando Panel de Control...</h3>
        <p className="font-medium">Calculando métricas institucionales</p>
      </div>
    );
  }

  // Filtrado de usuarios en el directorio
  const filteredUsers = data.recentUsers.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 min-h-screen text-blue-950 overflow-hidden">
      
      {/* CABECERA */}
      <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-700">
        <h2 className="text-3xl font-black tracking-tight text-blue-950">Panel de Control</h2>
        <p className="text-blue-900/70 font-medium mt-1">Métricas y personal en tiempo real de la institución educativa.</p>
      </div>

      {/* --- SELECTOR DE PESTAÑAS --- */}
      <div className="flex bg-blue-900/10 p-1 rounded-2xl w-full sm:w-max animate-in fade-in zoom-in-95 duration-500 mb-2">
        <button 
          type="button"
          onClick={() => setActiveTab("OVERVIEW")}
          className={`flex-1 sm:px-8 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest ${
            activeTab === "OVERVIEW" ? "bg-white shadow-sm text-blue-900 scale-100" : "text-blue-900/60 hover:text-blue-900 scale-95 hover:scale-100 hover:bg-blue-900/5"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Visión General
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab("DIRECTORY")}
          className={`flex-1 sm:px-8 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest ${
            activeTab === "DIRECTORY" ? "bg-white shadow-sm text-blue-900 scale-100" : "text-blue-900/60 hover:text-blue-900 scale-95 hover:scale-100 hover:bg-blue-900/5"
          }`}
        >
          <Users className="w-4 h-4" /> Directorio y Personal
        </button>
      </div>

      {/* =========================================================
          PESTAÑA 1: VISIÓN GENERAL
      ========================================================= */}
      {activeTab === "OVERVIEW" && (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* TARJETAS KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className={cardAnimationClass} style={{ animationDelay: '100ms' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Total Estudiantes</CardTitle>
                <div className="p-2 bg-blue-900/5 rounded-xl">
                  <GraduationCap className="h-5 w-5 text-blue-900" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-blue-950">{data.kpis.totalStudents}</div>
                <div className="flex items-center text-xs font-bold mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
                  <span className="text-blue-900/50 ml-1">Matriculados activos</span>
                </div>
              </CardContent>
            </Card>

            <Card className={cardAnimationClass} style={{ animationDelay: '150ms' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Cuerpo Docente</CardTitle>
                <div className="p-2 bg-blue-900/5 rounded-xl">
                  <BookOpen className="h-5 w-5 text-blue-900" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-blue-950">{data.kpis.totalTeachers}</div>
                <div className="flex items-center text-xs font-bold mt-2">
                  <span className="text-blue-900/50 ml-1">Plantilla institucional</span>
                </div>
              </CardContent>
            </Card>

            <Card className={cardAnimationClass} style={{ animationDelay: '200ms' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Asistencia Global</CardTitle>
                <div className="p-2 bg-blue-900/5 rounded-xl">
                  <UserCheck className="h-5 w-5 text-blue-900" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-blue-950">{data.kpis.globalAttendance}%</div>
                <div className="flex items-center text-xs font-bold mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
                  <span className="text-blue-900/50 ml-1">Promedio general histórico</span>
                </div>
              </CardContent>
            </Card>

            <Card className={cardAnimationClass} style={{ animationDelay: '250ms' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-blue-900/70 uppercase tracking-widest">Matrículas Históricas</CardTitle>
                <div className="p-2 bg-blue-900/5 rounded-xl">
                  <Users className="h-5 w-5 text-blue-900" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-blue-950">{data.kpis.activeEnrollments}</div>
                <div className="flex items-center text-xs font-bold mt-2">
                  <span className="text-blue-900/50">Procesos realizados</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* GRÁFICAS PRINCIPALES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={cardAnimationClass} style={{ animationDelay: '350ms' }}>
              <CardHeader>
                <CardTitle className="text-xl font-extrabold text-blue-950">Inscripciones por Mes</CardTitle>
                <CardDescription className="text-blue-900/60 font-medium">Histórico de nuevos registros este año.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={barChartConfig} className="min-h-[250px] w-full">
                  <BarChart data={data.enrollmentsChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#1e3a8a" strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="mes" tickLine={false} tickMargin={12} axisLine={false} stroke="#1e3a8a" fontSize={12} fontWeight="bold" />
                    <ChartTooltip cursor={{fill: '#f1f5f9'}} content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="inscripciones" fill="var(--color-inscripciones)" radius={[6, 6, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className={cardAnimationClass} style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <CardTitle className="text-xl font-extrabold text-blue-950">Rendimiento Académico</CardTitle>
                <CardDescription className="text-blue-900/60 font-medium">Promedio global de calificaciones por periodo.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={lineChartConfig} className="min-h-[250px] w-full">
                  <LineChart data={data.gradesChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#1e3a8a" strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="periodo" tickLine={false} axisLine={false} tickMargin={12} stroke="#1e3a8a" fontSize={12} fontWeight="bold" />
                    <ChartTooltip cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}} content={<ChartTooltipContent hideLabel />} />
                    <Line dataKey="promedio" type="monotone" stroke="var(--color-promedio)" strokeWidth={3} dot={{ r: 5, fill: "white", strokeWidth: 2, stroke: "var(--color-promedio)" }} activeDot={{ r: 7, fill: "var(--color-promedio)", stroke: "white" }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* DONA Y TABLA DE AULAS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className={`${cardAnimationClass} flex flex-col`} style={{ animationDelay: '450ms' }}>
              <CardHeader>
                <CardTitle className="text-xl font-extrabold text-blue-950">Distribución de Roles</CardTitle>
                <CardDescription className="text-blue-900/60 font-medium">Usuarios activos en la plataforma</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[240px]">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie data={data.rolesChart} dataKey="cantidad" nameKey="rol" innerRadius={65} strokeWidth={2} stroke="transparent" className="transition-opacity hover:opacity-90">
                      {data.rolesChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className={`${cardAnimationClass} lg:col-span-2`} style={{ animationDelay: '500ms' }}>
              <CardHeader>
                <CardTitle className="text-xl font-extrabold text-blue-950">Ocupación de Aulas</CardTitle>
                <CardDescription className="text-blue-900/60 font-medium">Capacidad instalada vs Estudiantes matriculados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="border-b-2 border-blue-900/10">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="font-bold text-blue-950">Aula / Clase</TableHead>
                        <TableHead className="font-bold text-blue-950 hidden sm:table-cell">Edificio</TableHead>
                        <TableHead className="font-bold text-blue-950 text-center">Ocupación</TableHead>
                        <TableHead className="font-bold text-blue-950 text-right">Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.classroomStatus.map((room) => {
                        const percentage = room.capacidad > 0 ? (room.ocupados / room.capacidad) * 100 : 0;
                        return (
                          <TableRow key={room.id} className="border-b border-blue-900/5 hover:bg-blue-900/5 transition-colors">
                            <TableCell className="font-bold text-blue-950">{room.aula}</TableCell>
                            <TableCell className="text-blue-900/70 font-bold hidden sm:table-cell">{room.edificio}</TableCell>
                            <TableCell className="text-center text-blue-900/70 font-bold">
                              {room.ocupados} / {room.capacidad}
                            </TableCell>
                            <TableCell className="text-right">
                              {percentage >= 100 ? (
                                <Badge variant="destructive" className="bg-red-500/10 text-red-700 border-red-500/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1">Lleno</Badge>
                              ) : percentage > 80 ? (
                                <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 border border-amber-500/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1">Casi Lleno</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1">Disponible</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* =========================================================
          PESTAÑA 2: DIRECTORIO
      ========================================================= */}
      {activeTab === "DIRECTORY" && (
        <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
          <Card className={cardAnimationClass}>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-extrabold flex items-center gap-2 text-blue-950">
                  <Users className="w-5 h-5 text-blue-900" /> Directorio de Comunidad
                </CardTitle>
                <CardDescription className="text-blue-900/60 font-medium">
                  Información de contacto de los últimos usuarios registrados.
                </CardDescription>
              </div>
              
              {/* BUSCADOR */}
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-blue-900/40" />
                <input 
                  type="text" 
                  placeholder="Buscar usuario, rol o correo..."
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
                      <TableHead className="font-bold text-blue-950 min-w-[220px]">Usuario</TableHead>
                      <TableHead className="font-bold text-blue-950">Contacto</TableHead>
                      <TableHead className="font-bold text-blue-950">Rol</TableHead>
                      <TableHead className="font-bold text-blue-950 text-right pr-6">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="border-b border-blue-900/5 hover:bg-blue-900/5 transition-colors group">
                          <TableCell className="font-bold text-blue-950">
                            <div className="flex items-center gap-3 py-1">
                              <Avatar className="h-9 w-9 border-2 border-blue-900/10 group-hover:border-blue-900/30 transition-colors">
                                <AvatarImage src={getPhotoUrl(user.foto)!} alt={user.nombre} />
                                <AvatarFallback className="bg-blue-900/5 text-blue-900 font-bold text-xs">
                                  {getInitials(user.nombre)}
                                </AvatarFallback>
                              </Avatar>
                              {user.nombre}
                            </div>
                          </TableCell>
                          <TableCell className="text-blue-900/70 font-bold">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-blue-900/40" /> {user.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-blue-900/5 text-blue-900 hover:bg-blue-900/10 border border-blue-900/10 font-black tracking-widest uppercase text-[10px] px-2.5 py-1">
                              {user.rol}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            {user.estado === 'ACTIVO' ? (
                              <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1">
                                Activo
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/20 font-black tracking-widest uppercase text-[10px] px-2.5 py-1">
                                Inactivo
                              </Badge>
                            )}
                          </TableCell>
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

    </div>
  )
}

export default Dashboard