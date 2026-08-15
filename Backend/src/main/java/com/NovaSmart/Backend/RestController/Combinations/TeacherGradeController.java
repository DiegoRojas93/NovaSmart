package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GradeRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.StudentGradeDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.ITeacherGradeManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/grades")
public class TeacherGradeController {

    private final ITeacherGradeManagerService gradeService;

    @GetMapping("/{institutionId}/{classroomSubjectId}")
    public ResponseEntity<List<StudentGradeDTO>> getGrades(
        @PathVariable Long institutionId,
        @PathVariable Long classroomSubjectId,
        @RequestParam Integer period) {

        return ResponseEntity.ok(gradeService.getGradesList(classroomSubjectId, period, institutionId));
    }

    @PostMapping("/{institutionId}")
    public ResponseEntity<?> saveGrades(
        @PathVariable Long institutionId,
        @RequestBody GradeRequestDTO request) {

        request.setInstitutionId(institutionId);
        gradeService.saveGrades(request);
        return new ResponseEntity<>(Map.of("message", "Calificaciones guardadas exitosamente"), HttpStatus.OK);
    }

    @DeleteMapping("/{institutionId}/{classroomSubjectId}")
    public ResponseEntity<?> deleteGrades(
        @PathVariable Long institutionId,
        @PathVariable Long classroomSubjectId,
        @RequestParam Integer period) {

        gradeService.deleteGrades(classroomSubjectId, period, institutionId);
        return ResponseEntity.ok(Map.of("message", "Planilla de calificaciones eliminada"));
    }
}
