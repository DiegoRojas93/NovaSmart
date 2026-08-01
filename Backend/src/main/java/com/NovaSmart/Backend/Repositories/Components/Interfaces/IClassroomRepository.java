package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.Components.ClassroomModel;

import java.util.List;
import java.util.Optional;

public interface IClassroomRepository {
    ClassroomModel save(ClassroomModel classroom);
    Optional<ClassroomModel> findById(Long id);
    List<ClassroomModel> findAll();
    void deleteById(Long id);
}
