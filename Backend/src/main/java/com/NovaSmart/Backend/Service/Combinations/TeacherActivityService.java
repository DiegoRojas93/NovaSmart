package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GradeSaveRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.TeacherActivityDTO;
import com.NovaSmart.Backend.Repositories.Combinations.TeacherActivityRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.ITeacherActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TeacherActivityService implements ITeacherActivityService {

    private final TeacherActivityRepository activityRepository;

    @Override
    public List<TeacherActivityDTO> getActivitiesWithGrades(Long classroomSubjectId, Integer period, Long institutionId) {
        return activityRepository.getActivitiesWithGrades(classroomSubjectId, period, institutionId);
    }

    @Override
    @Transactional
    public Map<String, Long> createActivity(String title, Long classroomSubjectId, Integer period, Long institutionId) {
        Long newId = activityRepository.createActivity(title, classroomSubjectId, period, institutionId);
        Map<String, Long> response = new HashMap<>();
        response.put("id", newId);
        return response; // Devolvemos el ID generado para que React lo use
    }

    @Override
    @Transactional
    public void updateActivityTitle(Long activityId, String title, Long institutionId) {
        activityRepository.updateActivityTitle(activityId, title, institutionId);
    }

    @Override
    @Transactional
    public void deleteActivity(Long activityId, Long institutionId) {
        activityRepository.deleteActivity(activityId, institutionId);
    }

    @Override
    @Transactional
    public void saveGrades(GradeSaveRequestDTO request) {
        for (GradeSaveRequestDTO.RecordDTO record : request.getGrades()) {
            activityRepository.upsertGradeRecord(request.getActivityId(), request.getInstitutionId(), record);
        }
    }
}
