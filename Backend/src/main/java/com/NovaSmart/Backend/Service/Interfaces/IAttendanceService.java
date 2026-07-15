package com.NovaSmart.Backend.Service.Interfaces;

import com.NovaSmart.Backend.Model.AttendanceModel;

import java.util.List;
import java.util.Optional;

public interface IAttendanceService {
    AttendanceModel save(AttendanceModel attendance);
    Optional<AttendanceModel> findById(Long id);
    List<AttendanceModel> findByEnrollmentId(Long enrollmentId);
    List<AttendanceModel> findAll();
    void deleteById(Long id);
}
