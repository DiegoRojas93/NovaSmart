package com.NovaSmart.Backend.RestController.Components;

import com.NovaSmart.Backend.Model.Components.UserModel;
import com.NovaSmart.Backend.Service.Components.Interfaces.IUserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final IUserInfoService userInfoService;

    @GetMapping()
    public List<UserModel> getAllUsers() {
        return userInfoService.findAll();
    }

    @GetMapping("/{id}")
    public UserModel getUserById(@PathVariable Long id){
        Optional<UserModel> info = userInfoService.findById(id);

        if (info.isPresent()) {
            return info.get();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La institución no está disponible según este ID: " + id);
        }
    }

    @PutMapping("/{id}")
    public UserModel update(@PathVariable Long id, @RequestBody UserModel userModel) {
        userModel.setId(id);
        return userInfoService.save(userModel);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userInfoService.deleteById(id);
    }
}
