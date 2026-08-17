package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.SubmittedTaskResponseDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IStudentSubmittedTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student-submitted-tasks")
public class StudentSubmittedTaskController {

    private final IStudentSubmittedTaskService service;

    @GetMapping("/{institutionId}/{studentId}")
    public ResponseEntity<List<SubmittedTaskResponseDTO>> getSubmittedTasks(
        @PathVariable Long institutionId,
        @PathVariable Long studentId) {

        return ResponseEntity.ok(service.getSubmittedTasks(studentId, institutionId));
    }
}
