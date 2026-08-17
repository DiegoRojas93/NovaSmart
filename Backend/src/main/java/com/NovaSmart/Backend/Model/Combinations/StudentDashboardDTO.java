package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class StudentDashboardDTO {
    private String studentName;
    private String courseName;
    private CurrentStatusDTO currentStatus;
    private Map<String, List<ScheduleBlockDTO>> weeklySchedule;
    private List<PendingTaskDTO> pendingTasks;

    @Data
    public static class CurrentStatusDTO {
        private ClassBlockDTO currentClass;
        private ClassBlockDTO nextClass;
        private Integer pendingTasksCount;
    }

    @Data
    public static class ClassBlockDTO {
        private String subject;
        private String teacher;
        private String photo;
        private String time;
        private String classroom;
        private boolean isBreak;
    }

    @Data
    public static class ScheduleBlockDTO {
        private Long id;
        private String startTime;
        private String endTime;
        private String subject;
        private String teacher;
        private String photo;
        private String classroom;
        private String status; // 'PENDING', 'IN_PROGRESS', 'COMPLETED'
    }

    @Data
    public static class PendingTaskDTO {
        private String id;
        private String subject;
        private String title;
        private String dueDate;
        private boolean isUrgent;
        private String type;
    }
}
