package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.AttendanceRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.StudentAttendanceDTO;
import com.NovaSmart.Backend.Repositories.Combinations.AttendanceManagerRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IAttendanceManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceManagerService implements IAttendanceManagerService {

    private final AttendanceManagerRepository attendanceManagerRepository;

    @Override
    public List<StudentAttendanceDTO> getAttendanceList(Long classroomSubjectId, LocalDate date, Long institutionId) {
        return attendanceManagerRepository.getAttendanceList(classroomSubjectId, date, institutionId);
    }

    @Override
    @Transactional
    public void saveAttendance(AttendanceRequestDTO request) {
        // Iteramos sobre la lista de alumnos enviada por React y hacemos UPSERT de cada uno
        for (AttendanceRequestDTO.RecordDTO record : request.getRecords()) {
            attendanceManagerRepository.upsertAttendanceRecord(
                request.getClassroomSubjectId(),
                request.getAttendanceDate(),
                request.getInstitutionId(),
                record
            );
        }
    }

    @Override
    @Transactional
    public void deleteAttendance(Long classroomSubjectId, LocalDate date, Long institutionId) {
        attendanceManagerRepository.deleteAttendanceByDate(classroomSubjectId, date, institutionId);
    }
}
