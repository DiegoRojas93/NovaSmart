package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.GuardianDashboardDTO;

public interface IGuardianDashboardService {
    GuardianDashboardDTO getDashboard(Long guardianId);
}
