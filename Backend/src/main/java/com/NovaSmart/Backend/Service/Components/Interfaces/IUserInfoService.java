package com.NovaSmart.Backend.Service.Components.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.PersonalModel;
import com.NovaSmart.Backend.Model.Components.UserModel;

import java.util.List;
import java.util.Optional;

public interface IUserInfoService {
    UserModel save(UserModel userModel );

    Optional<UserModel> findById (Long id);

    List<UserModel> findAll();

    void deleteById(Long id);

    List<UserModel> findByUserById(Long id);

}
