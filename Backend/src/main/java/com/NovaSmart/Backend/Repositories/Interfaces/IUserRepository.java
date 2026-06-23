package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.UserModel;

import java.util.List;
import java.util.Optional;

public interface IUserRepository {
    UserModel save(UserModel userModel );

    Optional<UserModel> findById (Long id);

    List<UserModel> findAll();

    void deleteById(Long id);

    List<UserModel> findByAdminUserById(Long id);
}
