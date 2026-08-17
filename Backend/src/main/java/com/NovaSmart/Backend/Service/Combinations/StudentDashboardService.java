package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.StudentDashboardDTO;
import com.NovaSmart.Backend.Model.Combinations.StudentDashboardRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IStudentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StudentDashboardService implements IStudentDashboardService {

    private final StudentDashboardRepository repository;

    @Override
    public StudentDashboardDTO getDashboardData(Long studentId, Long institutionId) {
        StudentDashboardDTO dto = new StudentDashboardDTO();

        // 1. Datos básicos
        Map<String, Object> studentInfo = repository.getStudentAndCourse(studentId, institutionId);
        dto.setStudentName((String) studentInfo.get("first_name"));
        dto.setCourseName((String) studentInfo.get("course_name"));

        // 2. Tareas Pendientes
        List<Map<String, Object>> rawTasks = repository.getPendingTasks(studentId, institutionId);
        List<StudentDashboardDTO.PendingTaskDTO> pendingTasks = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (Map<String, Object> row : rawTasks) {
            StudentDashboardDTO.PendingTaskDTO task = new StudentDashboardDTO.PendingTaskDTO();
            task.setId(row.get("id").toString());
            task.setSubject((String) row.get("subject_name"));
            task.setTitle((String) row.get("title"));

            String activityType = (String) row.get("type");
            task.setType("HOMEWORK".equals(activityType) ? "Tarea" : "Trabajo en Clase");

            Timestamp timestamp = (Timestamp) row.get("due_date");
            if (timestamp != null) {
                LocalDateTime dueDate = timestamp.toLocalDateTime();

                // Formatear Fecha (Hoy, Mañana, o Fecha normal)
                long daysBetween = ChronoUnit.DAYS.between(now.toLocalDate(), dueDate.toLocalDate());
                DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM, HH:mm");

                if (daysBetween == 0) task.setDueDate("Hoy, " + dueDate.format(timeFormatter));
                else if (daysBetween == 1) task.setDueDate("Mañana, " + dueDate.format(timeFormatter));
                else task.setDueDate(dueDate.format(dateFormatter));

                // Calcular Urgencia (Menos de 48 horas)
                long hoursBetween = ChronoUnit.HOURS.between(now, dueDate);
                task.setUrgent(hoursBetween >= 0 && hoursBetween <= 48);
            }
            pendingTasks.add(task);
        }
        dto.setPendingTasks(pendingTasks);

        // 3. Procesar Horario Semanal y Estado Actual
        List<Map<String, Object>> rawSchedule = repository.getWeeklySchedule(studentId, institutionId);
        Map<String, List<StudentDashboardDTO.ScheduleBlockDTO>> weeklySchedule = new LinkedHashMap<>();
        String[] days = {"Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"};

        for (String day : days) {
            weeklySchedule.put(day, new ArrayList<>());
        }

        int currentDayOfWeek = LocalDate.now().getDayOfWeek().getValue();
        LocalTime currentTime = LocalTime.now();

        StudentDashboardDTO.CurrentStatusDTO statusDTO = new StudentDashboardDTO.CurrentStatusDTO();
        statusDTO.setPendingTasksCount(pendingTasks.size());

        for (Map<String, Object> row : rawSchedule) {
            int dayOfWeek = (Integer) row.get("day_of_week");
            if (dayOfWeek > 7) continue;
            String dayName = days[dayOfWeek - 1];

            StudentDashboardDTO.ScheduleBlockDTO block = new StudentDashboardDTO.ScheduleBlockDTO();
            block.setId(((Number) row.get("id")).longValue());

            LocalTime startTime = ((java.sql.Time) row.get("start_time")).toLocalTime();
            LocalTime endTime = ((java.sql.Time) row.get("end_time")).toLocalTime();

            block.setStartTime(startTime.toString().substring(0, 5));
            block.setEndTime(endTime.toString().substring(0, 5));
            block.setSubject((String) row.get("subject_name"));
            block.setTeacher((String) row.get("teacher_name"));
            block.setPhoto((String) row.get("photo"));
            block.setClassroom((String) row.get("classroom_info"));

            // Evaluar estado SOLO si es el día actual
            if (dayOfWeek == currentDayOfWeek) {
                if (currentTime.isAfter(endTime)) {
                    block.setStatus("COMPLETED");
                } else if (currentTime.isAfter(startTime) && currentTime.isBefore(endTime)) {
                    block.setStatus("IN_PROGRESS");

                    // Asignar a "Clase Actual"
                    StudentDashboardDTO.ClassBlockDTO current = new StudentDashboardDTO.ClassBlockDTO();
                    current.setSubject(block.getSubject());
                    current.setTeacher(block.getTeacher());
                    current.setPhoto(block.getPhoto());
                    current.setTime(block.getStartTime() + " - " + block.getEndTime());
                    current.setClassroom(block.getClassroom());
                    statusDTO.setCurrentClass(current);

                } else {
                    block.setStatus("PENDING");

                    // Asignar "Próxima Clase" si aún no se ha asignado
                    if (statusDTO.getNextClass() == null) {
                        StudentDashboardDTO.ClassBlockDTO next = new StudentDashboardDTO.ClassBlockDTO();
                        next.setSubject(block.getSubject());
                        next.setTeacher(block.getTeacher());
                        next.setPhoto(block.getPhoto());
                        next.setTime(block.getStartTime() + " - " + block.getEndTime());
                        next.setClassroom(block.getClassroom());
                        statusDTO.setNextClass(next);
                    }
                }
            } else {
                block.setStatus("PENDING"); // Si es otro día, por defecto es PENDING (o no aplicable)
            }

            weeklySchedule.get(dayName).add(block);
        }

        // Casos por defecto si no hay clases en curso/próximas
        if (statusDTO.getCurrentClass() == null) {
            StudentDashboardDTO.ClassBlockDTO noClass = new StudentDashboardDTO.ClassBlockDTO();
            noClass.setSubject("Tiempo Libre / Descanso");
            noClass.setTeacher("N/A");
            noClass.setTime("--:--");
            noClass.setClassroom("Campus");
            statusDTO.setCurrentClass(noClass);
        }
        if (statusDTO.getNextClass() == null) {
            StudentDashboardDTO.ClassBlockDTO noNext = new StudentDashboardDTO.ClassBlockDTO();
            noNext.setSubject("No hay más clases hoy");
            noNext.setTeacher("N/A");
            noNext.setTime("--:--");
            noNext.setClassroom("N/A");
            statusDTO.setNextClass(noNext);
        }

        dto.setWeeklySchedule(weeklySchedule);
        dto.setCurrentStatus(statusDTO);

        return dto;
    }
}
