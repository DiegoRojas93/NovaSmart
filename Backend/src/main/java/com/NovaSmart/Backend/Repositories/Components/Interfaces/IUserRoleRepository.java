package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.Components.UserRoleModel;

import java.util.List;

public interface IUserRoleRepository {
    // No retorna nada (o retorna void/boolean) porque no hay ID generado que devolver
    void save(UserRoleModel userRoleModel);

    // Métodos específicos para buscar por usuario o por rol
    List<UserRoleModel> findByUserId(Long userId);
    List<UserRoleModel> findByRoleId(Long roleId);

    // Obtener todas las asignaciones
    List<UserRoleModel> findAll();

    // Eliminar una asignación específica
    void delete(Long userId, Long roleId);

    // Muy útil para cuando eliminas o suspendes a un usuario y quieres quitarle todos sus roles
    void deleteAllByUserId(Long userId);
}
