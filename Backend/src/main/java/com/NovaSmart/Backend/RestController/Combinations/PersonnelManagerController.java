package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.PersonalModel;
import com.NovaSmart.Backend.Model.Combinations.UserSummaryDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IPersonalManagerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/users/register")
public class PersonnelManagerController {
    private final IPersonalManagerService personalManagerService;

    @PostMapping( consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    public ResponseEntity<Map<String, Object>> createPersonal (
        @Valid @RequestPart("data")PersonalModel request,
        @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {
        Map<String, Object> response = personalManagerService.registerPersonal( request, photo );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/all/{institutionId}")
    public ResponseEntity<List<UserSummaryDTO>> getAllPersonnel(
        @PathVariable("institutionId") Long institutionId
    ) {
        List<UserSummaryDTO> personnelList = personalManagerService.getAllPersonnel(institutionId);
        return new ResponseEntity<>(personnelList, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<PersonalModel> getPersonalById(@PathVariable("userId") Long userId) {
        PersonalModel personal = personalManagerService.getPersonalById(userId);
        return new ResponseEntity<>(personal, HttpStatus.OK);
    }

    // --- NUEVO PUT MAPPING PARA ACTUALIZAR USUARIO ---
    @PutMapping(value = "/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updatePersonal(
        @PathVariable("userId") Long userId,
        @RequestPart("data") PersonalModel request,
        @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {
        // Llamamos al servicio para actualizar
        Map<String, Object> response = personalManagerService.updatePersonal(userId, request, photo);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
