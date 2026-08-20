package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GlobalGradesDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IGlobalGradesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/grades-report")
public class GlobalGradesController {

    private final IGlobalGradesService service;

    @GetMapping("/{institutionId}")
    public ResponseEntity<GlobalGradesDTO> getGradesReport(
        @PathVariable Long institutionId,
        @RequestParam(required = false) Long courseId,
        @RequestParam(required = false) Long subjectId) {

        return ResponseEntity.ok(service.getGradesReport(institutionId, courseId, subjectId));
    }
}
