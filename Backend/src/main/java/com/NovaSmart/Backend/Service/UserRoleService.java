package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.UserRoleModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IUserRoleRepository;
import com.NovaSmart.Backend.Service.Interfaces.IUserRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserRoleService implements IUserRoleService {

    private final IUserRoleRepository userRoleRepository;
    private final Validator validator;

    @Override
    @Transactional
    public void save(UserRoleModel userRoleModel) {

        BindingResult result = new BeanPropertyBindingResult(userRoleModel, "userRoleModel");
        validator.validate(userRoleModel, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        userRoleRepository.save(userRoleModel);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserRoleModel> findByUserId(Long userId) {
        return userRoleRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserRoleModel> findByRoleId(Long roleId) {
        return userRoleRepository.findByRoleId(roleId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserRoleModel> findAll() {
        return userRoleRepository.findAll();
    }

    @Override
    @Transactional
    public void delete(Long userId, Long roleId) {
        userRoleRepository.delete(userId, roleId);
    }

    @Override
    @Transactional
    public void deleteAllByUserId(Long userId) {
        userRoleRepository.deleteAllByUserId(userId);
    }
}
