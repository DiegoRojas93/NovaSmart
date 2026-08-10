package com.NovaSmart.Backend.Service.Components.Interfaces;

import com.NovaSmart.Backend.Model.Components.TeacherModel;

import java.util.List;
import java.util.Optional;

public interface ITeacherService {
    TeacherModel save(TeacherModel teacherModel);
    Optional<TeacherModel> findById(Long id);
    List<TeacherModel> findAll();
    Optional<TeacherModel> findByProfession(String name);
    void deleteById(Long id);
}
