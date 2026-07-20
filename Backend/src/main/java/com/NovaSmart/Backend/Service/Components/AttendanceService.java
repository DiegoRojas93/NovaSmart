package com.NovaSmart.Backend.Service.Components;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.Components.AttendanceModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IAttendanceRepository;
import com.NovaSmart.Backend.Service.Components.Interfaces.IAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceService implements IAttendanceService {

    private final IAttendanceRepository attendanceRepository;
    private final Validator validator;

    @Override
    @Transactional
    public AttendanceModel save(AttendanceModel attendance) {

        if (attendance.getId() == null) {
            attendance.setCreatedAt(LocalDateTime.now());
        }

        BindingResult result = new BeanPropertyBindingResult(attendance, "attendance");
        validator.validate(attendance, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return attendanceRepository.save(attendance);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AttendanceModel> findById(Long id) {
        return attendanceRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceModel> findByEnrollmentId(Long enrollmentId) {
        return attendanceRepository.findByEnrollmentId(enrollmentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceModel> findAll() {
        return attendanceRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        attendanceRepository.deleteById(id);
    }
}
