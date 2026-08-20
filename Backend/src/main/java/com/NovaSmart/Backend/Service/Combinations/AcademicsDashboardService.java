package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.AcademicsDashboardDTO.*;
import com.NovaSmart.Backend.Repositories.Combinations.AcademicsDashboardRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IAcademicsDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AcademicsDashboardService implements IAcademicsDashboardService {

    private final AcademicsDashboardRepository repository;
    private static final String[] DIAS_SEMANA = {"Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"};

    @Override
    public StructureDataDTO getStructureData(Long institutionId) {
        StructureDataDTO data = new StructureDataDTO();

        // 1. Cargar KPIs reales
        KpisDTO kpis = new KpisDTO();
        kpis.setActiveSubjects(repository.getActiveSubjects(institutionId));
        kpis.setRegisteredClassrooms(repository.getRegisteredClassrooms(institutionId));
        kpis.setCurrentPeriod(repository.getCurrentPeriod(institutionId));
        kpis.setConfiguredLevels(repository.getConfiguredLevels(institutionId));
        data.setKpis(kpis);

        // 2. Cargar Horarios por Día
        List<ScheduleChartDTO> scheduleData = new ArrayList<>();
        for (Map<String, Object> row : repository.getScheduleData(institutionId)) {
            ScheduleChartDTO dto = new ScheduleChartDTO();
            int diaIdx = ((Number) row.get("day_of_week")).intValue();
            dto.setDia(diaIdx >= 1 && diaIdx <= 7 ? DIAS_SEMANA[diaIdx % 7] : "Día " + diaIdx);
            dto.setClases(((Number) row.get("clases")).intValue());
            scheduleData.add(dto);
        }
        data.setScheduleData(scheduleData);

        // 3. Cargar Materias por Grado
        List<SubjectsPerGradeDTO> subjectsData = new ArrayList<>();
        for (Map<String, Object> row : repository.getSubjectsPerGrade(institutionId)) {
            SubjectsPerGradeDTO dto = new SubjectsPerGradeDTO();
            dto.setGrado((String) row.get("grado"));
            dto.setMaterias(((Number) row.get("materias")).intValue());
            subjectsData.add(dto);
        }
        data.setSubjectsPerGrade(subjectsData);

        // 4. Cargar Asignaciones de Aulas (Estructura de Clases)
        List<RecentAssignmentDTO> assignments = new ArrayList<>();
        for (Map<String, Object> row : repository.getRecentAssignments(institutionId)) {
            RecentAssignmentDTO dto = new RecentAssignmentDTO();
            dto.setId(((Number) row.get("id")).longValue());
            dto.setMateria((String) row.get("materia"));
            dto.setDocente((String) row.get("docente"));
            dto.setDocenteFoto((String) row.get("docente_foto"));
            dto.setAula((String) row.get("aula"));
            dto.setHorario(row.get("horario") != null ? (String) row.get("horario") : "Sin horario asignado");
            assignments.add(dto);
        }
        data.setRecentAssignments(assignments);

        // 5. Cargar Filtros de Grados (Para los <select> del frontend)
        List<FilterOptionDTO> grades = new ArrayList<>();
        for (Map<String, Object> row : repository.getAvailableGrades(institutionId)) {
            FilterOptionDTO opt = new FilterOptionDTO();
            opt.setId(row.get("id").toString());
            opt.setName((String) row.get("name"));
            grades.add(opt);
        }
        data.setAvailableGrades(grades);

        // 6. Cargar Filtros de Materias (Para los <select> del frontend)
        List<FilterOptionDTO> subjects = new ArrayList<>();
        for (Map<String, Object> row : repository.getAvailableSubjects(institutionId)) {
            FilterOptionDTO opt = new FilterOptionDTO();
            opt.setId(row.get("id").toString());
            opt.setName((String) row.get("name"));
            subjects.add(opt);
        }
        data.setAvailableSubjects(subjects);

        return data;
    }

    @Override
    public ActivitiesDataDTO getFilteredActivitiesData(Long institutionId, Long gradeId, Long subjectId) {
        ActivitiesDataDTO data = new ActivitiesDataDTO();

        // 1. Dona de Actividades
        List<ActivityDistributionDTO> activitiesDist = new ArrayList<>();
        for (Map<String, Object> row : repository.getActivitiesDistribution(institutionId, gradeId, subjectId)) {
            ActivityDistributionDTO dto = new ActivityDistributionDTO();
            String tipo = (String) row.get("type");
            dto.setTipo("CLASSWORK".equals(tipo) ? "Trabajos en Clase" : "Tareas en Casa");
            dto.setFill("CLASSWORK".equals(tipo) ? "#1e3a8a" : "#3b82f6");
            dto.setCantidad(((Number) row.get("cantidad")).intValue());
            activitiesDist.add(dto);
        }
        data.setActivitiesDistribution(activitiesDist);

        // 2. Dona de Entregas
        List<SubmissionStatusDTO> submissions = new ArrayList<>();
        for (Map<String, Object> row : repository.getSubmissionStatus(institutionId, gradeId, subjectId)) {
            SubmissionStatusDTO dto = new SubmissionStatusDTO();
            String estado = (String) row.get("status");
            switch (estado) {
                case "CALIFICADO": dto.setEstado("Calificados"); dto.setFill("#22c55e"); break;
                case "ENTREGADO": dto.setEstado("Entregados"); dto.setFill("#3b82f6"); break;
                case "PENDIENTE": dto.setEstado("Pendientes"); dto.setFill("#f59e0b"); break;
                case "NO_ENTREGADO": dto.setEstado("No Entregados"); dto.setFill("#ef4444"); break;
                default: dto.setEstado(estado); dto.setFill("#9ca3af");
            }
            dto.setCantidad(((Number) row.get("cantidad")).intValue());
            submissions.add(dto);
        }
        data.setSubmissionStatus(submissions);

        // 3. Tabla Actividades Recientes
        List<RecentActivityDTO> recentActivities = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, HH:mm", new Locale("es", "ES"));
        for (Map<String, Object> row : repository.getRecentActivities(institutionId, gradeId, subjectId)) {
            RecentActivityDTO dto = new RecentActivityDTO();
            dto.setId(((Number) row.get("id")).longValue());
            dto.setTitulo((String) row.get("title"));
            dto.setMateria((String) row.get("materia"));
            dto.setTipo((String) row.get("type"));
            Timestamp dueDate = (Timestamp) row.get("due_date");
            if (dueDate != null) {
                String formatted = dueDate.toLocalDateTime().format(formatter);
                dto.setVence(formatted.substring(0, 1).toUpperCase() + formatted.substring(1));
            } else {
                dto.setVence("Sin fecha límite");
            }
            recentActivities.add(dto);
        }
        data.setRecentActivities(recentActivities);

        return data;
    }
}
