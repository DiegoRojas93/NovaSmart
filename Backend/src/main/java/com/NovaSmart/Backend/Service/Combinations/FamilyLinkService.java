package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.FamilyLinkDTO;
import com.NovaSmart.Backend.Model.Combinations.PersonDTO;
import com.NovaSmart.Backend.Repositories.Combinations.FamilyLinkRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IFamilyLinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FamilyLinkService implements IFamilyLinkService {

    private final FamilyLinkRepository familyLinkRepository;

    @Override
    public List<FamilyLinkDTO> getAllFamilyLinks() {
        return familyLinkRepository.getAllFamilyLinks();
    }

    @Override
    public List<PersonDTO> getGuardiansList() {
        return familyLinkRepository.getGuardiansList();
    }

    @Override
    public List<PersonDTO> getStudentsList() {
        return familyLinkRepository.getStudentsList();
    }

    @Override
    @Transactional
    public void createLink(FamilyLinkDTO payload) {
        // Aquí podrías agregar lógica futura, como verificar si el estudiante ya tiene muchos acudientes
        familyLinkRepository.createLink(
            payload.getGuardianId(),
            payload.getStudentId(),
            payload.getRelationship()
        );
    }

    @Override
    @Transactional
    public void updateLink(Long guardianId, Long studentId, String relationship) {
        familyLinkRepository.updateLink(guardianId, studentId, relationship);
    }

    @Override
    @Transactional
    public void deleteLink(Long guardianId, Long studentId) {
        familyLinkRepository.deleteLink(guardianId, studentId);
    }
}
