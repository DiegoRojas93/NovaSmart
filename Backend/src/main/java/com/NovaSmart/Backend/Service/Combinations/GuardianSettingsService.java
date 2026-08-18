package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GuardianSettingsDTO;
import com.NovaSmart.Backend.Repositories.Combinations.GuardianSettingsRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IGuardianSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GuardianSettingsService implements IGuardianSettingsService {

    private final GuardianSettingsRepository repository;

    @Override
    public GuardianSettingsDTO getSettings(Long guardianId) {
        GuardianSettingsDTO response = new GuardianSettingsDTO();
        response.setGuardianData(repository.getGuardianData(guardianId));
        response.setChildrenData(repository.getGuardianStudents(guardianId));
        return response;
    }

    @Override
    @Transactional
    public void updateSettings(Long guardianId, GuardianSettingsDTO dto) {

        // 1. Actualizar Contacto del Acudiente
        GuardianSettingsDTO.GuardianDataDTO gData = dto.getGuardianData();
        if (gData != null) {
            repository.updateContactInfo(guardianId, gData.getEmail(), gData.getPhone(), gData.getAddress(), gData.getCity());
        }

        // 2. Actualizar Estudiantes y Contactos de Emergencia
        if (dto.getChildrenData() != null) {
            for (GuardianSettingsDTO.StudentDataDTO child : dto.getChildrenData()) {
                Long studentId = Long.valueOf(child.getId());

                // Actualizar info de contacto del estudiante (Mandamos null en email para que no lo borre)
                repository.updateContactInfo(studentId, null, child.getPhone(), child.getAddress(), child.getCity());

                // Actualizar Contactos de Emergencia (Este sí se queda como upsert)
                if (child.getEmergencyContact() != null) {
                    repository.upsertEmergencyContact(studentId, child.getEmergencyContact());
                    repository.upsertEmergencyContact(guardianId, child.getEmergencyContact());
                }
            }
        }
    }
}
