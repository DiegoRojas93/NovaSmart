package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.TeacherDashboardDTO;
import java.util.List;

public interface ITeacherDashboardService {
    TeacherDashboardDTO getDashboardOverview(Long teacherId, Long institutionId);
    List<TeacherDashboardDTO.StudentPerformanceDTO> getGroupDetails(Long classroomSubjectId, Long institutionId);
}
