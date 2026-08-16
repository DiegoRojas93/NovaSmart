package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GradeSubmissionRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.SubmissionResponseDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.ITeacherSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/teacher-submissions")
public class TeacherSubmissionController {

    private final ITeacherSubmissionService service;

    // 1. Obtener lista completa
    @GetMapping("/{institutionId}/{teacherId}")
    public ResponseEntity<List<SubmissionResponseDTO>> getSubmissions(
        @PathVariable Long institutionId,
        @PathVariable Long teacherId) {
        return ResponseEntity.ok(service.getSubmissionsByTeacher(teacherId, institutionId));
    }

    // 2. Guardar calificaciones masivas (JSON normal, no Multipart)
    @PutMapping("/{institutionId}/grade")
    public ResponseEntity<?> saveGrades(
        @PathVariable Long institutionId,
        @RequestBody List<GradeSubmissionRequestDTO> submissions) {

        service.saveGrades(submissions, institutionId);
        return ResponseEntity.ok(Map.of("message", "Calificaciones guardadas exitosamente"));
    }

    // 3. Reabrir una entrega
    @PutMapping("/{institutionId}/reopen/{submissionId}")
    public ResponseEntity<?> reopenSubmission(
        @PathVariable Long institutionId,
        @PathVariable Long submissionId) {

        service.reopenSubmission(submissionId, institutionId);
        return ResponseEntity.ok(Map.of("message", "La entrega fue reabierta para el estudiante."));
    }
}
