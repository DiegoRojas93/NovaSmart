package com.NovaSmart.Backend.Service.Components.Interfaces;

import com.NovaSmart.Backend.Model.Components.RoleModel;

import java.util.List;
import java.util.Optional;

public interface IRoleService {
    RoleModel save(RoleModel roleModel);
    Optional<RoleModel> findById(Long id);
    List<RoleModel> findAll();
    void deleteById(Long id);
    Optional<RoleModel> findByName(String name);
}
