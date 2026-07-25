package com.NovaSmart.Backend.Model.Components;

import com.NovaSmart.Backend.Model.Enums.Document_status;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("contact_info")
public class ContactInfoModel {
    @Id
    private Long id;

    @NotNull(message = "El tipo de documento es obligatorio.")
    @Column("document_type")
    private Document_status documentType; // Ajustado para reflejar el SQL (document_type)

    @NotBlank(message = "La identificación no puede estar vacía.")
    private String identification;

    @NotBlank(message = "El correo electrónico no puede estar vacío.")
    @Email(message = "El formato del correo electrónico no es válido.")
    private String email;

    @Column("phone_number")
    private String phoneNumber;

    private String city;

    private String address;

    @Column("user_id")
    private Long userId; // Cambiado a camelCase
}
