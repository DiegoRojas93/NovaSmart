package com.NovaSmart.Backend.RestController;

import com.NovaSmart.Backend.Model.Combinations.InstitutionAndUserModel;
import com.NovaSmart.Backend.Model.InstitutionModel;
import com.NovaSmart.Backend.Model.UserModel;
import com.NovaSmart.Backend.Service.Interfaces.IInstitutionsInfoService;
import com.NovaSmart.Backend.Service.Interfaces.IUserInfoService;
import com.NovaSmart.Backend.Service.FileStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/institutions")
public class InstitutionsController {

    private final IInstitutionsInfoService institutionsInfoService;

    private final IUserInfoService userService;

    private final FileStorageService fileStorageService;

    @GetMapping()
    public List<InstitutionModel> getAllInstitutions() {
        return institutionsInfoService.findAll();
    }

    @GetMapping("/{id}")
    public InstitutionModel getInstitutionById(@PathVariable Long id){
        Optional<InstitutionModel> info = institutionsInfoService.findById( id );

        if ( info.isPresent() ) {
            return info.get();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La institución no esta disponible sugún este ID: " + id);
        }
    }

    // 1. IMPORTANTE: Indicar que consume MULTIPART_FORM_DATA
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createInstitution(
        // 2. Cambiamos @RequestBody por @RequestPart("data")
        @Valid @RequestPart("data") InstitutionAndUserModel request,
        // 3. Añadimos los archivos (opcionales)
        @RequestPart(value = "logo", required = false) MultipartFile logo,
        @RequestPart(value = "banner", required = false) MultipartFile banner,
        @RequestPart(value = "photo", required = false) MultipartFile photo
        ) {

        InstitutionModel institution = request.getInstitutionModel();
        UserModel user = request.getUserModel();

        // 4. Guardar archivos si existen (Requiere que inyectes FileStorageService)
        if (logo != null && !logo.isEmpty()) {
            String logoFilename = fileStorageService.store(logo);
            institution.setLogo(logoFilename);
        }

        if (banner != null && !banner.isEmpty()) {
            String bannerFilename = fileStorageService.store(banner);
            institution.setBanner(bannerFilename);
        }

        if (photo != null && !photo.isEmpty()) {
            String bannerFilename = fileStorageService.store(photo);
            user.setPhoto(bannerFilename);
        }

        // 5. Lógica de guardado en base de datos
        InstitutionModel savedInstitution = institutionsInfoService.save(institution);

        user.setInstitutionId(savedInstitution.getId());
        UserModel savedUser = userService.save(user);

        // 6. Respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("institution", savedInstitution);
        response.put("user", savedUser);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/id")
    public InstitutionModel update(@PathVariable Long id, @RequestBody InstitutionModel institutionModel) {
        institutionModel.setId(id);

        return institutionsInfoService.save(institutionModel);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        institutionsInfoService.deleteById(id);
    }
}
