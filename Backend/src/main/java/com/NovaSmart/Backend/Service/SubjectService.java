package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.SubjectModel;
import com.NovaSmart.Backend.Repositories.Interfaces.ISubjectRepository;
import com.NovaSmart.Backend.Service.Interfaces.ISubjectService;
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
public class SubjectService implements ISubjectService {

    private final ISubjectRepository subjectRepository;
    private final Validator validator;

    @Override
    @Transactional
    public SubjectModel save(SubjectModel subject) {

        // Asignación de fecha de creación en INSERTS
        if (subject.getId() == null) {
            subject.setCreatedAt(LocalDateTime.now());
        }

        BindingResult result = new BeanPropertyBindingResult(subject, "subject");
        validator.validate(subject, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return subjectRepository.save(subject);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SubjectModel> findById(Long id) {
        return subjectRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectModel> findAll() {
        return subjectRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        subjectRepository.deleteById(id);
    }
}
