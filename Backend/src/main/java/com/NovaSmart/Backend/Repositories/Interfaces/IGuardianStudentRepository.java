package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.Components.GuardianAndStudentModel;

import java.util.List;
import java.util.Optional;

public interface IGuardianStudentRepository {

    void save(GuardianAndStudentModel guardianAndStudent);

    // Buscar la relación específica
    Optional<GuardianAndStudentModel> findByIds(Long guardianId, Long studentId);

    // Buscar todos los estudiantes de un acudiente
    List<GuardianAndStudentModel> findByGuardianId(Long guardianId);

    // Buscar todos los acudientes de un estudiante
    List<GuardianAndStudentModel> findByStudentId(Long studentId);

    List<GuardianAndStudentModel> findAll();

    void delete(Long guardianId, Long studentId);
}
