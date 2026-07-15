package com.NovaSmart.Backend.Service.Interfaces;

import com.NovaSmart.Backend.Model.StudentModel;

import java.util.List;
import java.util.Optional;

public interface IStudentService {
    StudentModel save(StudentModel studentModel);
    Optional<StudentModel> findById(Long id);
    List<StudentModel> findAll();
    void deleteById(Long id);
}
