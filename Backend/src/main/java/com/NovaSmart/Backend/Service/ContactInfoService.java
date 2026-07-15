package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.ContactInfoModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IContactInfoRepository;
import com.NovaSmart.Backend.Service.Interfaces.IContactInfoService;
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
public class ContactInfoService implements IContactInfoService {

    private final IContactInfoRepository contactInfoRepository;
    private final Validator validator;

    @Override
    @Transactional
    public ContactInfoModel save(ContactInfoModel contactInfo) {

        BindingResult result = new BeanPropertyBindingResult(contactInfo, "contactInfo");
        validator.validate(contactInfo, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return contactInfoRepository.save(contactInfo);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ContactInfoModel> findById(Long id) {
        return contactInfoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ContactInfoModel> findByUserId(Long userId) {
        return contactInfoRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactInfoModel> findAll() {
        return contactInfoRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        contactInfoRepository.deleteById(id);
    }
}
