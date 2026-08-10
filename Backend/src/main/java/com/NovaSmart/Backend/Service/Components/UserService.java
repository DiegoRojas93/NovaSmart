package com.NovaSmart.Backend.Service.Components;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.Components.UserModel;
import com.NovaSmart.Backend.Repositories.Components.UserRepository;
import com.NovaSmart.Backend.Service.Components.Interfaces.IUserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserInfoService {

    private final UserRepository userRepository;

    private final Validator validator;

    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserModel save(UserModel userModel) {

        // INSERT
        if (userModel.getId() == null) {

            userModel.setPassword(passwordEncoder.encode(userModel.getPassword()));

            userModel.setCreatedAt(
                LocalDateTime.now()
            );

            userModel.setUpdatedAt(null);

            userModel.setDeletedAt(null);

        }

        // UPDATE
        else {

            userModel.setUpdatedAt( LocalDateTime.now() );
        }

        // Validaciones

        BindingResult result = new BeanPropertyBindingResult( userModel, "userModel");

        validator.validate( userModel, result );

        if( result.hasErrors() ) {
            throw new ValidationException( result );
        }

        return userRepository.save(userModel);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserModel> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserModel> findAll() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserModel> findByUserById(Long id) {
        return List.of();
    }
}
