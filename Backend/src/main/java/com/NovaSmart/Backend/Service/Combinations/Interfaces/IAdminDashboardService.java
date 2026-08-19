package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.AdminDashboardDTO;

public interface IAdminDashboardService {
    AdminDashboardDTO getDashboardData(Long institutionId);
}
