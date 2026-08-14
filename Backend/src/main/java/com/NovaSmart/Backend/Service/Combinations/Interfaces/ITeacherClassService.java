package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.AssignedClassDTO;
import java.util.List;

public interface ITeacherClassService {
    List<AssignedClassDTO> getTeacherClasses(Long teacherId, Long institutionId);
}
