package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.InstitutionAndUserModel;
import com.NovaSmart.Backend.Model.Components.*;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IInstitutionInscription;
import com.NovaSmart.Backend.Service.Components.InstitutionsService;
import com.NovaSmart.Backend.Service.Components.Interfaces.*;
import com.NovaSmart.Backend.Utils.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InstitutionInscriptionService implements IInstitutionInscription {

    private final InstitutionsService institutionsService;
    private final IUserInfoService userService;
    private final IRoleService roleService;
    private final IUserRoleService userRoleService;
    private final IContactInfoService contactInfoService;
    private final IEmergencyContactService emergencyContactService;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional // ¡CRÍTICO! Si falla el usuario, se hace un Rollback de la institución
    public Map<String, Object> registerInstitutionWithAdmin(
        InstitutionAndUserModel request,
        MultipartFile logo,
        MultipartFile banner,
        MultipartFile photo) {

        InstitutionModel institution = request.getInstitutionModel();
        UserModel user = request.getUserModel();
        RoleModel role = request.getRoleModel();
        ContactInfoModel contactInfo = request.getContactInfoModel();
        EmergencyContactModel emergencyContact = request.getEmergencyContactModel();

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

        // 2. Guardamos la institución en el service

        InstitutionModel savedInstitution = institutionsService.save(institution);

        // 3. Enlazamos el ID generado al usuario y lo guardamos en el service

        user.setInstitutionId(savedInstitution.getId());
        UserModel savedUser = userService.save(user);

        // 4. Buscamos si el rol ya existe antes de crearlo
        Optional<RoleModel> existingRole = roleService.findByName(role.getName());
        RoleModel savedRole;

        if (existingRole.isPresent()) {
            savedRole = existingRole.get();
        } else {
            savedRole = roleService.save(role);
        }
        // 4. Guardamos el roleUser en el service

        UserRoleModel savedUserRole = new UserRoleModel( user.getId(), savedRole.getId() );

        userRoleService.save( savedUserRole );

        // 5. Enlazamos el ID generado al usuario y lo guardamos

        contactInfo.setUserId( savedUser.getId() );
        ContactInfoModel savedContactInfo = contactInfoService.save(contactInfo);

        // 6. Enlazamos el ID generado al usuario y lo guardamos

        emergencyContact.setUserId( user.getId() );

        EmergencyContactModel savedEmergencyContact = emergencyContactService.save(emergencyContact);

        // 7. Retornamos la respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("institution", savedInstitution);
        response.put("user", savedUser);
        response.put("role", savedRole);
        response.put("contactInfo", savedContactInfo);
        response.put("EmergencyContactInfo", savedEmergencyContact);

        return response;
    }
}
