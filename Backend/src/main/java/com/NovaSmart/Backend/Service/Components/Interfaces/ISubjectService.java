package com.NovaSmart.Backend.Service.Components.Interfaces;

import com.NovaSmart.Backend.Model.Components.SubjectModel;

import java.util.List;
import java.util.Optional;

public interface ISubjectService {
    SubjectModel save(SubjectModel subject);
    Optional<SubjectModel> findById(Long id);
    List<SubjectModel> findAll();
    void deleteById(Long id);
}
