package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.ScheduleModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IScheduleRepository;
import com.NovaSmart.Backend.Service.Interfaces.IScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScheduleService implements IScheduleService {

    private final IScheduleRepository scheduleRepository;
    private final Validator validator;

    @Override
    @Transactional
    public ScheduleModel save(ScheduleModel schedule) {

        BindingResult result = new BeanPropertyBindingResult(schedule, "schedule");
        validator.validate(schedule, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return scheduleRepository.save(schedule);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ScheduleModel> findById(Long id) {
        return scheduleRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleModel> findByClassroomSubjectId(Long classroomSubjectId) {
        return scheduleRepository.findByClassroomSubjectId(classroomSubjectId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleModel> findAll() {
        return scheduleRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        scheduleRepository.deleteById(id);
    }
}
