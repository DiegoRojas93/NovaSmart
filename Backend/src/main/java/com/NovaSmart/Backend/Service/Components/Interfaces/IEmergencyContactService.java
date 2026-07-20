package com.NovaSmart.Backend.Service.Components.Interfaces;

import com.NovaSmart.Backend.Model.Components.EmergencyContactModel;

import java.util.List;
import java.util.Optional;

public interface IEmergencyContactService {
    EmergencyContactModel save(EmergencyContactModel emergencyContact);
    Optional<EmergencyContactModel> findById(Long id);
    List<EmergencyContactModel> findByUserId(Long userId);
    List<EmergencyContactModel> findAll();
    void deleteById(Long id);
}
