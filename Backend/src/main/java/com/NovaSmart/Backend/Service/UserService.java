package com.NovaSmart.Backend.Service;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.UserModel;
import com.NovaSmart.Backend.Repositories.UserRepository;
import com.NovaSmart.Backend.Service.Interfaces.IUserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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
    public UserModel save(UserModel userModel) {

        // INSERT
        if (userModel.getId() == null) {

            userModel.setCreated_at(
                LocalDateTime.now()
            );

            userModel.setUpdated_at(null);

            userModel.setDeleted_at(null);

            // Temporalmente fijo
            // userModel.setInstitution_id(null);
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
    public Optional<UserModel> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public List<UserModel> findAll() {
        return userRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<UserModel> findByUserById(Long id) {
        return List.of();
    }
}
