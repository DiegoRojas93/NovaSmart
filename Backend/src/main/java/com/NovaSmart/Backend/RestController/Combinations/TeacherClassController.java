package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.AssignedClassDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.ITeacherClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/teacher-classes")
public class TeacherClassController {

    private final ITeacherClassService teacherClassService;

    @GetMapping("/{institutionId}/{teacherId}")
    public ResponseEntity<List<AssignedClassDTO>> getClasses(
        @PathVariable Long institutionId,
        @PathVariable Long teacherId) {

        return ResponseEntity.ok(teacherClassService.getTeacherClasses(teacherId, institutionId));
    }
}
