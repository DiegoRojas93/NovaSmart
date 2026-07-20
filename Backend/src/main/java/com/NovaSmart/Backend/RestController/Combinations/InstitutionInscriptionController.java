package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.InstitutionAndUserModel;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IInstitutionInscription;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/institutions/inscription")
public class InstitutionInscriptionController {

    private final IInstitutionInscription institutionInscription;

    @PostMapping( consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    public ResponseEntity<Map<String, Object>> createInstitution(
        @Valid @RequestPart("data") InstitutionAndUserModel request,
        @RequestPart(value = "logo", required = false) MultipartFile logo,
        @RequestPart(value = "banner", required = false) MultipartFile banner,
        @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {

        Map<String, Object> response = institutionInscription.registerInstitutionWithAdmin(request, logo, banner, photo);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
