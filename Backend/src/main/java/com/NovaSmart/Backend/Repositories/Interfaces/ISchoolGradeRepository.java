package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.Components.SchoolGradeModel;

import java.util.List;
import java.util.Optional;

public interface ISchoolGradeRepository {
    SchoolGradeModel save(SchoolGradeModel schoolGrade);
    Optional<SchoolGradeModel> findById(Long id);
    List<SchoolGradeModel> findAll();
    void deleteById(Long id);
}
