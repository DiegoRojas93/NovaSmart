package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.PersonalModel;
import com.NovaSmart.Backend.Model.Combinations.UserSummaryDTO;
import com.NovaSmart.Backend.Model.Components.ContactInfoModel;
import com.NovaSmart.Backend.Model.Components.EmergencyContactModel;
import com.NovaSmart.Backend.Model.Components.*;
import com.NovaSmart.Backend.Repositories.Combinations.UserFullProfile;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IPersonalManagerService;
import com.NovaSmart.Backend.Service.Components.Interfaces.*;
import com.NovaSmart.Backend.Service.Components.TeacherService;
import com.NovaSmart.Backend.Utils.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
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
    private final UserFullProfile userFullProfile;
    private final PasswordEncoder passwordEncoder;

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

    @Override
    public List<UserSummaryDTO> getAllPersonnel(Long institutionId) {
        // Llama al método del JdbcTemplate
        return userFullProfile.getAllPersonnelSummariesByInstitution(institutionId);
    }

    @Override
    public PersonalModel getPersonalById(Long userId) {
        return userFullProfile.getPersonalModelById(userId)
            .orElseThrow(() -> new RuntimeException("El usuario con ID " + userId + " no existe."));
    }

    @Override
    @Transactional
    public Map<String, Object> updatePersonal(Long userId, PersonalModel request, MultipartFile photo) {

        // 1. Buscamos el usuario actual en la base de datos para no perder datos clave (como contraseñas antiguas)
        UserModel existingUser = (UserModel) userService.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UserModel userRequest = request.getUserModel();

        // Actualizamos los campos básicos
        existingUser.setFirstName(userRequest.getFirstName());
        existingUser.setLastName(userRequest.getLastName());
        existingUser.setBirthday(userRequest.getBirthday());
        existingUser.setUsername(userRequest.getUsername());
        existingUser.setAdmin(userRequest.isAdmin());
        existingUser.setStatus(userRequest.getStatus());

        // --- SOLUCIÓN: MANEJO DE LA CONTRASEÑA ---
        // Solo actualizamos la contraseña si el usuario escribió una nueva en el frontend
        if (userRequest.getPassword() != null && !userRequest.getPassword().trim().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userRequest.getPassword())); // Encriptamos con BCrypt
        }

        // --- SOLUCIÓN: MANEJO DE LA FOTO ---
        // Si subieron una nueva foto, la guardamos y eliminamos la anterior
        if (photo != null && !photo.isEmpty()) {
            // Si el usuario ya tenía una foto guardada, la eliminamos físicamente del disco
            if (existingUser.getPhoto() != null && !existingUser.getPhoto().trim().isEmpty()) {
                fileStorageService.deleteFile(existingUser.getPhoto());
            }
            // Guardamos la nueva foto y le asignamos el nuevo nombre generado al usuario
            existingUser.setPhoto(fileStorageService.store(photo));
        }

        UserModel savedUser = userService.save(existingUser);

        // 2. Actualizar Información de Contacto
        // Buscamos la info de contacto existente usando el userId
        ContactInfoModel existingContactInfo = contactInfoService.findByUserId(userId)
            .orElse(new ContactInfoModel()); // Si no existe, crea una nueva instancia

        ContactInfoModel contactRequest = request.getContactInfoModel();

        // Traspasamos los nuevos datos al objeto existente (que ya tiene su ID principal)
        existingContactInfo.setDocumentType(contactRequest.getDocumentType());
        existingContactInfo.setIdentification(contactRequest.getIdentification());
        existingContactInfo.setEmail(contactRequest.getEmail());
        existingContactInfo.setPhoneNumber(contactRequest.getPhoneNumber());
        existingContactInfo.setCity(contactRequest.getCity());
        existingContactInfo.setAddress(contactRequest.getAddress());
        existingContactInfo.setUserId(userId); // Aseguramos la relación

        // Al guardar 'existingContactInfo', Spring hará un UPDATE
        contactInfoService.save(existingContactInfo);


        // 3. Actualizar Contacto de Emergencia
        List<EmergencyContactModel> emergencies = emergencyContactService.findByUserId(userId);
        EmergencyContactModel existingEmergency;

        // Verificamos si la lista tiene elementos. Si tiene, tomamos el primero. Si no, creamos uno nuevo.
        if (emergencies != null && !emergencies.isEmpty()) {
            existingEmergency = emergencies.get(0);
        } else {
            existingEmergency = new EmergencyContactModel();
        }

        EmergencyContactModel emergencyRequest = request.getEmergencyContactModel();

        existingEmergency.setFirstName(emergencyRequest.getFirstName());
        existingEmergency.setLastName(emergencyRequest.getLastName());
        existingEmergency.setRelationship(emergencyRequest.getRelationship());
        existingEmergency.setEmail(emergencyRequest.getEmail());
        existingEmergency.setPhoneNumber(emergencyRequest.getPhoneNumber());
        existingEmergency.setCity(emergencyRequest.getCity());
        existingEmergency.setAddress(emergencyRequest.getAddress());
        existingEmergency.setUserId(userId);

        emergencyContactService.save(existingEmergency);

        // 4. Retornamos la respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Usuario actualizado correctamente");
        response.put("user", savedUser);

        return response;
    }
}
