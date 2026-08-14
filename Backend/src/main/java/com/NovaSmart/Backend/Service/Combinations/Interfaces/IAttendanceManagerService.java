package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.AttendanceRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.StudentAttendanceDTO;
import java.time.LocalDate;
import java.util.List;

public interface IAttendanceManagerService {
    List<StudentAttendanceDTO> getAttendanceList(Long classroomSubjectId, LocalDate date, Long institutionId);
    void saveAttendance(AttendanceRequestDTO request);
    void deleteAttendance(Long classroomSubjectId, LocalDate date, Long institutionId);
}
