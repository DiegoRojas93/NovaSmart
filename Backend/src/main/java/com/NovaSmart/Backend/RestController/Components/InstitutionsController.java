package com.NovaSmart.Backend.RestController.Components;

import com.NovaSmart.Backend.Model.Components.InstitutionModel;
import com.NovaSmart.Backend.Service.Components.Interfaces.IInstitutionsInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/institutions")
public class InstitutionsController {

    private final IInstitutionsInfoService institutionsInfoService;

    @GetMapping()
    public List<InstitutionModel> getAllInstitutions() {
        return institutionsInfoService.findAll();
    }

    @GetMapping("/{id}")
    public InstitutionModel getInstitutionById(@PathVariable Long id){
        Optional<InstitutionModel> info = institutionsInfoService.findById(id);

        if (info.isPresent()) {
            return info.get();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La institución no está disponible según este ID: " + id);
        }
    }

    @PostMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public InstitutionModel update(
        @PathVariable Long id,
        @RequestPart("data") InstitutionModel institutionModel, // Recibe el Blob con el JSON
        @RequestPart(value = "logo", required = false) MultipartFile logo, // Recibe el logo (opcional)
        @RequestPart(value = "banner", required = false) MultipartFile banner // Recibe el banner (opcional)
    ) {
        institutionModel.setId(id);
        System.out.println(institutionModel.toString());
        return institutionsInfoService.save(institutionModel, logo, banner);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        institutionsInfoService.deleteById(id);
    }
}
