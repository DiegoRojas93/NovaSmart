package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GuardianDashboardDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IGuardianDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/guardian-dashboard")
public class GuardianDashboardController {

    private final IGuardianDashboardService service;

    @GetMapping("/{guardianId}")
    public ResponseEntity<GuardianDashboardDTO> getDashboard(@PathVariable Long guardianId) {
        return ResponseEntity.ok(service.getDashboard(guardianId));
    }
}
