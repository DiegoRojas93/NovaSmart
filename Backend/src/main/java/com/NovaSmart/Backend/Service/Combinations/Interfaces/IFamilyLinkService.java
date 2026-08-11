package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.FamilyLinkDTO;
import com.NovaSmart.Backend.Model.Combinations.PersonDTO;

import java.util.List;

public interface IFamilyLinkService {
    List<FamilyLinkDTO> getAllFamilyLinks();
    List<PersonDTO> getGuardiansList();
    List<PersonDTO> getStudentsList();
    void createLink(FamilyLinkDTO payload);
    void updateLink(Long guardianId, Long studentId, String relationship);
    void deleteLink(Long guardianId, Long studentId);
}
