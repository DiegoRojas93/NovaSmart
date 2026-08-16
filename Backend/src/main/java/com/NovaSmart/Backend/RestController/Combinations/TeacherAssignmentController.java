package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.AssignmentResponseDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.ITeacherAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/teacher-assignments")
public class TeacherAssignmentController {

    private final ITeacherAssignmentService assignmentService;

    @GetMapping("/{institutionId}/{teacherId}")
    public ResponseEntity<List<AssignmentResponseDTO>> getAssignments(
        @PathVariable Long institutionId,
        @PathVariable Long teacherId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByTeacher(teacherId, institutionId));
    }

    @PostMapping(value = "/{institutionId}/create", consumes = "multipart/form-data")
    public ResponseEntity<?> createAssignment(
        @PathVariable Long institutionId,
        @RequestParam String title,
        @RequestParam String description,
        @RequestParam String dueDate,
        @RequestParam Long courseId,
        @RequestParam Integer period,
        @RequestParam String assignmentType,
        @RequestParam(required = false) List<Long> targetStudents,
        @RequestParam(required = false) List<MultipartFile> files) {

        // Llamamos a nuestro servicio limpio
        assignmentService.createAssignment(title, description, dueDate, courseId, period,
            assignmentType, targetStudents, files, institutionId);

        return new ResponseEntity<>(Map.of("message", "Tarea asignada correctamente"), HttpStatus.CREATED);
    }

    // NUEVO ENDPOINT PARA RECIBIR LA ACTUALIZACIÓN
    @PutMapping(value = "/{institutionId}/{activityId}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateAssignment(
        @PathVariable Long institutionId,
        @PathVariable Long activityId,
        @RequestParam String title,
        @RequestParam String description,
        @RequestParam String dueDate,
        @RequestParam(required = false) List<Long> existingFiles,
        @RequestParam(required = false) List<MultipartFile> files) {

        assignmentService.updateAssignment(activityId, title, description, dueDate, existingFiles, files, institutionId);
        return ResponseEntity.ok(Map.of("message", "Tarea actualizada correctamente"));
    }

    @DeleteMapping("/{institutionId}/{activityId}")
    public ResponseEntity<?> deleteAssignment(
        @PathVariable Long institutionId,
        @PathVariable Long activityId) {

        assignmentService.deleteAssignment(activityId, institutionId);
        return ResponseEntity.ok(Map.of("message", "Tarea eliminada exitosamente"));
    }
}
