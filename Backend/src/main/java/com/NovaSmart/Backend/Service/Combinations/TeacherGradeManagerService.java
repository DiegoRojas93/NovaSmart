package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GradeRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.StudentGradeDTO;
import com.NovaSmart.Backend.Repositories.Combinations.TeacherGradeManagerRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.ITeacherGradeManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherGradeManagerService implements ITeacherGradeManagerService {

    private final TeacherGradeManagerRepository gradeRepository;

    @Override
    public List<StudentGradeDTO> getGradesList(Long classroomSubjectId, Integer period, Long institutionId) {
        return gradeRepository.getGradesList(classroomSubjectId, period, institutionId);
    }

    @Override
    @Transactional
    public void saveGrades(GradeRequestDTO request) {
        for (GradeRequestDTO.RecordDTO record : request.getGrades()) {
            gradeRepository.upsertGradeRecord(
                request.getClassroomSubjectId(),
                request.getPeriod(),
                request.getInstitutionId(),
                record
            );
        }
    }

    @Override
    @Transactional
    public void deleteGrades(Long classroomSubjectId, Integer period, Long institutionId) {
        gradeRepository.deleteGradesByPeriod(classroomSubjectId, period, institutionId);
    }
}
