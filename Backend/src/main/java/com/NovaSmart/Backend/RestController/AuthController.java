package com.NovaSmart.Backend.RestController;

import com.NovaSmart.Backend.Model.Components.UserModel;
import com.NovaSmart.Backend.Repositories.Components.UserRepository;
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
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {

        // 2. Autenticamos al usuario
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // 3. Buscamos al usuario en la BD
        UserModel user = userRepository.findByUsername(request.getUsername()).orElseThrow();

        // 4. Generamos el JWT
        String token = jwtService.generateToken(user.getUsername(), new HashMap<>());

        // 5. Armamos la respuesta con el Token y el ID del usuario
        Map response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId());

        // 6. Devolvemos la respuesta
        return ResponseEntity.ok(response);
    }
}

// DTO interno para recibir las credenciales
@Data
class LoginRequest {
    private String username;
    private String password;
}
