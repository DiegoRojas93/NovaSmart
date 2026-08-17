package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.TeacherDashboardDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.ITeacherDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/teacher-dashboard")
public class TeacherDashboardController {

    private final ITeacherDashboardService service;

    // 1. Obtener el Dashboard General (KPIs, Horario y Resumen de Grupos)
    @GetMapping("/{institutionId}/{teacherId}/overview")
    public ResponseEntity<TeacherDashboardDTO> getOverview(
        @PathVariable Long institutionId,
        @PathVariable Long teacherId) {
        return ResponseEntity.ok(service.getDashboardOverview(teacherId, institutionId));
    }

    // 2. Obtener el detalle de los estudiantes de un grupo (Drill-down)
    @GetMapping("/{institutionId}/group/{classroomSubjectId}")
    public ResponseEntity<List<TeacherDashboardDTO.StudentPerformanceDTO>> getGroupDetails(
        @PathVariable Long institutionId,
        @PathVariable Long classroomSubjectId) {
        return ResponseEntity.ok(service.getGroupDetails(classroomSubjectId, institutionId));
    }
}
