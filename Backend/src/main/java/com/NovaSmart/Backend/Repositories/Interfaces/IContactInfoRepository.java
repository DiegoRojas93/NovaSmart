package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.ContactInfoModel;

import java.util.List;
import java.util.Optional;

public interface IContactInfoRepository {
    ContactInfoModel save(ContactInfoModel contactInfo);

    Optional<ContactInfoModel> findById(Long id);

    // Agregamos buscar por userId ya que la relación es 1 a 1

    Optional<ContactInfoModel> findByUserId(Long userId);

    List<ContactInfoModel> findAll();

    void deleteById(Long id);
}
