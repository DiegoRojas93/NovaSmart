package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.EmergencyContactModel;

import java.util.List;
import java.util.Optional;

public interface IEmergencyContactRepository {
    EmergencyContactModel save(EmergencyContactModel emergencyContact);
    Optional<EmergencyContactModel> findById(Long id);
    // Devuelve una lista porque un usuario puede tener varios contactos de emergencia
    List<EmergencyContactModel> findByUserId(Long userId);
    List<EmergencyContactModel> findAll();
    void deleteById(Long id);
}
