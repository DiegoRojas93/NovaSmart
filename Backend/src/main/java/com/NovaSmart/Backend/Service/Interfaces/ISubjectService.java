package com.NovaSmart.Backend.Service.Interfaces;

import com.NovaSmart.Backend.Model.SubjectModel;

import java.util.List;
import java.util.Optional;

public interface ISubjectService {
    SubjectModel save(SubjectModel subject);
    Optional<SubjectModel> findById(Long id);
    List<SubjectModel> findAll();
    void deleteById(Long id);
}
