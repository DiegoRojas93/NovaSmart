package com.NovaSmart.Backend.Service.Components.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.InstitutionAndUserModel;
import com.NovaSmart.Backend.Model.Components.InstitutionModel;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IInstitutionsInfoService {
    InstitutionModel save(InstitutionModel institutionInfo);
    Optional<InstitutionModel> findById(Long id);
    List<InstitutionModel> findAll();
    void deleteById(Long id);
}
