package com.NovaSmart.Backend.Service.Interfaces;

import com.NovaSmart.Backend.Model.ContactInfoModel;

import java.util.List;
import java.util.Optional;

public interface IContactInfoService {
    ContactInfoModel save(ContactInfoModel contactInfo);
    Optional<ContactInfoModel> findById(Long id);
    Optional<ContactInfoModel> findByUserId(Long userId);
    List<ContactInfoModel> findAll();
    void deleteById(Long id);
}
