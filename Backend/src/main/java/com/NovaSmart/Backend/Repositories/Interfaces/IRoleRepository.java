package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.Components.RoleModel;

import java.util.List;
import java.util.Optional;

public interface IRoleRepository {
    RoleModel save(RoleModel roleModel );

    Optional<RoleModel> findById (Long id);

    List<RoleModel> findAll();

    void deleteById(Long id);
}
