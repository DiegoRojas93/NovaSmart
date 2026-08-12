package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GradeDetailDTO;
import com.NovaSmart.Backend.Model.Combinations.GradeSummaryDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IAcademicsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/academics/grades")
public class AcademicsController {

    // INYECTAMOS EL SERVICIO (INTERFAZ) EN LUGAR DEL REPOSITORIO
    private final IAcademicsService academicsService;
    private final Long CURRENT_INSTITUTION_ID = 1L; // Mock ID de Institución para simplificar.

    // --- GETTERS (Lecturas) ---
    @GetMapping
    public ResponseEntity<List<GradeSummaryDTO>> getAllGrades() {
        return ResponseEntity.ok(academicsService.getAllGrades(CURRENT_INSTITUTION_ID));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GradeDetailDTO> getGradeDetails(@PathVariable Long id) {
        return ResponseEntity.ok(academicsService.getGradeDetails(id));
    }

    // --- POST (Crear) ---
    @PostMapping
    public ResponseEntity<Map<String, String>> createGrade(@Valid @RequestBody GradeDetailDTO payload) {
        academicsService.createGradeStructure(payload, CURRENT_INSTITUTION_ID);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Estructura académica creada exitosamente.");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // --- PUT (Actualizar) ---
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateGrade(
        @PathVariable Long id,
        @Valid @RequestBody GradeDetailDTO payload) {

        academicsService.updateGradeStructure(id, payload, CURRENT_INSTITUTION_ID);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Estructura académica actualizada correctamente.");
        return ResponseEntity.ok(response);
    }

    // --- DELETE (Eliminar) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteGrade(@PathVariable Long id) {
        academicsService.deleteGradeStructure(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Grado eliminado de forma exitosa.");
        return ResponseEntity.ok(response);
    }
}
