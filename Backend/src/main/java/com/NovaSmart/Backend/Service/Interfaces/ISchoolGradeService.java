package com.NovaSmart.Backend.Service.Interfaces;

import com.NovaSmart.Backend.Model.SchoolGradeModel;

import java.util.List;
import java.util.Optional;

public interface ISchoolGradeService {
    SchoolGradeModel save(SchoolGradeModel schoolGrade);
    Optional<SchoolGradeModel> findById(Long id);
    List<SchoolGradeModel> findAll();
    void deleteById(Long id);
}
