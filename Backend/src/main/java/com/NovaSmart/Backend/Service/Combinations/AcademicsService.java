package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.ClassroomDTO;
import com.NovaSmart.Backend.Model.Combinations.GradeDetailDTO;
import com.NovaSmart.Backend.Model.Combinations.GradeSummaryDTO;
import com.NovaSmart.Backend.Model.Combinations.SubjectDTO;
import com.NovaSmart.Backend.Repositories.Combinations.AcademicsRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IAcademicsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AcademicsService implements IAcademicsService {

    private final AcademicsRepository academicsRepository;

    @Override
    public List<GradeSummaryDTO> getAllGrades(Long institutionId) {
        return academicsRepository.getAllGradesSummary(institutionId);
    }

    @Override
    public GradeDetailDTO getGradeDetails(Long gradeId) {
        GradeDetailDTO detail = new GradeDetailDTO();
        detail.setId(gradeId);
        detail.setGradeName(academicsRepository.getGradeNameById(gradeId));
        detail.setClassrooms(academicsRepository.getClassroomsByGradeId(gradeId));
        detail.setSubjects(academicsRepository.getSubjectsByGradeId(gradeId));
        return detail;
    }

    @Override
    @Transactional
    public void createGradeStructure(GradeDetailDTO payload, Long institutionId) {
        Long newGradeId = academicsRepository.createGrade(payload.getGradeName(), institutionId);
        processRelations(newGradeId, payload, institutionId);
    }

    @Override
    @Transactional
    public void updateGradeStructure(Long gradeId, GradeDetailDTO payload, Long institutionId) {
        // 1. Actualizar el nombre del Grado
        academicsRepository.updateGrade(gradeId, payload.getGradeName());

        // 2. Obtener los IDs actuales de la BD (antes de borrarlos)
        List<Long> currentClassroomIds = academicsRepository.getClassroomsByGradeId(gradeId)
            .stream().map(ClassroomDTO::getId).toList();

        List<Long> currentSubjectIds = academicsRepository.getSubjectsByGradeId(gradeId)
            .stream().map(SubjectDTO::getId).toList();

        // 3. Obtener los IDs reales que vienen de React (Ignorando los falsos de Date.now())
        List<Long> payloadClassroomIds = payload.getClassrooms().stream()
            .map(ClassroomDTO::getId).filter(id -> id != null && id < 1000000000000L).toList();

        List<Long> payloadSubjectIds = payload.getSubjects().stream()
            .map(SubjectDTO::getId).filter(id -> id != null && id < 1000000000000L).toList();

        // 4. Borrar las relaciones de las tablas puente
        academicsRepository.deleteGradeRelations(gradeId);

        // 5. Aplicar Borrado Lógico a los registros huérfanos (los que quitaste en React)
        currentClassroomIds.stream()
            .filter(id -> !payloadClassroomIds.contains(id))
            .forEach(academicsRepository::softDeleteClassroom);

        currentSubjectIds.stream()
            .filter(id -> !payloadSubjectIds.contains(id))
            .forEach(academicsRepository::softDeleteSubject);

        // 6. Procesar las creaciones y actualizaciones
        processRelations(gradeId, payload, institutionId);
    }

    @Override
    @Transactional
    public void deleteGradeStructure(Long gradeId) {
        academicsRepository.deleteGradeRelations(gradeId);
        academicsRepository.softDeleteGrade(gradeId);
    }

    // Lógica privada para manejar los fakes ID (Date.now()) generados por el frontend en React
    private void processRelations(Long gradeId, GradeDetailDTO payload, Long institutionId) {
        for (ClassroomDTO c : payload.getClassrooms()) {
            Long classId = c.getId();
            // Si el ID es falso o nulo, lo CREAMOS
            if (classId == null || classId > 1000000000000L) {
                classId = academicsRepository.createClassroom(c, institutionId);
            } else {
                // Si es un ID real, lo ACTUALIZAMOS
                academicsRepository.updateClassroom(c);
            }
            academicsRepository.linkGradeClassroom(gradeId, classId);
        }

        for (SubjectDTO s : payload.getSubjects()) {
            Long subId = s.getId();
            // Si el ID es falso o nulo, lo CREAMOS
            if (subId == null || subId > 1000000000000L) {
                subId = academicsRepository.createSubject(s, institutionId);
            } else {
                // Si es un ID real, lo ACTUALIZAMOS
                academicsRepository.updateSubject(s);
            }
            academicsRepository.linkGradeSubject(gradeId, subId);
        }
    }
}
