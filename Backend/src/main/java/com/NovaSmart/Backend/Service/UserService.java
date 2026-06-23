package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.UserModel;
import com.NovaSmart.Backend.Repositories.UserRepository;
import com.NovaSmart.Backend.Service.Interfaces.IUserInfoService;
import lombok.RequiredArgsConstructor;
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

    @Override
    @Transactional
    public UserModel save(UserModel userModel) {

        // INSERT
        if (userModel.getId() == null) {

            userModel.setCreated_at(
                LocalDateTime.now()
            );

            userModel.setUpdated_at(null);

            userModel.setDeleted_at(null);

        }

        // UPDATE
        else {

            userModel.setUpdated_at( LocalDateTime.now() );
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
