package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.StudentTaskResponseDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IStudentTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student-tasks")
public class StudentTaskController {

    private final IStudentTaskService studentTaskService;

    // 1. Obtener todas las tareas pendientes del estudiante
    @GetMapping("/{institutionId}/{studentId}/pending")
    public ResponseEntity<List<StudentTaskResponseDTO>> getPendingTasks(
        @PathVariable Long institutionId,
        @PathVariable Long studentId) {
        return ResponseEntity.ok(studentTaskService.getPendingTasks(studentId, institutionId));
    }

    // 2. Enviar la tarea (MultipartFormData para recibir el archivo)
    @PostMapping(value = "/{institutionId}/{studentId}/submit/{activityId}", consumes = "multipart/form-data")
    public ResponseEntity<?> submitTask(
        @PathVariable Long institutionId,
        @PathVariable Long studentId,
        @PathVariable Long activityId,
        @RequestParam(required = false) String comment,
        @RequestParam("file") MultipartFile file) {

        studentTaskService.submitTask(studentId, activityId, file, comment, institutionId);

        return new ResponseEntity<>(Map.of("message", "Tarea enviada exitosamente"), HttpStatus.OK);
    }
}
