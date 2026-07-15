package com.NovaSmart.Backend.Services;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.Enums.User_status;
import com.NovaSmart.Backend.Model.UserModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IUserRepository;
import com.NovaSmart.Backend.Service.Interfaces.IUserInfoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@DirtiesContext( classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class UserServiceTest {

    @Autowired
    private IUserInfoService userService;
    @Autowired
    private IUserRepository userRepository;

    @Test
    void testSavedValidUser() {
        UserModel validUser = new UserModel(
            null,
            "Diego Fernando",
            "Rojas Quintero",
            LocalDate.of(1993, 9, 11),
            "DRojas1",
            "password123",
            true,
            User_status.ACTIVO,
            "Photo",
            null,
            null,
            null,
            null
        );

        UserModel savedUser = userService.save(validUser);

        assertNotNull(savedUser.getId(), "El usuario guardado debe recibir un ID único.");

        assertNotNull(userRepository
            .findById(savedUser.getId())
            .orElse(null),
        "El usuario debe existir en el repositorio.");
    }

    @Test
    void testSavedInvalidInstitution() {
        UserModel invalidUser = new UserModel(
            null,
            "Diego Fernando",
            "Rojas Quintero",
            LocalDate.of(1993, 9, 11),
            "DRojas1",
            "",
            true,
            User_status.ACTIVO,
            "Photo",
            null,
            null,
            null,
            1L
        );

        assertThrows(
            ValidationException.class,
            () -> userService.save(invalidUser),
            "Debe de lanzarse un ValidationException al evidenciarse que si el password esta vacio.");
    }
}
