package com.NovaSmart.Backend.Service.Interfaces;

import com.NovaSmart.Backend.Model.TeacherModel;

import java.util.List;
import java.util.Optional;

public interface ITeacherService {
    TeacherModel save(TeacherModel teacherModel);
    Optional<TeacherModel> findById(Long id);
    List<TeacherModel> findAll();
    void deleteById(Long id);
}
