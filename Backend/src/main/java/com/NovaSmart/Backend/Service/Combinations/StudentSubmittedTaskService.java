package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.SubmittedTaskResponseDTO;
import com.NovaSmart.Backend.Repositories.Combinations.StudentSubmittedTaskRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IStudentSubmittedTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentSubmittedTaskService implements IStudentSubmittedTaskService {

    private final StudentSubmittedTaskRepository repository;

    @Override
    public List<SubmittedTaskResponseDTO> getSubmittedTasks(Long studentId, Long institutionId) {
        return repository.getSubmittedTasks(studentId, institutionId);
    }
}
