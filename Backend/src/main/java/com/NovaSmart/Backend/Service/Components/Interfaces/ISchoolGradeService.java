package com.NovaSmart.Backend.Service.Components.Interfaces;

import com.NovaSmart.Backend.Model.Components.SchoolGradeModel;

import java.util.List;
import java.util.Optional;

public interface ISchoolGradeService {
    SchoolGradeModel save(SchoolGradeModel schoolGrade);
    Optional<SchoolGradeModel> findById(Long id);
    List<SchoolGradeModel> findAll();
    void deleteById(Long id);
}
