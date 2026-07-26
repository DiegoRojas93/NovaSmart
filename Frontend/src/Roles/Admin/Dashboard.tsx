import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, Pie, PieChart, Cell } from "recharts"
import { Users, GraduationCap, BookOpen, UserCheck } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// --- DATOS DE PRUEBA BASADOS EN LA BASE DE DATOS ---

// 1. Inscripciones (enrollments)
const chartDataEnrollments = [
  { mes: "Ene", inscripciones: 186 },
  { mes: "Feb", inscripciones: 305 },
  { mes: "Mar", inscripciones: 237 },
  { mes: "Abr", inscripciones: 73 },
  { mes: "May", inscripciones: 209 },
  { mes: "Jun", inscripciones: 214 },
]

// 2. Rendimiento Académico (student_grades cruzado con academic_periods)
const chartDataGrades = [
  { periodo: "Periodo 1", promedio: 3.8 },
  { periodo: "Periodo 2", promedio: 4.1 },
  { periodo: "Periodo 3", promedio: 3.9 },
  { periodo: "Periodo 4", promedio: 4.5 },
]

// 3. Distribución de Roles (users cruzado con roles/teachers/students)
const chartDataRoles = [
  { rol: "Estudiantes", cantidad: 450, fill: "#1e3a8a" },      // blue-900
  { rol: "Acudientes", cantidad: 380, fill: "#3b82f6" },       // blue-500
  { rol: "Docentes", cantidad: 45, fill: "#93c5fd" },          // blue-300
  { rol: "Administrativos", cantidad: 12, fill: "#dbeafe" },   // blue-100
]

// 4. Estado de Aulas (classrooms cruzado con enrollments)
const classroomStatus = [
  { id: 1, aula: "101 - Matemáticas", capacidad: 30, ocupados: 28, edificio: "Bloque A" },
  { id: 2, aula: "102 - Ciencias", capacidad: 25, ocupados: 25, edificio: "Bloque A" },
  { id: 3, aula: "201 - Historia", capacidad: 35, ocupados: 15, edificio: "Bloque B" },
  { id: 4, aula: "Lab. Sistemas", capacidad: 20, ocupados: 18, edificio: "Bloque C" },
]

// 5. Usuarios Recientes (users)
const recentUsers = [
  { id: "1001", nombre: "Diego Rojas", rol: "Rector", estado: "ACTIVO" },
  { id: "1002", nombre: "Ana Gómez", rol: "Coordinador", estado: "ACTIVO" },
  { id: "1003", nombre: "Carlos Pérez", rol: "Docente", estado: "INACTIVO" },
  { id: "1004", nombre: "María Silva", rol: "Estudiante", estado: "ACTIVO" },
]

// Configuraciones de Shadcn Charts
const barChartConfig = { inscripciones: { label: "Inscripciones", color: "#1e3a8a" } } satisfies ChartConfig
const lineChartConfig = { promedio: { label: "Promedio Global", color: "#1e3a8a" } } satisfies ChartConfig
const pieChartConfig = {
  cantidad: { label: "Usuarios" },
  estudiantes: { label: "Estudiantes", color: "#1e3a8a" },
  acudientes: { label: "Acudientes", color: "#3b82f6" },
  docentes: { label: "Docentes", color: "#93c5fd" },
  administrativos: { label: "Administrativos", color: "#dbeafe" },
} satisfies ChartConfig


const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6 p-2 md:p-4">
      
      {/* CABECERA */}
      <div>
        <h2 className="text-3xl font-black text-blue-950 mb-2">Panel de Control</h2>
        <p className="text-blue-900/70 font-medium">Métricas en tiempo real de la institución educativa.</p>
      </div>

      {/* --- SECCIÓN 1: TARJETAS KPI --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-blue-900/80 uppercase tracking-wider">Total Estudiantes</CardTitle>
            <GraduationCap className="h-5 w-5 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-950">450</div>
            <p className="text-xs text-blue-900/60 font-bold mt-1">+12% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-blue-900/80 uppercase tracking-wider">Cuerpo Docente</CardTitle>
            <BookOpen className="h-5 w-5 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-950">45</div>
            <p className="text-xs text-blue-900/60 font-bold mt-1">2 en licencia médica</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-blue-900/80 uppercase tracking-wider">Asistencia Global</CardTitle>
            <UserCheck className="h-5 w-5 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-950">92%</div>
            <p className="text-xs text-blue-900/60 font-bold mt-1">Alumnos presentes hoy</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-blue-900/80 uppercase tracking-wider">Matrículas Activas</CardTitle>
            <Users className="h-5 w-5 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-950">842</div>
            <p className="text-xs text-blue-900/60 font-bold mt-1">Total comunidad educativa</p>
          </CardContent>
        </Card>
      </div>

      {/* --- SECCIÓN 2: GRÁFICAS PRINCIPALES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRÁFICA DE BARRAS: Inscripciones */}
        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-950 text-xl font-extrabold">Inscripciones por Mes</CardTitle>
            <CardDescription className="text-blue-900/70 font-medium">Histórico de nuevos registros.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="min-h-[250px] w-full">
              <BarChart data={chartDataEnrollments} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#1e3a8a" strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="mes" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} stroke="#1e3a8a" />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="inscripciones" fill="var(--color-inscripciones)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* GRÁFICA DE LÍNEAS: Rendimiento Académico */}
        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-950 text-xl font-extrabold">Rendimiento Académico</CardTitle>
            <CardDescription className="text-blue-900/70 font-medium">Promedio global de calificaciones por periodo.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineChartConfig} className="min-h-[250px] w-full">
              <LineChart data={chartDataGrades} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#1e3a8a" strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="periodo" tickLine={false} axisLine={false} tickMargin={8} stroke="#1e3a8a" />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Line dataKey="promedio" type="monotone" stroke="var(--color-promedio)" strokeWidth={3} dot={{ r: 6, fill: "#1e3a8a" }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

      </div>

      {/* --- SECCIÓN 3: TABLAS Y DONA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICA DE DONA: Distribución de Usuarios */}
        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-blue-950 text-lg font-extrabold">Distribución de Comunidad</CardTitle>
            <CardDescription className="text-blue-900/70 font-medium">Roles activos en plataforma</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={chartDataRoles} dataKey="cantidad" nameKey="rol" innerRadius={60} strokeWidth={5} stroke="transparent">
                  {chartDataRoles.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* TABLA: Ocupación de Aulas */}
        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-blue-950 text-xl font-extrabold">Ocupación de Aulas</CardTitle>
            <CardDescription className="text-blue-900/70 font-medium">Capacidad vs Matrículas Actuales</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-blue-900/20 hover:bg-transparent">
                  <TableHead className="text-blue-950 font-bold">Aula / Clase</TableHead>
                  <TableHead className="text-blue-950 font-bold">Ubicación</TableHead>
                  <TableHead className="text-blue-950 font-bold text-center">Ocupación</TableHead>
                  <TableHead className="text-blue-950 font-bold text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classroomStatus.map((room) => {
                  const percentage = (room.ocupados / room.capacidad) * 100;
                  return (
                    <TableRow key={room.id} className="border-blue-900/10 hover:bg-blue-900/5">
                      <TableCell className="font-bold text-blue-950">{room.aula}</TableCell>
                      <TableCell className="text-blue-900/80 font-medium">{room.edificio}</TableCell>
                      <TableCell className="text-center text-blue-900/80 font-medium">
                        {room.ocupados} / {room.capacidad}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          percentage >= 100 ? 'bg-red-100 text-red-800' : percentage > 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {percentage >= 100 ? 'Lleno' : 'Disponible'}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default Dashboard