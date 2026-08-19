package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GuardianDashboardDTO;
import com.NovaSmart.Backend.Repositories.Combinations.GuardianDashboardRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IGuardianDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GuardianDashboardService implements IGuardianDashboardService {

    private final GuardianDashboardRepository repository;

    @Override
    public GuardianDashboardDTO getDashboard(Long guardianId) {
        GuardianDashboardDTO dashboard = new GuardianDashboardDTO();
        dashboard.setGuardianName(repository.getGuardianName(guardianId));

        List<Map<String, Object>> rawStudents = repository.getStudentsByGuardian(guardianId);
        List<GuardianDashboardDTO.StudentSummaryDTO> studentsList = new ArrayList<>();

        for (Map<String, Object> row : rawStudents) {
            GuardianDashboardDTO.StudentSummaryDTO student = new GuardianDashboardDTO.StudentSummaryDTO();
            Long studentId = ((Number) row.get("id")).longValue();

            student.setId(studentId.toString());
            student.setName((String) row.get("name"));
            student.setCourse(row.get("course_name") != null ? (String) row.get("course_name") : "Sin Asignar");
            student.setDocument(row.get("document_id") != null ? (String) row.get("document_id") : "N/A");
            student.setStatus(row.get("status") != null ? row.get("status").toString() : "ACTIVO");
            student.setPhoto((String) row.get("photo"));

            // KPIs
            GuardianDashboardDTO.StudentKpisDTO kpis = new GuardianDashboardDTO.StudentKpisDTO();
            double avg = repository.getStudentAverage(studentId);
            int pendingTasks = repository.getStudentPendingTasks(studentId);
            int absences = repository.getStudentAbsences(studentId);

            kpis.setAverage(avg);
            kpis.setPendingTasks(pendingTasks);
            kpis.setAbsencesThisPeriod(absences);
            student.setKpis(kpis);

            // Alertas dinámicas basadas en los KPIs reales
            List<GuardianDashboardDTO.StudentAlertDTO> alerts = new ArrayList<>();
            int alertIdCounter = 1;

            if (pendingTasks > 0) {
                GuardianDashboardDTO.StudentAlertDTO alert = new GuardianDashboardDTO.StudentAlertDTO();
                alert.setId(alertIdCounter++);
                alert.setType("TASK");
                alert.setMessage(pendingTasks + " tarea(s) pendiente(s) por entregar.");
                alert.setUrgent(true);
                alerts.add(alert);
            }

            if (absences > 0) {
                GuardianDashboardDTO.StudentAlertDTO alert = new GuardianDashboardDTO.StudentAlertDTO();
                alert.setId(alertIdCounter++);
                alert.setType("ATTENDANCE");
                alert.setMessage("Registra " + absences + " falla(s) en el periodo actual.");
                alert.setUrgent(true);
                alerts.add(alert);
            }

            if (avg > 0 && avg < 3.0) {
                GuardianDashboardDTO.StudentAlertDTO alert = new GuardianDashboardDTO.StudentAlertDTO();
                alert.setId(alertIdCounter++);
                alert.setType("ACADEMIC");
                alert.setMessage("Rendimiento académico bajo (Promedio: " + avg + ").");
                alert.setUrgent(true);
                alerts.add(alert);
            }

            student.setAlerts(alerts);
            studentsList.add(student);
        }

        dashboard.setStudents(studentsList);
        return dashboard;
    }
}
