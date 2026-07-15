package com.NovaSmart.Backend.Service.Interfaces;

import com.NovaSmart.Backend.Model.ClassroomModel;

import java.util.List;
import java.util.Optional;

public interface IClassroomService {
    ClassroomModel save(ClassroomModel classroom);
    Optional<ClassroomModel> findById(Long id);
    List<ClassroomModel> findAll();
    void deleteById(Long id);
}
