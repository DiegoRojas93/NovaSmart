package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.StudentDashboardDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IStudentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student-dashboard")
public class StudentDashboardController {

    private final IStudentDashboardService service;

    @GetMapping("/{institutionId}/{studentId}/overview")
    public ResponseEntity<StudentDashboardDTO> getStudentDashboard(
        @PathVariable Long institutionId,
        @PathVariable Long studentId
    ) {

        return ResponseEntity.ok(service.getDashboardData(studentId, institutionId));
    }
}
