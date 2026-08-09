package com.NovaSmart.Backend.Service.Components.Interfaces;

import com.NovaSmart.Backend.Model.Components.InstitutionModel;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IInstitutionsInfoService {
    // El save original para uso interno (cuando no hay archivos físicos)
    InstitutionModel save(InstitutionModel institutionInfo);

    // El nuevo save sobrecargado para cuando recibes archivos del Frontend
    InstitutionModel save(InstitutionModel institutionInfo, MultipartFile logo, MultipartFile banner);

    Optional<InstitutionModel> findById(Long id);
    List<InstitutionModel> findAll();
    void deleteById(Long id);
}
