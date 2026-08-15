package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GradeSaveRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.TeacherActivityDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.ITeacherActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/teacher-activities")
public class TeacherActivityController {

    private final ITeacherActivityService activityService;

    @GetMapping("/{institutionId}/{classroomSubjectId}")
    public ResponseEntity<List<TeacherActivityDTO>> getActivities(
        @PathVariable Long institutionId,
        @PathVariable Long classroomSubjectId,
        @RequestParam Integer period) {
        return ResponseEntity.ok(activityService.getActivitiesWithGrades(classroomSubjectId, period, institutionId));
    }

    @PostMapping("/{institutionId}/create")
    public ResponseEntity<Map<String, Long>> createActivity(
        @PathVariable Long institutionId,
        @RequestParam Long classroomSubjectId,
        @RequestParam Integer period,
        @RequestParam String title) {
        return new ResponseEntity<>(activityService.createActivity(title, classroomSubjectId, period, institutionId), HttpStatus.CREATED);
    }

    @PutMapping("/{institutionId}/{activityId}")
    public ResponseEntity<?> updateActivity(
        @PathVariable Long institutionId,
        @PathVariable Long activityId,
        @RequestParam String title) {
        activityService.updateActivityTitle(activityId, title, institutionId);
        return ResponseEntity.ok(Map.of("message", "Actividad renombrada"));
    }

    @DeleteMapping("/{institutionId}/{activityId}")
    public ResponseEntity<?> deleteActivity(
        @PathVariable Long institutionId,
        @PathVariable Long activityId) {
        activityService.deleteActivity(activityId, institutionId);
        return ResponseEntity.ok(Map.of("message", "Actividad eliminada"));
    }

    @PostMapping("/{institutionId}/grades")
    public ResponseEntity<?> saveGrades(
        @PathVariable Long institutionId,
        @RequestBody GradeSaveRequestDTO request) {
        request.setInstitutionId(institutionId);
        activityService.saveGrades(request);
        return ResponseEntity.ok(Map.of("message", "Notas guardadas correctamente"));
    }
}
