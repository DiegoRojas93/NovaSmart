package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.StudentAttendanceSummaryDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IStudentAttendanceSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student-attendance")
public class StudentAttendanceSummaryController {
    private final IStudentAttendanceSummaryService service;

    @GetMapping("/{institutionId}/{studentId}")
    public ResponseEntity<StudentAttendanceSummaryDTO> getAttendanceDashboard(
        @PathVariable Long institutionId,
        @PathVariable Long studentId) {

        return ResponseEntity.ok(service.getAttendanceDashboard(studentId, institutionId));
    }
}
