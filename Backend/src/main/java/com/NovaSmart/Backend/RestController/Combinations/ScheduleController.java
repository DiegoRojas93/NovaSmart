package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.ScheduleFormDTO;
import com.NovaSmart.Backend.Model.Combinations.ScheduleSummaryDTO;
import com.NovaSmart.Backend.Service.Combinations.ScheduleManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/schedules")
public class ScheduleController {

    private final ScheduleManagerService scheduleManagerService;

    // --- MÉTODOS DE LECTURA (Faltaban estos) ---

    @GetMapping("/all/{institutionId}")
    public ResponseEntity<List<ScheduleSummaryDTO>> getAllSchedules(@PathVariable Long institutionId) {
        return ResponseEntity.ok(scheduleManagerService.getAllSchedulesSummary(institutionId));
    }

    @GetMapping("/options/{institutionId}")
    public ResponseEntity<Map<String, Object>> getFormOptions(@PathVariable Long institutionId) {
        return ResponseEntity.ok(scheduleManagerService.getFormOptions(institutionId));
    }

    @GetMapping("/{institutionId}/{scheduleId}")
    public ResponseEntity<ScheduleFormDTO> getScheduleById(@PathVariable Long institutionId, @PathVariable Long scheduleId) {
        return ResponseEntity.ok(scheduleManagerService.getScheduleById(scheduleId, institutionId));
    }

    // --- MÉTODOS DE ESCRITURA (Los que ya tenías) ---

    @PostMapping("/{institutionId}")
    public ResponseEntity<?> createSchedule(
        @PathVariable Long institutionId,
        @RequestBody ScheduleFormDTO request) {

        request.setInstitutionId(institutionId);
        scheduleManagerService.createSchedule(request);
        return new ResponseEntity<>(Map.of("message", "Horario creado exitosamente"), HttpStatus.CREATED);
    }

    @PutMapping("/{institutionId}")
    public ResponseEntity<?> updateSchedule(
        @PathVariable Long institutionId,
        @RequestBody ScheduleFormDTO request) {

        request.setInstitutionId(institutionId);
        scheduleManagerService.updateSchedule(request);
        return new ResponseEntity<>(Map.of("message", "Horario actualizado exitosamente"), HttpStatus.OK);
    }

    @DeleteMapping("/{institutionId}/{classroomSubjectId}")
    public ResponseEntity<?> deleteSchedule(
        @PathVariable Long institutionId,
        @PathVariable Long classroomSubjectId) {

        scheduleManagerService.deleteSchedule(classroomSubjectId, institutionId);
        return new ResponseEntity<>(Map.of("message", "Horario eliminado"), HttpStatus.OK);
    }
}
