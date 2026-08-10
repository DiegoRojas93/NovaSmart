package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.PersonalModel;
import com.NovaSmart.Backend.Model.Components.ContactInfoModel;
import com.NovaSmart.Backend.Model.Components.EmergencyContactModel;
import com.NovaSmart.Backend.Model.Components.*;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IPersonalManagerService;
import com.NovaSmart.Backend.Service.Components.Interfaces.*;
import com.NovaSmart.Backend.Service.Components.TeacherService;
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
public class PersonalManagerService implements IPersonalManagerService {

    private final IUserInfoService userService;
    private final IRoleService roleService;
    private final IUserRoleService userRoleService;
    private final IContactInfoService contactInfoService;
    private final IEmergencyContactService emergencyContactService;
    private final ITeacherService teacherService;
    private final IStudentService studentService;
    private final IGuardianService guardianService;

    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public Map<String, Object> registerPersonal(
        PersonalModel request,
        MultipartFile photo
    ) {
        UserModel user = request.getUserModel();
        RoleModel role = request.getRoleModel();
        ContactInfoModel contactInfo = request.getContactInfoModel();
        EmergencyContactModel emergencyContact = request.getEmergencyContactModel();
        String profession = request.getProfession();

        // 1. Enlazamos el ID generado al usuario y lo guardamos en el service

        if (photo != null && !photo.isEmpty()) {
            user.setPhoto(fileStorageService.store(photo));
        }

        // 2. Enlazamos la institución al usuario y lo guardamos

        user.setInstitutionId( request.getInstitutionId() );
        UserModel savedUser = userService.save(user);

        // 4. Buscamos si el rol ya existe antes de crearlo

        Optional<RoleModel> existingRole = roleService.findByName(role.getName());
        RoleModel savedRole;

        if (existingRole.isPresent()) {
            savedRole = existingRole.get();
        } else {
            savedRole = roleService.save(role);
        }

        UserRoleModel savedUserRole = new UserRoleModel( user.getId(), savedRole.getId() );

        userRoleService.save( savedUserRole );

//        // 3. Buscamos el rol. Si no existe, es un error del sistema/frontend.
//        RoleModel savedRole = roleService.findByName(role.getName())
//            .orElseThrow(() -> new IllegalArgumentException("El rol '" + role.getName() + "' no existe en el sistema."));
//
//        // 4. Guardamos la relación del usuario con su rol (Ahora savedRole SIEMPRE tiene un ID)
//        UserRoleModel savedUserRole = new UserRoleModel( user.getId(), savedRole.getId() );
//        userRoleService.save( savedUserRole );

        // 5. Enlazamos el ID generado al usuario y lo guardamos

        contactInfo.setUserId( savedUser.getId() );
        ContactInfoModel savedContactInfo = contactInfoService.save(contactInfo);

        // 6. Enlazamos el ID generado al usuario y lo guardamos

        emergencyContact.setUserId( user.getId() );
        EmergencyContactModel savedEmergencyContact = emergencyContactService.save(emergencyContact);

        // 7. Registramos si es un Docente

        System.out.println(savedRole.getName());

        System.out.println("Personal docente".equals(savedRole.getName()));

        System.out.println("--------------------------------------------");

        if ( "Personal docente".equals(savedRole.getName()) ) {

            TeacherModel saveTeacher;

            Optional<TeacherModel> existingProfessionTeacher = teacherService.findByProfession( profession );

            if (existingProfessionTeacher.isPresent()) {
                saveTeacher = existingProfessionTeacher.get();
            } else {

                TeacherModel teacherModel = new TeacherModel( user.getId(), profession );
                saveTeacher = teacherService.save(teacherModel);
            }
        }

        // 7. Registramos si es un estudiante

        System.out.println("Estudiante".equals(savedRole.getName()));

        System.out.println("--------------------------------------------");

        if ( "Estudiante".equals(savedRole.getName()) ) {

            StudentModel studentModel = new StudentModel( savedUser.getId() );
            studentService.save(studentModel);
        }

        // 8. Registramos si es un acudiente

        System.out.println("Acudiente".equals(savedRole.getName()));

        System.out.println("--------------------------------------------");

        if ( "Acudiente".equals(savedRole.getName()) ) {

            GuardianModel saveGuardian;

            Optional<GuardianModel> existingProfessionGuardian = guardianService.findByProfession( profession );

            if (existingProfessionGuardian.isPresent()) {
                saveGuardian = existingProfessionGuardian.get();
            } else {

                GuardianModel guardianModel = new GuardianModel( user.getId(), profession );
                saveGuardian = guardianService.save( guardianModel );
            }
        }

        // 9. Retornamos la respuesta

        Map<String, Object> response = new HashMap<>();
        response.put("user", savedUser);
        response.put("role", savedRole);
        response.put("contactInfo", savedContactInfo);
        response.put("EmergencyContactInfo", savedEmergencyContact);
//        if ( savedRole.getName() == "Personal docente" ) { response.put("Teacher", saveTeacher) };

        return response;
    }
}
