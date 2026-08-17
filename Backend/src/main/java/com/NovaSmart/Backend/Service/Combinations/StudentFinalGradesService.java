package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.StudentGradeResponseDTO;
import com.NovaSmart.Backend.Repositories.Combinations.StudentFinalGradesRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IStudentFinalGradesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentFinalGradesService implements IStudentFinalGradesService {

    private final StudentFinalGradesRepository repository;

    @Override
    public List<StudentGradeResponseDTO> getFinalGrades(Long studentId, Long institutionId) {
        return repository.getStudentFinalGrades(studentId, institutionId);
    }
}
