package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.Components.StudentGradesModel;

import java.util.List;
import java.util.Optional;

public interface IStudentGradesRepository {
    StudentGradesModel save(StudentGradesModel grade);
    Optional<StudentGradesModel> findById(Long id);
    List<StudentGradesModel> findByEnrollmentId(Long enrollmentId);
    List<StudentGradesModel> findByClassroomSubjectId(Long classroomSubjectId);
    List<StudentGradesModel> findAll();
    void deleteById(Long id);
}
