package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.InstitutionAndUserModel;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IUserDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user1")
public class UserDashboardController {

    private final IUserDashboardService userDashboardService;

    @GetMapping("/{userId}")
    public InstitutionAndUserModel getFullUserProfile(@PathVariable Long userId) {
        Optional<InstitutionAndUserModel> profile = userDashboardService.getFullUserProfileByUserId(userId);

        if (profile.isPresent()) {
            return profile.get();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontró el perfil completo para el usuario con ID: " + userId);
        }
    }
}
