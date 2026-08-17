package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.SubmittedTaskResponseDTO;
import java.util.List;

public interface IStudentSubmittedTaskService {
    List<SubmittedTaskResponseDTO> getSubmittedTasks(Long studentId, Long institutionId);
}
