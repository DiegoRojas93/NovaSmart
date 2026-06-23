package com.NovaSmart.Backend.Model;

import com.NovaSmart.Backend.Model.Enums.User_status;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserModel {
    private Long id;

    @NotBlank(message = "El nombre del usuario no puede estar vacio.")
    private String first_name;

    @NotBlank(message = "El apellido del usuario no puede estar vacio.")
    private String last_name;

    @NotNull(message = "El fecha de nacimeinto del usuario no puede ser nula.")
    @PastOrPresent(message = "La fecha de nacimeinto del usuario no puede ser futura o presente.")
    private LocalDate date;

    @NotBlank(message = "El username no puede estar vacio.")
    private String username;

    @NotBlank(message = "El password no puede estar vacio.")
    private String password;

    private boolean is_admin;

    @NotNull(message = "El estado es obligatorio.")
    private User_status status;

    private LocalDateTime created_at;

    private LocalDateTime updated_at;

    private LocalDateTime deleted_at;

    private Long institution_id;
}
