import { Bar, BarChart, CartesianGrid, XAxis, Area, AreaChart } from "recharts"
import { BookOpen, MapPin, CalendarDays, Layers } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// --- DATOS DE PRUEBA BASADOS EN LA BASE DE DATOS ---

// 1. Carga Académica por Día (schedules cruzado con classroom_subjects)
const scheduleData = [
  { dia: "Lunes", clases: 45 },
  { dia: "Martes", clases: 52 },
  { dia: "Miércoles", clases: 48 },
  { dia: "Jueves", clases: 55 },
  { dia: "Viernes", clases: 35 },
  { dia: "Sábado", clases: 8 },
]

// 2. Densidad de Materias por Grado (school_grades cruzado con subjects)
const subjectsPerGrade = [
  { grado: "Sexto", materias: 10 },
  { grado: "Séptimo", materias: 10 },
  { grado: "Octavo", materias: 12 },
  { grado: "Noveno", materias: 12 },
  { grado: "Décimo", materias: 14 },
  { grado: "Once", materias: 15 },
]

// 3. Asignaciones Recientes (classroom_subjects cruzado con subjects, teachers, classrooms y schedules)
const recentAssignments = [
  { id: 1, materia: "MAT-101 (Cálculo)", docente: "Carlos Pérez", aula: "Lab. Sistemas (P2)", horario: "Lun, Mié 08:00 - 10:00" },
  { id: 2, materia: "FIS-201 (Física I)", docente: "Ana Gómez", aula: "Aula 302 (P3)", horario: "Mar, Jue 10:30 - 12:30" },
  { id: 3, materia: "HIS-105 (Historia)", docente: "Luis Rodríguez", aula: "Aula 101 (P1)", horario: "Vie 07:00 - 09:00" },
  { id: 4, materia: "QUI-301 (Química)", docente: "Marta Silva", aula: "Lab. Química (P1)", horario: "Lun, Jue 14:00 - 16:00" },
]

// Configuraciones de Shadcn Charts
const areaChartConfig = { clases: { label: "Clases Programadas", color: "#1e3a8a" } } satisfies ChartConfig
const barChartConfig = { materias: { label: "Materias", color: "#3b82f6" } } satisfies ChartConfig

const AcademicsDashboard = () => {
  return (
    <div className="flex flex-col gap-6 p-2 md:p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* CABECERA */}
      <div>
        <h2 className="text-3xl font-black text-blue-950 mb-2">Gestión Académica</h2>
        <p className="text-blue-900/70 font-medium">Resumen de grados, asignaturas, aulas y horarios.</p>
      </div>

      {/* --- SECCIÓN 1: TARJETAS KPI --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-blue-900/80 uppercase tracking-wider">Asignaturas Activas</CardTitle>
            <BookOpen className="h-5 w-5 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-950">42</div>
            <p className="text-xs text-blue-900/60 font-bold mt-1">En el pénsum actual</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-blue-900/80 uppercase tracking-wider">Aulas Registradas</CardTitle>
            <MapPin className="h-5 w-5 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-950">28</div>
            <p className="text-xs text-blue-900/60 font-bold mt-1">Repartidas en 3 edificios</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-blue-900/80 uppercase tracking-wider">Periodo Académico</CardTitle>
            <CalendarDays className="h-5 w-5 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-950">2026-I</div>
            <p className="text-xs text-blue-900/60 font-bold mt-1">Finaliza: 30 de Junio</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-blue-900/80 uppercase tracking-wider">Niveles Educativos</CardTitle>
            <Layers className="h-5 w-5 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-950">11</div>
            <p className="text-xs text-blue-900/60 font-bold mt-1">Grados configurados</p>
          </CardContent>
        </Card>
      </div>

      {/* --- SECCIÓN 2: GRÁFICAS PRINCIPALES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRÁFICA DE ÁREA: Carga de horarios */}
        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-950 text-xl font-extrabold">Carga Horaria Semanal</CardTitle>
            <CardDescription className="text-blue-900/70 font-medium">Volumen de clases programadas por día.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={areaChartConfig} className="min-h-[250px] w-full">
              <AreaChart data={scheduleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillClases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-clases)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-clases)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#1e3a8a" strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} stroke="#1e3a8a" tickFormatter={(val) => val.slice(0,3)} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Area type="bump" dataKey="clases" stroke="var(--color-clases)" strokeWidth={3} fillOpacity={1} fill="url(#fillClases)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* GRÁFICA DE BARRAS: Materias por Grado */}
        <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-950 text-xl font-extrabold">Densidad del Pénsum</CardTitle>
            <CardDescription className="text-blue-900/70 font-medium">Cantidad de asignaturas exigidas por grado.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="min-h-[250px] w-full">
              <BarChart data={subjectsPerGrade} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#1e3a8a" strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="grado" tickLine={false} tickMargin={10} axisLine={false} stroke="#1e3a8a" />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="materias" fill="var(--color-materias)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

      </div>

      {/* --- SECCIÓN 3: TABLA DE ASIGNACIONES (classroom_subjects) --- */}
      <Card className="border-2 border-blue-900/20 bg-transparent shadow-sm">
        <CardHeader>
          <CardTitle className="text-blue-950 text-xl font-extrabold">Últimas Asignaciones Creadas</CardTitle>
          <CardDescription className="text-blue-900/70 font-medium">Cruce de asignaturas, docentes, aulas y horarios en el periodo vigente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-blue-900/20 hover:bg-transparent">
                <TableHead className="text-blue-950 font-bold">Asignatura</TableHead>
                <TableHead className="text-blue-950 font-bold">Docente Titular</TableHead>
                <TableHead className="text-blue-950 font-bold">Aula (Ubicación)</TableHead>
                <TableHead className="text-blue-950 font-bold text-right">Horario Base</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAssignments.map((row) => (
                <TableRow key={row.id} className="border-blue-900/10 hover:bg-blue-900/5">
                  <TableCell className="font-bold text-blue-950">{row.materia}</TableCell>
                  <TableCell className="text-blue-900/80 font-medium">{row.docente}</TableCell>
                  <TableCell className="text-blue-900/80 font-medium">{row.aula}</TableCell>
                  <TableCell className="text-right text-blue-900/80 font-medium">{row.horario}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  )
}

export default AcademicsDashboard