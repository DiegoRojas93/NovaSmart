package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.AttendanceRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.StudentAttendanceDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IAttendanceManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/attendances")
public class AttendanceController {

    private final IAttendanceManagerService attendanceService;

    // Obtener lista (Si ya hay asistencia guardada, traerá los datos, si no, traerá los alumnos en blanco)
    @GetMapping("/{institutionId}/{classroomSubjectId}")
    public ResponseEntity<List<StudentAttendanceDTO>> getAttendanceList(
        @PathVariable Long institutionId,
        @PathVariable Long classroomSubjectId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return ResponseEntity.ok(attendanceService.getAttendanceList(classroomSubjectId, date, institutionId));
    }

    // Guardar o Actualizar (Cubre ambas opciones automáticamente)
    @PostMapping("/{institutionId}")
    public ResponseEntity<?> saveAttendance(
        @PathVariable Long institutionId,
        @RequestBody AttendanceRequestDTO request) {

        request.setInstitutionId(institutionId);
        attendanceService.saveAttendance(request);
        return new ResponseEntity<>(Map.of("message", "Asistencia registrada correctamente"), HttpStatus.OK);
    }

    // Eliminar asistencia completa de un día
    @DeleteMapping("/{institutionId}/{classroomSubjectId}")
    public ResponseEntity<?> deleteAttendance(
        @PathVariable Long institutionId,
        @PathVariable Long classroomSubjectId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        attendanceService.deleteAttendance(classroomSubjectId, date, institutionId);
        return ResponseEntity.ok(Map.of("message", "Registro de asistencia eliminado"));
    }
}
