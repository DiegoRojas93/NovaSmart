package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.PersonalModel;
import com.NovaSmart.Backend.Model.Combinations.UserSummaryDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface IPersonalManagerService {
    Map<String, Object> registerPersonal(
        PersonalModel request,
        MultipartFile photo
    );

    List<UserSummaryDTO> getAllPersonnel( Long institutionId );

    PersonalModel getPersonalById(Long userId);

    // Añade esto debajo de tus otros métodos
    Map<String, Object> updatePersonal(Long userId, PersonalModel request, MultipartFile photo);
}
