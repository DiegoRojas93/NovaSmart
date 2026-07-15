package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.ClassroomSubjectModel;

import java.util.List;
import java.util.Optional;

public interface IClassroomSubjectRepository {
    ClassroomSubjectModel save(ClassroomSubjectModel classroomSubject);
    Optional<ClassroomSubjectModel> findById(Long id);

    // Búsquedas clave para tu lógica de negocio
    List<ClassroomSubjectModel> findByClassroomId(Long classroomId);
    List<ClassroomSubjectModel> findByTeacherId(Long teacherId);
    List<ClassroomSubjectModel> findByAcademicPeriodId(Long academicPeriodId);

    List<ClassroomSubjectModel> findAll();
    void deleteById(Long id);
}
