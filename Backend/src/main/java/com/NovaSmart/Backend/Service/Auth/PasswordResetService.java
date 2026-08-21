package com.NovaSmart.Backend.Service.Auth;

import com.NovaSmart.Backend.Repositories.Auth.PasswordResetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetRepository repository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    public void processForgotPassword(String email) {
        Map<String, Object> userData = repository.findUserDataByEmail(email);

        // Si el usuario existe, extraemos sus datos y generamos el token
        if (userData != null) {
            Long userId = ((Number) userData.get("id")).longValue();
            String username = (String) userData.get("username");
            String firstName = (String) userData.get("first_name");

            String token = UUID.randomUUID().toString();
            // Expira en 15 minutos
            Timestamp expiryDate = new Timestamp(System.currentTimeMillis() + (15 * 60 * 1000));

            repository.saveToken(token, userId, expiryDate);

            // Enviar el correo
            String resetUrl = "http://localhost:5173/reset-password?token=" + token;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Recuperación de Cuenta - NovaSmart");

            // ¡Aquí incluimos el nombre y el usuario!
            message.setText("Hola " + firstName + ",\n\n" +
                "Te recordamos que tu nombre de usuario para ingresar al sistema es: " + username + "\n\n" +
                "Si también solicitaste restablecer tu contraseña, haz clic en el siguiente enlace para crear una nueva (este enlace expira en 15 minutos):\n\n" +
                resetUrl + "\n\n" +
                "Si no fuiste tú quien solicitó esto, ignora este mensaje.");

            mailSender.send(message);
        }
    }

    public boolean resetPassword(String token, String newPassword) {
        Map<String, Object> tokenRecord = repository.findTokenRecord(token);

        if (tokenRecord == null) return false;

        Timestamp expiry = (Timestamp) tokenRecord.get("expiry_date");
        if (expiry.before(new Timestamp(System.currentTimeMillis()))) {
            repository.deleteToken(token);
            return false; // Token expirado
        }

        Long userId = ((Number) tokenRecord.get("user_id")).longValue();
        String encodedPassword = passwordEncoder.encode(newPassword);

        repository.updatePassword(userId, encodedPassword);
        repository.deleteToken(token); // Invalidar token tras usarse

        return true;
    }
}
