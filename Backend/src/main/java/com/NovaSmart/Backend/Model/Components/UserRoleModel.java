package com.NovaSmart.Backend.Model.Components;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.relational.core.mapping.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("user_roles")
public class UserRoleModel {
    @NotNull(message = "El ID del usuario es obligatorio.")
    @Column("user_id")
    private Long userId;

    @NotNull(message = "El ID del rol es obligatorio.")
    @Column("role_id")
    private Long roleId;
}
