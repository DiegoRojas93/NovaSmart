package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.StudentAttendanceSummaryDTO;
import com.NovaSmart.Backend.Repositories.Combinations.StudentAttendanceSummaryRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IStudentAttendanceSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StudentAttendanceSummaryService implements IStudentAttendanceSummaryService {
    private final StudentAttendanceSummaryRepository repository;

    @Override
    public StudentAttendanceSummaryDTO getAttendanceDashboard(Long studentId, Long institutionId) {
        StudentAttendanceSummaryDTO dashboard = new StudentAttendanceSummaryDTO();

        // 1. Procesar KPIs (Diccionario)
        List<Map<String, Object>> rawKpis = repository.getAttendanceKpis(studentId, institutionId);
        Map<String, StudentAttendanceSummaryDTO.KpiDataDTO> kpisMap = new HashMap<>();

        StudentAttendanceSummaryDTO.KpiDataDTO allKpi = new StudentAttendanceSummaryDTO.KpiDataDTO();

        for (Map<String, Object> row : rawKpis) {
            String subject = (String) row.get("subject_name");

            StudentAttendanceSummaryDTO.KpiDataDTO kpi = new StudentAttendanceSummaryDTO.KpiDataDTO();
            kpi.setTotalClasses(((Number) row.get("total_classes")).intValue());
            kpi.setPresent(((Number) row.get("present_count")).intValue());
            kpi.setAbsences(((Number) row.get("absent_count")).intValue());
            kpi.setLates(((Number) row.get("late_count")).intValue());
            kpi.setExcused(((Number) row.get("excused_count")).intValue());

            // Fórmula porcentaje: (Clases Totales - Ausencias Injustificadas) / Clases Totales
            double pct = kpi.getTotalClasses() > 0
                ? ((double) (kpi.getTotalClasses() - kpi.getAbsences()) / kpi.getTotalClasses()) * 100.0
                : 100.0;
            kpi.setAttendancePercentage(Math.round(pct * 10.0) / 10.0);

            kpisMap.put(subject, kpi);

            // Acumular para el "ALL" (Global)
            allKpi.setTotalClasses(allKpi.getTotalClasses() + kpi.getTotalClasses());
            allKpi.setPresent(allKpi.getPresent() + kpi.getPresent());
            allKpi.setAbsences(allKpi.getAbsences() + kpi.getAbsences());
            allKpi.setLates(allKpi.getLates() + kpi.getLates());
            allKpi.setExcused(allKpi.getExcused() + kpi.getExcused());
        }

        double allPct = allKpi.getTotalClasses() > 0
            ? ((double) (allKpi.getTotalClasses() - allKpi.getAbsences()) / allKpi.getTotalClasses()) * 100.0
            : 100.0;
        allKpi.setAttendancePercentage(Math.round(allPct * 10.0) / 10.0);

        kpisMap.put("ALL", allKpi);
        dashboard.setKpisData(kpisMap);

        // 2. Procesar Novedades
        List<Map<String, Object>> rawAnomalies = repository.getAttendanceAnomalies(studentId, institutionId);
        List<StudentAttendanceSummaryDTO.AttendanceRecordDTO> records = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd 'de' MMMM, yyyy", new Locale("es", "ES"));

        for (Map<String, Object> row : rawAnomalies) {
            StudentAttendanceSummaryDTO.AttendanceRecordDTO record = new StudentAttendanceSummaryDTO.AttendanceRecordDTO();
            record.setId(row.get("id").toString());
            record.setSubject((String) row.get("subject_name"));
            record.setTeacher((String) row.get("teacher_name"));
            record.setStatus((String) row.get("status"));
            record.setObservations((String) row.get("observations"));

            java.sql.Timestamp timestamp = (java.sql.Timestamp) row.get("date");
            if (timestamp != null) {
                String formatted = timestamp.toLocalDateTime().format(formatter);
                record.setDate(formatted.substring(0, 1).toUpperCase() + formatted.substring(1));
            }
            records.add(record);
        }

        dashboard.setRecords(records);
        return dashboard;
    }
}
