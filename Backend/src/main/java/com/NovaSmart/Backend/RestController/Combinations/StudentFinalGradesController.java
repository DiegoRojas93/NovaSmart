package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.StudentGradeResponseDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IStudentFinalGradesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student-grades")
public class StudentFinalGradesController {

    private final IStudentFinalGradesService service;

    @GetMapping("/{institutionId}/{studentId}")
    public ResponseEntity<List<StudentGradeResponseDTO>> getFinalGrades(
        @PathVariable Long institutionId,
        @PathVariable Long studentId) {

        return ResponseEntity.ok(service.getFinalGrades(studentId, institutionId));
    }
}
