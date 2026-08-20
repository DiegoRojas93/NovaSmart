package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.GlobalAttendanceDTO;

public interface IGlobalAttendanceService {
    GlobalAttendanceDTO getReportData(Long institutionId, Long courseId, Long subjectId);
}
