package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.AcademicsDashboardDTO.*;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IAcademicsDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/academics-dashboard")
public class AcademicsDashboardController {

    private final IAcademicsDashboardService service;

    // Endpoint 1: Carga inicial pesada (KPIs y Filtros)
    @GetMapping("/{institutionId}/structure")
    public ResponseEntity<StructureDataDTO> getStructureData(@PathVariable Long institutionId) {
        return ResponseEntity.ok(service.getStructureData(institutionId));
    }

    // Endpoint 2: Carga ligera y dinámica (Actividades filtradas)
    @GetMapping("/{institutionId}/activities")
    public ResponseEntity<ActivitiesDataDTO> getFilteredActivitiesData(
        @PathVariable Long institutionId,
        @RequestParam(required = false) Long gradeId,
        @RequestParam(required = false) Long subjectId) {

        return ResponseEntity.ok(service.getFilteredActivitiesData(institutionId, gradeId, subjectId));
    }
}
