package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GuardianGradesDTO.*;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IGuardianGradesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/guardian-grades")
public class GuardianGradesController {

    private final IGuardianGradesService service;

    // Endpoint 1: Carga inicial de selectores
    @GetMapping("/initial-data/{institutionId}/{guardianId}")
    public ResponseEntity<InitialDataDTO> getInitialData(
        @PathVariable Long institutionId,
        @PathVariable Long guardianId) {
        return ResponseEntity.ok(service.getInitialData(guardianId, institutionId));
    }

    // Endpoint 2: Desglose de notas del estudiante
    @GetMapping("/detail/{studentId}/{periodId}")
    public ResponseEntity<List<SubjectGradeDTO>> getStudentGradesDetail(
        @PathVariable Long studentId,
        @PathVariable Long periodId) {
        return ResponseEntity.ok(service.getStudentGradesDetail(studentId, periodId));
    }
}
