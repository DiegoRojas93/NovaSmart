package com.NovaSmart.Backend.RestController;

import com.NovaSmart.Backend.Model.Components.UserModel;
import com.NovaSmart.Backend.Repositories.UserRepository;
import com.NovaSmart.Backend.Security.JwtService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {

        // 1. Esto lanza excepción automáticamente si la contraseña es incorrecta
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // 2. Si llega aquí, es válido. Buscamos al usuario para generar el token
        UserModel user = userRepository.findByUsername(request.getUsername()).orElseThrow();

        // 3. Generamos el JWT
        String token = jwtService.generateToken(user.getUsername(), new HashMap<>());

        // 4. Devolvemos el token
        return ResponseEntity.ok(Map.of("token", token));
    }
}

// DTO interno para recibir las credenciales
@Data
class LoginRequest {
    private String username;
    private String password;
}
