package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GlobalAttendanceDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IGlobalAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/attendance-report")
public class GlobalAttendanceController {

    private final IGlobalAttendanceService service;

    @GetMapping("/{institutionId}")
    public ResponseEntity<GlobalAttendanceDTO> getReportData(
        @PathVariable Long institutionId,
        @RequestParam(required = false) Long courseId,
        @RequestParam(required = false) Long subjectId) {

        return ResponseEntity.ok(service.getReportData(institutionId, courseId, subjectId));
    }
}
