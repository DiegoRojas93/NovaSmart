package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GradeSubmissionRequestDTO;
import com.NovaSmart.Backend.Model.Combinations.SubmissionResponseDTO;
import com.NovaSmart.Backend.Repositories.Combinations.TeacherSubmissionRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.ITeacherSubmissionService;
import com.NovaSmart.Backend.Utils.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherSubmissionService implements ITeacherSubmissionService {

    private final TeacherSubmissionRepository repository;
    private final FileStorageService fileStorageService;

    @Override
    public List<SubmissionResponseDTO> getSubmissionsByTeacher(Long teacherId, Long institutionId) {
        return repository.getSubmissionsByTeacher(teacherId, institutionId);
    }

    @Override
    @Transactional
    public void saveGrades(List<GradeSubmissionRequestDTO> submissions, Long institutionId) {
        if (submissions != null && !submissions.isEmpty()) {
            repository.updateGrades(submissions, institutionId);
        }
    }

    @Override
    @Transactional
    public void reopenSubmission(Long submissionId, Long institutionId) {
        // 1. Buscamos el archivo en la base de datos
        String fileUrl = repository.getFileUrl(submissionId, institutionId);

        // 2. Si existe, lo borramos físicamente del disco
        if (fileUrl != null && !fileUrl.trim().isEmpty()) {
            fileStorageService.deleteFile(fileUrl);
        }

        // 3. Reiniciamos el registro en la base de datos
        repository.reopenSubmission(submissionId, institutionId);
    }
}
