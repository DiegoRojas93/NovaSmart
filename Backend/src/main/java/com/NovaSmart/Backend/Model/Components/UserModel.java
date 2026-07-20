package com.NovaSmart.Backend.Model.Components;

import com.NovaSmart.Backend.Model.Enums.User_status;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.*;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("users") // Mapea a la tabla 'users'
public class UserModel implements UserDetails {
    @Id
    private Long id;

    @NotBlank(message = "El nombre del usuario no puede estar vacío.")
    @Column("first_name")
    private String firstName;

    @NotBlank(message = "El apellido del usuario no puede estar vacío.")
    @Column("last_name")
    private String lastName;

    @NotNull(message = "La fecha de nacimiento es obligatoria.")
    @PastOrPresent(message = "La fecha de nacimiento del usuario no puede ser futura o presente.")
    @Column("birthday") // Corregido para coincidir con la columna SQL 'birthday'
    private LocalDate birthday;

    @NotBlank(message = "El username no puede estar vacío.")
    private String username;

    @NotBlank(message = "El password no puede estar vacío.")
    private String password;

    @Column("is_admin")
    private boolean isAdmin;

    @NotNull(message = "El estado es obligatorio.")
    private User_status status;

    private String photo;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;

    @Column("deleted_at")
    private LocalDateTime deletedAt;

    @Column("institution_id")
    private Long institutionId;

    @Override
    public Collection getAuthorities() {
        // Por ahora le daremos un rol genérico. Más adelante lo conectaremos con tu tabla user_roles
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return this.username; // Asegúrate de que retorne el campo con el que inician sesión
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() {
        // Si tienes un campo status, podrías hacer: return "ACTIVO".equals(this.status);
        return true;
    }
}
