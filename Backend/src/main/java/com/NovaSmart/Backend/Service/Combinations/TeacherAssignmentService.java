package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.AssignmentResponseDTO;
import com.NovaSmart.Backend.Repositories.Combinations.TeacherAssignmentRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.ITeacherAssignmentService;
import com.NovaSmart.Backend.Utils.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherAssignmentService implements ITeacherAssignmentService {

    private final TeacherAssignmentRepository assignmentRepository;
    private final FileStorageService fileStorageService;

    @Override
    public List<AssignmentResponseDTO> getAssignmentsByTeacher(Long teacherId, Long institutionId) {
        return assignmentRepository.getAssignmentsByTeacher(teacherId, institutionId);
    }

    @Override
    @Transactional
    public void createAssignment(String title, String description, String dueDate, Long courseId,
                                 Integer period, String assignmentType, List<Long> targetStudents,
                                 List<MultipartFile> files, Long institutionId) {

        // 1. Convertir la fecha que viene de React a LocalDateTime
        LocalDateTime parsedDueDate = LocalDateTime.parse(dueDate);

        // 2. Crear la actividad principal en la BD
        Long activityId = assignmentRepository.createAssignment(title, description, parsedDueDate, courseId, period, institutionId);

        // 3. Guardar los archivos físicos y registrarlos
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String uniqueFilename = fileStorageService.store(file);
                assignmentRepository.saveActivityFile(activityId, file.getOriginalFilename(), uniqueFilename);
            }
        }

        // 4. Asignar la tarea a los estudiantes
        if ("ALL".equalsIgnoreCase(assignmentType)) {
            assignmentRepository.assignToAllStudents(activityId, courseId, institutionId);
        } else if ("SPECIFIC".equalsIgnoreCase(assignmentType) && targetStudents != null && !targetStudents.isEmpty()) {
            assignmentRepository.assignToSpecificStudents(activityId, courseId, targetStudents, institutionId);
        }
    }

    @Override
    @Transactional
    public void updateAssignment(Long activityId, String title, String description, String dueDate,
                                 List<Long> existingFiles, List<MultipartFile> newFiles, Long institutionId) {

        LocalDateTime parsedDueDate = LocalDateTime.parse(dueDate);
        assignmentRepository.updateAssignment(activityId, title, description, parsedDueDate, institutionId);

        // 1. Manejar archivos existentes (Eliminar los que el profe quitó de la vista)
        List<AssignmentResponseDTO.ActivityFileDTO> currentFiles = assignmentRepository.getFilesByActivityId(activityId);
        for (AssignmentResponseDTO.ActivityFileDTO file : currentFiles) {
            // Si la lista que envía React no contiene el ID de este archivo, significa que el profe lo borró
            if (existingFiles == null || !existingFiles.contains(file.getId())) {
                fileStorageService.deleteFile(file.getFileUrl()); // Borrado físico del disco
                assignmentRepository.deleteActivityFile(file.getId()); // Borrado de la base de datos
            }
        }

        // 2. Guardar e insertar los archivos totalmente nuevos
        if (newFiles != null && !newFiles.isEmpty()) {
            for (MultipartFile file : newFiles) {
                String uniqueFilename = fileStorageService.store(file);
                assignmentRepository.saveActivityFile(activityId, file.getOriginalFilename(), uniqueFilename);
            }
        }
    }

    @Override
    @Transactional
    public void deleteAssignment(Long activityId, Long institutionId) {
        // ANTES DE BORRAR LA TAREA, BORRAMOS LOS ARCHIVOS FÍSICOS
        List<AssignmentResponseDTO.ActivityFileDTO> currentFiles = assignmentRepository.getFilesByActivityId(activityId);
        for (AssignmentResponseDTO.ActivityFileDTO file : currentFiles) {
            fileStorageService.deleteFile(file.getFileUrl());
        }

        // Ahora sí, borramos la tarea de la BD (Borrará los registros hijos en cascada)
        assignmentRepository.deleteAssignment(activityId, institutionId);
    }
}
