package com.NovaSmart.Backend.RestController.Auth;

import com.NovaSmart.Backend.Model.Auth.ForgotPasswordRequest;
import com.NovaSmart.Backend.Model.Auth.ResetPasswordRequest;
import com.NovaSmart.Backend.Service.Auth.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService service;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        service.processForgotPassword(request.getEmail());
        // Siempre devolvemos OK por seguridad, exista o no el correo
        return ResponseEntity.ok(Map.of("message", "Si el correo existe, recibirás instrucciones."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean success = service.resetPassword(request.getToken(), request.getNewPassword());

        if (success) {
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada exitosamente."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Token inválido o expirado."));
        }
    }
}
