package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.StudentTaskResponseDTO;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface IStudentTaskService {
    List<StudentTaskResponseDTO> getPendingTasks(Long studentId, Long institutionId);
    void submitTask(Long studentId, Long activityId, MultipartFile file, String comment, Long institutionId);
}
