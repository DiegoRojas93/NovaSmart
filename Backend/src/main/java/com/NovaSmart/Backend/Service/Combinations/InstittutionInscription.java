package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.InstitutionAndUserModel;
import com.NovaSmart.Backend.Model.Components.InstitutionModel;
import com.NovaSmart.Backend.Model.Components.UserModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IInstitutionRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IInstitutionInscription;
import com.NovaSmart.Backend.Service.Components.InstitutionsService;
import com.NovaSmart.Backend.Service.Components.Interfaces.IUserInfoService;
import com.NovaSmart.Backend.Utils.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InstittutionInscription implements IInstitutionInscription {

    private final IInstitutionRepository institutionRepository;

    private final InstitutionsService institutionsService;
    private final IUserInfoService userService;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional // ¡CRÍTICO! Si falla el usuario, se hace un Rollback de la institución
    public Map<String, Object> registerInstitutionWithAdmin(
        InstitutionAndUserModel request,
        MultipartFile logo,
        MultipartFile banner,
        MultipartFile photo) {

        // OJO AQUÍ: Asegúrate de que los métodos get coincidan con tu clase Java
        InstitutionModel institution = request.getInstitutionModel();
        UserModel user = request.getUserModel();

        // 1. Guardar archivos (si existen)
        if (logo != null && !logo.isEmpty()) {
            institution.setLogo(fileStorageService.store(logo));
        }
        if (banner != null && !banner.isEmpty()) {
            institution.setBanner(fileStorageService.store(banner));
        }
        if (photo != null && !photo.isEmpty()) {
            user.setPhoto(fileStorageService.store(photo));
        }

        // 2. Guardamos la institución reutilizando tu método 'save' (que ya tiene validaciones)
        InstitutionModel savedInstitution = institutionsService.save(institution);

        // 3. Enlazamos el ID generado al usuario y lo guardamos
        user.setInstitutionId(savedInstitution.getId());
        UserModel savedUser = userService.save(user);

        // 4. Retornamos la respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("institution", savedInstitution);
        response.put("user", savedUser);

        return response;
    }
}
