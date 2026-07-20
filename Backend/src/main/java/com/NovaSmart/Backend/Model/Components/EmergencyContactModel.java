package com.NovaSmart.Backend.Model.Components;

import com.NovaSmart.Backend.Model.Enums.Relationships_status;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("emergency_contacts")
public class EmergencyContactModel {

    @Id
    private Long id;

    @NotBlank(message = "El nombre del contacto no puede estar vacío.")
    @Column("first_name")
    private String firstName;

    @NotBlank(message = "El apellido del contacto no puede estar vacío.")
    @Column("last_name")
    private String lastName;

    @Column("relationship")
    private Relationships_status relationship; // Ajustado al Enum de tu SQL

    @Email(message = "El email no es válido.")
    private String email;

    @Column("phone_number")
    private String phoneNumber;

    private String city;

    private String address;

    @NotNull(message = "El ID del usuario es obligatorio.")
    @Column("user_id")
    private Long userId;
}
