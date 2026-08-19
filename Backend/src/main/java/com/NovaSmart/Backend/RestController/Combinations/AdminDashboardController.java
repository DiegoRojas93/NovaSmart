package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.AdminDashboardDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IAdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin-dashboard")
public class AdminDashboardController {

    private final IAdminDashboardService service;

    @GetMapping("/{institutionId}")
    public ResponseEntity<AdminDashboardDTO> getDashboardData(@PathVariable Long institutionId) {
        return ResponseEntity.ok(service.getDashboardData(institutionId));
    }
}
