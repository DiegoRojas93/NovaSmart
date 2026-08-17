package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.TeacherDashboardDTO;
import com.NovaSmart.Backend.Repositories.Combinations.TeacherDashboardRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.ITeacherDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherDashboardService implements ITeacherDashboardService {

    private final TeacherDashboardRepository repository;

    @Override
    public TeacherDashboardDTO getDashboardOverview(Long teacherId, Long institutionId) {
        TeacherDashboardDTO dashboard = new TeacherDashboardDTO();

        // PostgreSQL en Java: 1 = Lunes, 7 = Domingo.
        int currentDayOfWeek = LocalDate.now().getDayOfWeek().getValue();

        dashboard.setKpis(repository.getTeacherKPIs(teacherId, institutionId, currentDayOfWeek));
        dashboard.setTodaysSchedule(repository.getTodaysSchedule(teacherId, institutionId, currentDayOfWeek));
        dashboard.setGroups(repository.getTeacherGroups(teacherId, institutionId));

        return dashboard;
    }

    @Override
    public List<TeacherDashboardDTO.StudentPerformanceDTO> getGroupDetails(Long classroomSubjectId, Long institutionId) {
        return repository.getStudentPerformanceByGroup(classroomSubjectId, institutionId);
    }
}
