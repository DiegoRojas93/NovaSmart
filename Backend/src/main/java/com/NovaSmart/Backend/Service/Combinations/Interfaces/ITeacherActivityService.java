package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.GradeSaveRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.TeacherActivityDTO;
import java.util.List;
import java.util.Map;

public interface ITeacherActivityService {
    List<TeacherActivityDTO> getActivitiesWithGrades(Long classroomSubjectId, Integer period, Long institutionId);
    Map<String, Long> createActivity(String title, Long classroomSubjectId, Integer period, Long institutionId);
    void updateActivityTitle(Long activityId, String title, Long institutionId);
    void deleteActivity(Long activityId, Long institutionId);
    void saveGrades(GradeSaveRequestDTO request);
}
