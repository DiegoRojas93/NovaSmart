package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.AssignmentResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ITeacherAssignmentService {
    List<AssignmentResponseDTO> getAssignmentsByTeacher(Long teacherId, Long institutionId);

    void createAssignment(
        String title,
        String description,
        String dueDate,
        Long courseId,
        Integer period, String assignmentType, List<Long> targetStudents,
        List<MultipartFile> files, Long institutionId
    );

    void updateAssignment(
        Long activityId,
        String title,
        String description,
        String dueDate,
        List<Long> existingFiles,
        List<MultipartFile> newFiles,
        Long institutionId
    );

    void deleteAssignment(Long activityId, Long institutionId);

}
