package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.AdminDashboardDTO;
import com.NovaSmart.Backend.Model.Combinations.AdminDashboardDTO.*;
import com.NovaSmart.Backend.Repositories.Combinations.AdminDashboardRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IAdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminDashboardService implements IAdminDashboardService {

    private final AdminDashboardRepository repository;

    private static final String[] MESES = {"Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"};

    @Override
    public AdminDashboardDTO getDashboardData(Long institutionId) {
        AdminDashboardDTO dashboard = new AdminDashboardDTO();

        // 1. Cargar KPIs
        KpisDTO kpis = new KpisDTO();
        kpis.setTotalStudents(repository.getTotalStudents(institutionId));
        kpis.setTotalTeachers(repository.getTotalTeachers(institutionId));
        kpis.setGlobalAttendance(repository.getGlobalAttendance(institutionId));
        kpis.setActiveEnrollments(repository.getActiveEnrollments(institutionId));
        dashboard.setKpis(kpis);

        // 2. Gráfica: Inscripciones por Mes
        List<EnrollmentChartDTO> enrollments = new ArrayList<>();
        for (Map<String, Object> row : repository.getEnrollmentsPerMonth(institutionId)) {
            EnrollmentChartDTO dto = new EnrollmentChartDTO();
            int monthNum = ((Number) row.get("month_num")).intValue();
            dto.setMes(MESES[monthNum - 1]);
            dto.setInscripciones(((Number) row.get("count")).intValue());
            enrollments.add(dto);
        }
        dashboard.setEnrollmentsChart(enrollments);

        // 3. Gráfica: Promedios por Periodo
        List<GradesChartDTO> grades = new ArrayList<>();
        for (Map<String, Object> row : repository.getGradesPerPeriod(institutionId)) {
            GradesChartDTO dto = new GradesChartDTO();
            dto.setPeriodo((String) row.get("period_name"));
            dto.setPromedio(Math.round(((Number) row.get("average")).doubleValue() * 10.0) / 10.0);
            grades.add(dto);
        }
        dashboard.setGradesChart(grades);

        // 4. Dona: Distribución de Roles (Con colores)
        List<RolesChartDTO> rolesList = new ArrayList<>();
        for (Map<String, Object> row : repository.getRoleDistribution(institutionId)) {
            RolesChartDTO dto = new RolesChartDTO();

            // SOLUCIÓN: Convertimos a mayúsculas para evitar problemas de case-sensitivity
            String dbRole = ((String) row.get("role_name")).toUpperCase();

            // Transformar nombre del rol y asignar color
            if (dbRole.contains("STUDENT") || dbRole.contains("ESTUDIANTE")) {
                dto.setRol("Estudiantes");
                dto.setFill("#1e3a8a");
            } else if (dbRole.contains("GUARDIAN") || dbRole.contains("ACUDIENTE")) {
                dto.setRol("Acudientes");
                dto.setFill("#3b82f6");
            } else if (dbRole.contains("TEACHER") || dbRole.contains("DOCENTE")) {
                dto.setRol("Docentes");
                dto.setFill("#93c5fd");
            } else {
                // Aquí caerá el "Rector" y otros administrativos
                dto.setRol("Administrativos");
                dto.setFill("#e0f2fe");
            }

            dto.setCantidad(((Number) row.get("count")).intValue());
            rolesList.add(dto);
        }
        dashboard.setRolesChart(rolesList);

        // 5. Tabla: Ocupación de Aulas
        List<ClassroomStatusDTO> classrooms = new ArrayList<>();
        for (Map<String, Object> row : repository.getClassroomStatus(institutionId)) {
            ClassroomStatusDTO dto = new ClassroomStatusDTO();
            dto.setId(((Number) row.get("id")).longValue());
            dto.setAula((String) row.get("aula"));
            dto.setCapacidad(row.get("capacity") != null ? ((Number) row.get("capacity")).intValue() : 0);
            dto.setOcupados(((Number) row.get("ocupados")).intValue());
            dto.setEdificio((String) row.get("building"));
            classrooms.add(dto);
        }
        dashboard.setClassroomStatus(classrooms);

        // 6. Tabla: Usuarios Recientes
        List<RecentUserDTO> recentUsers = new ArrayList<>();
        for (Map<String, Object> row : repository.getRecentUsers(institutionId)) {
            RecentUserDTO dto = new RecentUserDTO();
            dto.setId(row.get("id").toString());
            dto.setNombre((String) row.get("name"));

            String dbRole = (String) row.get("role_name");
            dto.setRol(dbRole != null ? dbRole.replace("ROLE_", "") : "USUARIO");

            dto.setEmail(row.get("email") != null ? (String) row.get("email") : "Sin correo");
            dto.setEstado(row.get("status").toString());
            dto.setFoto((String) row.get("photo"));
            recentUsers.add(dto);
        }
        dashboard.setRecentUsers(recentUsers);

        return dashboard;
    }
}
