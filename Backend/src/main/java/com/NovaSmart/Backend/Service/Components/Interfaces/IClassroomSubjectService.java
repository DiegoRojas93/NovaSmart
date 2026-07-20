package com.NovaSmart.Backend.Service.Components.Interfaces;

import com.NovaSmart.Backend.Model.Components.ClassroomSubjectModel;

import java.util.List;
import java.util.Optional;

public interface IClassroomSubjectService {
    ClassroomSubjectModel save(ClassroomSubjectModel classroomSubject);
    Optional<ClassroomSubjectModel> findById(Long id);
    List<ClassroomSubjectModel> findByClassroomId(Long classroomId);
    List<ClassroomSubjectModel> findByTeacherId(Long teacherId);
    List<ClassroomSubjectModel> findByAcademicPeriodId(Long academicPeriodId);
    List<ClassroomSubjectModel> findAll();
    void deleteById(Long id);
}
