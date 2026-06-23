package com.NovaSmart.Backend.RestController;

import com.NovaSmart.Backend.Model.InstitutionAndUserModel;
import com.NovaSmart.Backend.Model.InstitutionModel;
import com.NovaSmart.Backend.Model.UserModel;
import com.NovaSmart.Backend.Service.Interfaces.IInstitutionsInfoService;
import com.NovaSmart.Backend.Service.Interfaces.IUserInfoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/institutions")
public class InstitutionsController {

    private final IInstitutionsInfoService institutionsInfoService;

    private final IUserInfoService userService;


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

    @PostMapping
    public ResponseEntity<Map<String, Object>> createInstitution(@Valid @RequestBody InstitutionAndUserModel request ) {

        // 1. Extraer los datos del request

        InstitutionModel institution = request.getInstitutionModel();
        UserModel user = request.getUserModel();

        // 2. Guardar la institución primero
        InstitutionModel savedInstitution = institutionsInfoService.save(institution);

        // 3. Asignar el ID de la institución recién creada al usuario

        user.setInstitution_id( savedInstitution.getId() );

        // 4. Guardar el usuario (Requiere tu UserService)
        UserModel savedUser = userService.save( user );

        // 5. Preparar la respuesta para el Frontend
        Map<String, Object> response = new HashMap<>();

        response.put("institution", savedInstitution);
        response.put("user", savedUser);

        return new ResponseEntity<>( response, HttpStatus.CREATED );
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
