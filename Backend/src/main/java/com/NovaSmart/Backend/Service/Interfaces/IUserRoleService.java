package com.NovaSmart.Backend.Service.Interfaces;

import com.NovaSmart.Backend.Model.UserRoleModel;

import java.util.List;

public interface IUserRoleService {
    void save(UserRoleModel userRoleModel);
    List<UserRoleModel> findByUserId(Long userId);
    List<UserRoleModel> findByRoleId(Long roleId);
    List<UserRoleModel> findAll();
    void delete(Long userId, Long roleId);
    void deleteAllByUserId(Long userId);
}
