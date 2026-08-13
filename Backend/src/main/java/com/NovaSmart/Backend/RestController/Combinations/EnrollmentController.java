package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.EnrollmentFormDTO;
import com.NovaSmart.Backend.Model.Combinations.EnrollmentSummaryDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IEnrollmentManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/enrollments")
public class EnrollmentController {

    // Nota: Por brevedad, inyecto el repositorio directo aquí, pero idealmente pásalo por tu Service.
    private final IEnrollmentManagerService enrollmentManagerService;

    @GetMapping("/all/{institutionId}")
    public ResponseEntity<List<EnrollmentSummaryDTO>> getAll(@PathVariable Long institutionId) {
        return ResponseEntity.ok(enrollmentManagerService.getAllEnrollments(institutionId));
    }

    @GetMapping("/options/{institutionId}")
    public ResponseEntity<Map<String, Object>> getOptions(@PathVariable Long institutionId) {
        return ResponseEntity.ok(enrollmentManagerService.getFormOptions(institutionId));
    }

    @GetMapping("/{institutionId}/{id}")
    public ResponseEntity<EnrollmentFormDTO> getById(@PathVariable Long institutionId, @PathVariable Long id) {
        return ResponseEntity.ok(enrollmentManagerService.getEnrollmentById(id, institutionId));
    }

    // Endpoint para la previsualización del horario al seleccionar curso y periodo
    @GetMapping("/preview/{institutionId}/{classroomId}/{periodId}")
    public ResponseEntity<List<Map<String, Object>>> getPreview(
        @PathVariable Long institutionId, @PathVariable Long classroomId, @PathVariable Long periodId) {
        return ResponseEntity.ok(enrollmentManagerService.getSchedulePreview(classroomId, periodId, institutionId));
    }

    @PostMapping("/{institutionId}")
    public ResponseEntity<?> create(@PathVariable Long institutionId, @RequestBody EnrollmentFormDTO request) {
        request.setInstitutionId(institutionId);
        enrollmentManagerService.createEnrollment(request);
        return new ResponseEntity<>(Map.of("message", "Matrícula creada"), HttpStatus.CREATED);
    }

    @PutMapping("/{institutionId}")
    public ResponseEntity<?> update(@PathVariable Long institutionId, @RequestBody EnrollmentFormDTO request) {
        request.setInstitutionId(institutionId);
        enrollmentManagerService.updateEnrollment(request);
        return ResponseEntity.ok(Map.of("message", "Matrícula actualizada"));
    }

    @DeleteMapping("/{institutionId}/{id}")
    public ResponseEntity<?> delete(@PathVariable Long institutionId, @PathVariable Long id) {
        enrollmentManagerService.deleteEnrollment(id, institutionId);
        return ResponseEntity.ok(Map.of("message", "Matrícula eliminada"));
    }
}
