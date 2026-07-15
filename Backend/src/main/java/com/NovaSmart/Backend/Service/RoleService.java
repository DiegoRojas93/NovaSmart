package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.RoleModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IRoleRepository;
import com.NovaSmart.Backend.Service.Interfaces.IRoleService;
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
public class RoleService implements IRoleService {

    private final IRoleRepository roleRepository;

    private final Validator validator;

    @Override
    @Transactional
    public RoleModel save(RoleModel roleModel) {

        // Validaciones
        BindingResult result = new BeanPropertyBindingResult(roleModel, "roleModel");

        validator.validate(roleModel, result);

        if (result.hasErrors()) {
            throw new ValidationException(result);
        }

        return roleRepository.save(roleModel);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RoleModel> findById(Long id) {
        return roleRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleModel> findAll() {
        return roleRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        roleRepository.deleteById(id);
    }
}
