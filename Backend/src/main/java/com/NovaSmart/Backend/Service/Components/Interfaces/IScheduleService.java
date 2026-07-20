package com.NovaSmart.Backend.Service.Components.Interfaces;

import com.NovaSmart.Backend.Model.Components.ScheduleModel;

import java.util.List;
import java.util.Optional;

public interface IScheduleService {
    ScheduleModel save(ScheduleModel schedule);
    Optional<ScheduleModel> findById(Long id);
    List<ScheduleModel> findByClassroomSubjectId(Long classroomSubjectId);
    List<ScheduleModel> findAll();
    void deleteById(Long id);
}
