package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.Components.TeacherModel;

import java.util.List;
import java.util.Optional;

public interface ITeacherRepository {
    TeacherModel save(TeacherModel teacherModel);
    Optional<TeacherModel> findById(Long id);
    List<TeacherModel> findAll();
    void deleteById(Long id);
}
