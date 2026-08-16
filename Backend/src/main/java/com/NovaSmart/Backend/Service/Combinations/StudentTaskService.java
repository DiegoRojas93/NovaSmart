package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.StudentTaskResponseDTO;
import com.NovaSmart.Backend.Repositories.Combinations.StudentTaskRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IStudentTaskService;
import com.NovaSmart.Backend.Utils.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentTaskService implements IStudentTaskService {

    private final StudentTaskRepository studentTaskRepository;
    private final FileStorageService fileStorageService;

    @Override
    public List<StudentTaskResponseDTO> getPendingTasks(Long studentId, Long institutionId) {
        return studentTaskRepository.getPendingTasks(studentId, institutionId);
    }

    @Override
    @Transactional
    public void submitTask(Long studentId, Long activityId, MultipartFile file, String comment, Long institutionId) {
        String uniqueFilename = null;

        // Guardar el archivo físico en el servidor si el estudiante subió uno
        if (file != null && !file.isEmpty()) {
            uniqueFilename = fileStorageService.store(file);
        }

        // Actualizar la base de datos
        studentTaskRepository.submitTask(studentId, activityId, uniqueFilename, comment, institutionId);
    }
}
