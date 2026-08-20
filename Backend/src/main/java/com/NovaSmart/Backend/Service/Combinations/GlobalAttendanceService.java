package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GlobalAttendanceDTO;
import com.NovaSmart.Backend.Model.Combinations.GlobalAttendanceDTO.*;
import com.NovaSmart.Backend.Repositories.Combinations.GlobalAttendanceRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IGlobalAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GlobalAttendanceService implements IGlobalAttendanceService {

    private final GlobalAttendanceRepository repository;

    @Override
    public GlobalAttendanceDTO getReportData(Long institutionId, Long courseId, Long subjectId) {
        GlobalAttendanceDTO report = new GlobalAttendanceDTO();

        // 1. OBTENER FILTROS DISPONIBLES
        List<FilterOptionDTO> courses = new ArrayList<>();
        for (Map<String, Object> row : repository.getAvailableCourses(institutionId)) {
            FilterOptionDTO opt = new FilterOptionDTO();
            opt.setId(row.get("id").toString());
            opt.setName((String) row.get("name"));
            courses.add(opt);
        }
        report.setAvailableCourses(courses);

        List<FilterOptionDTO> subjects = new ArrayList<>();
        for (Map<String, Object> row : repository.getAvailableSubjects(institutionId)) {
            FilterOptionDTO opt = new FilterOptionDTO();
            opt.setId(row.get("id").toString());
            opt.setName((String) row.get("name"));
            subjects.add(opt);
        }
        report.setAvailableSubjects(subjects);

        // 2. PROCESAR TENDENCIAS (Últimos 5 días)
        List<Map<String, Object>> trendData = repository.getAttendanceTrends(institutionId, courseId, subjectId);
        List<TrendDTO> trends = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE dd", new Locale("es", "ES"));

        // Extraer métricas para el KPI (Usamos el día más reciente, que es el índice 0)
        int latestPresent = 0, latestAbsent = 0, latestLate = 0, latestJustified = 0;

        // Recharts dibuja de izquierda a derecha, invertimos el orden para que el más reciente quede a la derecha
        Collections.reverse(trendData);

        for (Map<String, Object> row : trendData) {
            TrendDTO dto = new TrendDTO();
            Date sqlDate = (Date) row.get("attendance_date");
            LocalDate date = sqlDate.toLocalDate();
            String formattedDate = date.format(formatter);
            dto.setFecha(formattedDate.substring(0, 1).toUpperCase() + formattedDate.substring(1)); // Ej: "Lun 12"

            int p = ((Number) row.get("presente")).intValue();
            int a = ((Number) row.get("ausente")).intValue();
            int t = ((Number) row.get("tarde")).intValue();
            int j = ((Number) row.get("justificado")).intValue();

            dto.setPresente(p);
            dto.setAusente(a);
            dto.setTarde(t);
            dto.setJustificado(j);
            trends.add(dto);

            // Guardamos los del último día real en el loop (el más reciente, que ahora es el último por el reverse)
            latestPresent = p; latestAbsent = a; latestLate = t; latestJustified = j;
        }
        report.setTrends(trends);

        // 3. CALCULAR KPIs (Basado en el día más reciente)
        int total = latestPresent + latestAbsent + latestLate + latestJustified;
        KpisDTO kpis = new KpisDTO();
        kpis.setTotalPresentes(latestPresent);
        kpis.setTotalAusentes(latestAbsent);
        kpis.setTotalTarde(latestLate);
        kpis.setTotalJustificados(latestJustified);

        kpis.setPresentesPerc(total > 0 ? Math.round(((float) latestPresent / total) * 100) : 0);
        kpis.setAusentesPerc(total > 0 ? Math.round(((float) latestAbsent / total) * 100) : 0);
        kpis.setTardePerc(total > 0 ? Math.round(((float) latestLate / total) * 100) : 0);
        kpis.setJustificadosPerc(total > 0 ? Math.round(((float) latestJustified / total) * 100) : 0);
        report.setKpis(kpis);

        // 4. PREPARAR DONA (Distribución del último día)
        List<DistributionDTO> distribution = new ArrayList<>();
        if (latestPresent > 0) distribution.add(createDist("Presente", latestPresent, "#22c55e"));
        if (latestAbsent > 0) distribution.add(createDist("Ausente", latestAbsent, "#ef4444"));
        if (latestLate > 0) distribution.add(createDist("Llegó Tarde", latestLate, "#eab308"));
        if (latestJustified > 0) distribution.add(createDist("Justificado", latestJustified, "#3b82f6"));
        report.setDistribution(distribution);

        // 5. OBTENER REGISTROS DETALLADOS
        List<RecordDTO> records = new ArrayList<>();
        DateTimeFormatter fullDateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (Map<String, Object> row : repository.getRecentRecords(institutionId, courseId, subjectId)) {
            RecordDTO dto = new RecordDTO();
            dto.setId(row.get("id").toString());
            dto.setDate(((Date) row.get("attendance_date")).toLocalDate().format(fullDateFormatter));
            dto.setStudentName((String) row.get("student_name"));
            dto.setStudentPhoto((String) row.get("student_photo"));
            dto.setSubjectName((String) row.get("subject_name"));
            dto.setCourseName((String) row.get("course_name"));
            dto.setStatus((String) row.get("status"));
            dto.setObservations((String) row.get("observations"));
            records.add(dto);
        }
        report.setRecentRecords(records);

        return report;
    }

    private DistributionDTO createDist(String name, int value, String color) {
        DistributionDTO d = new DistributionDTO();
        d.setName(name);
        d.setValue(value);
        d.setColor(color);
        return d;
    }
}
