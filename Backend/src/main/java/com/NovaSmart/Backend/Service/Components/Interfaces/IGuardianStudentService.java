package com.NovaSmart.Backend.Service.Components.Interfaces;

import com.NovaSmart.Backend.Model.Components.GuardianAndStudentModel;

import java.util.List;
import java.util.Optional;

public interface IGuardianStudentService {
    void save(GuardianAndStudentModel model);
    Optional<GuardianAndStudentModel> findByIds(Long guardianId, Long studentId);
    List<GuardianAndStudentModel> findByGuardianId(Long guardianId);
    List<GuardianAndStudentModel> findByStudentId(Long studentId);
    List<GuardianAndStudentModel> findAll();
    void delete(Long guardianId, Long studentId);
}
