package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.StudentDashboardDTO;

public interface IStudentDashboardService {
    StudentDashboardDTO getDashboardData(Long studentId, Long institutionId);
}
