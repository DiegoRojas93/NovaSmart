package com.NovaSmart.Backend.Service.Components;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.Components.InstitutionModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IInstitutionRepository;
import com.NovaSmart.Backend.Service.Components.Interfaces.IInstitutionsInfoService;
import com.NovaSmart.Backend.Service.Components.Interfaces.IUserInfoService;
import com.NovaSmart.Backend.Utils.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InstitutionsService implements IInstitutionsInfoService {

    private final IInstitutionRepository institutionRepository;

    // Inyectamos las dependencias que antes estaban en el controlador
    private final IUserInfoService userService;
    private final FileStorageService fileStorageService;
    private final Validator validator;

    @Override
    @Transactional
    public InstitutionModel save(InstitutionModel institutionInfo) {

        // INSERT
        if (institutionInfo.getId() == null) {

            institutionInfo.setCreatedAt(
                LocalDateTime.now()
            );

            institutionInfo.setUpdatedAt(null);

            institutionInfo.setDeletedAt(null);

        }

        // UPDATE
        else {

            institutionInfo.setUpdatedAt( LocalDateTime.now() );
        }

        // Validaciones

        BindingResult result = new BeanPropertyBindingResult( institutionInfo, "institutionInfo");

        validator.validate( institutionInfo, result );

        if( result.hasErrors() ) {
            throw new ValidationException( result );
        }

        System.out.println("intitutionService = " + institutionInfo.toString());

        return institutionRepository.save(institutionInfo);
    }

    // Cuando hay archivos
    @Override
    @Transactional
    public InstitutionModel save(InstitutionModel institutionInfo, MultipartFile logo, MultipartFile banner) {

        // 0. Buscamos la información antigua en la base de datos para saber qué borrar
        InstitutionModel existingInstitution = null;
        if (institutionInfo.getId() != null) {
            existingInstitution = institutionRepository.findById(institutionInfo.getId()).orElse(null);
        }

        // 1. Lógica del Logo
        if (logo != null && !logo.isEmpty()) {
            // Si hay un logo nuevo Y existía uno viejo, borramos el viejo del disco
            if (existingInstitution != null && existingInstitution.getLogo() != null) {
                fileStorageService.deleteFile(existingInstitution.getLogo());
            }

            String logoPath = fileStorageService.store(logo);
            institutionInfo.setLogo(logoPath);
        } else if (existingInstitution != null) {
            // Si no envían logo nuevo, conservamos la ruta del viejo para no perderlo
            institutionInfo.setLogo(existingInstitution.getLogo());
        }

        // 2. Lógica del Banner
        if (banner != null && !banner.isEmpty()) {
            // Si hay un banner nuevo Y existía uno viejo, borramos el viejo del disco
            if (existingInstitution != null && existingInstitution.getBanner() != null) {
                fileStorageService.deleteFile(existingInstitution.getBanner());
            }

            String bannerPath = fileStorageService.store(banner);
            institutionInfo.setBanner(bannerPath);
        } else if (existingInstitution != null) {
            // Si no envían banner nuevo, conservamos la ruta del viejo para no perderlo
            institutionInfo.setBanner(existingInstitution.getBanner());
        }

        // 3. Delegamos el guardado final al método save original de ESTA clase
        // IMPORTANTE: Llamar a this.save(institutionInfo) en vez del repository[cite: 9]
        return this.save(institutionInfo);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<InstitutionModel> findById(Long id) {
        return institutionRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstitutionModel> findAll() {
        return institutionRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        institutionRepository.deleteById(id);
    }

}
