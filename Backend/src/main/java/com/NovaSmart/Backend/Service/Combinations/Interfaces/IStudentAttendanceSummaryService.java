package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.StudentAttendanceSummaryDTO;

public interface IStudentAttendanceSummaryService {
    StudentAttendanceSummaryDTO getAttendanceDashboard(Long studentId, Long institutionId);
}
