package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GlobalGradesDTO;
import com.NovaSmart.Backend.Model.Combinations.GlobalGradesDTO.*;
import com.NovaSmart.Backend.Repositories.Combinations.GlobalGradesRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IGlobalGradesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GlobalGradesService implements IGlobalGradesService {

    private final GlobalGradesRepository repository;

    @Override
    public GlobalGradesDTO getGradesReport(Long institutionId, Long courseId, Long subjectId) {
        GlobalGradesDTO report = new GlobalGradesDTO();

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

        // 2. PROMEDIOS POR MATERIA (Para la gráfica de barras)
        List<SubjectAverageDTO> subjectAverages = new ArrayList<>();
        for (Map<String, Object> row : repository.getSubjectAverages(institutionId, courseId, subjectId)) {
            SubjectAverageDTO dto = new SubjectAverageDTO();
            dto.setMateria((String) row.get("materia"));

            // Formatear promedio a 1 decimal
            BigDecimal bd = new BigDecimal(((Number) row.get("promedio")).doubleValue()).setScale(1, RoundingMode.HALF_UP);
            dto.setPromedio(bd.doubleValue());
            subjectAverages.add(dto);
        }
        report.setSubjectAverages(subjectAverages);

        // 3. REGISTROS DETALLADOS Y CÁLCULO DE KPIs
        List<Map<String, Object>> gradesData = repository.getDetailedGrades(institutionId, courseId, subjectId);
        List<GradeRecordDTO> records = new ArrayList<>();

        int totalGrades = 0;
        double sumGrades = 0.0;
        int excCount = 0; // >= 4.5
        int aprCount = 0; // >= 3.0 && < 4.5
        int repCount = 0; // < 3.0

        for (Map<String, Object> row : gradesData) {
            GradeRecordDTO dto = new GradeRecordDTO();
            dto.setId(row.get("id").toString());
            dto.setStudentName((String) row.get("student_name"));
            dto.setStudentPhoto((String) row.get("student_photo"));
            dto.setCourseName((String) row.get("course_name"));
            dto.setSubjectName((String) row.get("subject_name"));
            dto.setPeriod(((Number) row.get("period")).intValue());

            double grade = ((Number) row.get("grade")).doubleValue();
            dto.setGrade(grade);
            dto.setObservations((String) row.get("observations"));
            records.add(dto);

            // Cálculos para KPI
            totalGrades++;
            sumGrades += grade;
            if (grade >= 4.5) excCount++;
            else if (grade >= 3.0) aprCount++;
            else repCount++;
        }
        report.setDetailedRecords(records);

        // 4. CONSOLIDAR KPIs
        KpisDTO kpis = new KpisDTO();
        if (totalGrades > 0) {
            BigDecimal avgBd = new BigDecimal(sumGrades / totalGrades).setScale(1, RoundingMode.HALF_UP);
            kpis.setAvg(avgBd.toString());
            kpis.setExcPerc(Math.round(((float) excCount / totalGrades) * 100));
            kpis.setAprPerc(Math.round(((float) (excCount + aprCount) / totalGrades) * 100)); // Aprobación incluye Excelencia
            kpis.setRepPerc(Math.round(((float) repCount / totalGrades) * 100));
        } else {
            kpis.setAvg("0.0");
            kpis.setExcPerc(0);
            kpis.setAprPerc(0);
            kpis.setRepPerc(0);
        }
        report.setKpis(kpis);

        // 5. PREPARAR DONA (Distribución de notas)
        List<DistributionDTO> distribution = new ArrayList<>();
        if (excCount > 0) distribution.add(createDist("Excelencia", excCount, "#eab308"));
        if (aprCount > 0) distribution.add(createDist("Aprobado", aprCount, "#22c55e"));
        if (repCount > 0) distribution.add(createDist("Riesgo", repCount, "#ef4444"));
        report.setDistribution(distribution);

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
