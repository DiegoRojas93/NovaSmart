package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GuardianGradesDTO.*;
import com.NovaSmart.Backend.Repositories.Combinations.GuardianGradesRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IGuardianGradesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuardianGradesService implements IGuardianGradesService {

    private final GuardianGradesRepository repository;

    @Override
    public InitialDataDTO getInitialData(Long guardianId, Long institutionId) {
        InitialDataDTO data = new InitialDataDTO();

        // Mapear Niños
        List<ChildDTO> children = new ArrayList<>();
        for (Map<String, Object> row : repository.getChildrenByGuardian(guardianId)) {
            ChildDTO child = new ChildDTO();
            child.setId(row.get("id").toString());
            child.setName((String) row.get("name"));
            child.setCourse(row.get("course") != null ? (String) row.get("course") : "Sin asignar");
            child.setPhoto((String) row.get("photo"));
            children.add(child);
        }
        data.setChildren(children);

        // Mapear Periodos
        List<PeriodDTO> periods = new ArrayList<>();
        for (Map<String, Object> row : repository.getPeriods(institutionId)) {
            PeriodDTO period = new PeriodDTO();
            period.setId(row.get("id").toString());
            period.setName((String) row.get("name"));
            periods.add(period);
        }
        data.setPeriods(periods);

        return data;
    }

    @Override
    public List<SubjectGradeDTO> getStudentGradesDetail(Long studentId, Long periodId) {
        List<Map<String, Object>> subjectsData = repository.getSubjectsAndAverages(studentId, periodId);
        List<Map<String, Object>> allTasks = repository.getTasks(studentId, periodId);
        List<Map<String, Object>> allAbsences = repository.getAbsences(studentId, periodId);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM", new Locale("es", "ES"));
        List<SubjectGradeDTO> responseList = new ArrayList<>();

        for (Map<String, Object> subjectRow : subjectsData) {
            Long classSubjId = ((Number) subjectRow.get("classroom_subject_id")).longValue();

            SubjectGradeDTO subjectDto = new SubjectGradeDTO();
            subjectDto.setId(classSubjId.toString());
            subjectDto.setSubject((String) subjectRow.get("subject_name"));
            subjectDto.setTeacher((String) subjectRow.get("teacher_name"));
            subjectDto.setTeacherPhoto((String) subjectRow.get("teacher_photo"));

            double avgGrade = ((Number) subjectRow.get("average_grade")).doubleValue();
            subjectDto.setGrade(Math.round(avgGrade * 10.0) / 10.0);

            // Generar observación dinámica según nota
            if (avgGrade >= 4.5) subjectDto.setObservations("Excelente desempeño y participación académica.");
            else if (avgGrade >= 4.0) subjectDto.setObservations("Buen proceso, mantiene un nivel estable.");
            else if (avgGrade >= 3.0) subjectDto.setObservations("Aprobado, pero debe mejorar en sus entregas.");
            else if (avgGrade > 0) subjectDto.setObservations("Reprobado. Se requiere mayor compromiso.");
            else subjectDto.setObservations("Sin calificaciones suficientes para evaluar.");

            // Filtrar Tareas de esta materia
            List<TaskDetailDTO> tasks = allTasks.stream()
                .filter(t -> ((Number) t.get("classroom_subject_id")).longValue() == classSubjId)
                .map(t -> {
                    TaskDetailDTO task = new TaskDetailDTO();
                    task.setId(t.get("task_id").toString());
                    task.setTitle((String) t.get("title"));
                    if (t.get("grade") != null) task.setGrade(((Number) t.get("grade")).doubleValue());

                    Timestamp date = (Timestamp) t.get("date");
                    if (date != null) task.setDate(date.toLocalDateTime().format(formatter));
                    return task;
                }).collect(Collectors.toList());
            subjectDto.setTasks(tasks);

            // Filtrar Asistencias de esta materia
            List<AttendanceDetailDTO> absences = allAbsences.stream()
                .filter(a -> ((Number) a.get("classroom_subject_id")).longValue() == classSubjId)
                .map(a -> {
                    AttendanceDetailDTO abs = new AttendanceDetailDTO();
                    abs.setId(a.get("absence_id").toString());
                    abs.setType((String) a.get("type"));

                    Date date = (Date) a.get("date");
                    if (date != null) abs.setDate(date.toLocalDate().format(formatter));
                    return abs;
                }).collect(Collectors.toList());
            subjectDto.setAbsences(absences);

            responseList.add(subjectDto);
        }

        return responseList;
    }
}
