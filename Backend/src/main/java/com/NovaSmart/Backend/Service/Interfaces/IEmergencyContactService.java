package com.NovaSmart.Backend.Service.Interfaces;

import com.NovaSmart.Backend.Model.EmergencyContactModel;

import java.util.List;
import java.util.Optional;

public interface IEmergencyContactService {
    EmergencyContactModel save(EmergencyContactModel emergencyContact);
    Optional<EmergencyContactModel> findById(Long id);
    List<EmergencyContactModel> findByUserId(Long userId);
    List<EmergencyContactModel> findAll();
    void deleteById(Long id);
}
