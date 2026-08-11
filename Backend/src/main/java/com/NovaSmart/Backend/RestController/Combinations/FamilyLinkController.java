package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.FamilyLinkDTO;
import com.NovaSmart.Backend.Model.Combinations.PersonDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IFamilyLinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/")
public class FamilyLinkController {

    // INYECTAMOS EL SERVICIO EN LUGAR DEL REPOSITORIO
    private final IFamilyLinkService familyLinkService;

    // --- GETTERS (Lecturas) ---
    @GetMapping("family-links")
    public ResponseEntity<List<FamilyLinkDTO>> getAllLinks() {
        return ResponseEntity.ok(familyLinkService.getAllFamilyLinks());
    }

    @GetMapping("users/guardians")
    public ResponseEntity<List<PersonDTO>> getGuardians() {
        return ResponseEntity.ok(familyLinkService.getGuardiansList());
    }

    @GetMapping("users/students")
    public ResponseEntity<List<PersonDTO>> getStudents() {
        return ResponseEntity.ok(familyLinkService.getStudentsList());
    }

    // --- POST (Crear) ---
    @PostMapping("family-links")
    public ResponseEntity<Map<String, String>> createLink(@RequestBody FamilyLinkDTO payload) {
        familyLinkService.createLink(payload);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Vínculo creado exitosamente.");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // --- PUT (Actualizar) ---
    @PutMapping("family-links/{guardianId}/{studentId}")
    public ResponseEntity<Map<String, String>> updateLink(
        @PathVariable Long guardianId,
        @PathVariable Long studentId,
        @RequestBody FamilyLinkDTO payload
    ) {
        familyLinkService.updateLink(guardianId, studentId, payload.getRelationship());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Vínculo actualizado correctamente.");
        return ResponseEntity.ok(response);
    }

    // --- DELETE (Eliminar) ---
    @DeleteMapping("family-links/{guardianId}/{studentId}")
    public ResponseEntity<Map<String, String>> deleteLink(
        @PathVariable Long guardianId,
        @PathVariable Long studentId
    ) {
        familyLinkService.deleteLink(guardianId, studentId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Vínculo eliminado.");
        return ResponseEntity.ok(response);
    }
}
