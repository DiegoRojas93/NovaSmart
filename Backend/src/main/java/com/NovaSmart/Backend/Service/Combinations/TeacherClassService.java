package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.AssignedClassDTO;
import com.NovaSmart.Backend.Repositories.Combinations.TeacherClassRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.ITeacherClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherClassService implements ITeacherClassService {

    private final TeacherClassRepository teacherClassRepository;

    @Override
    public List<AssignedClassDTO> getTeacherClasses(Long teacherId, Long institutionId) {
        return teacherClassRepository.getTeacherClasses(teacherId, institutionId);
    }
}
