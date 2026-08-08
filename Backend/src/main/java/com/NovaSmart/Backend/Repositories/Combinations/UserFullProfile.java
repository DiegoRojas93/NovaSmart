package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.InstitutionAndUserModel;
import com.NovaSmart.Backend.Model.Components.*;
import com.NovaSmart.Backend.Model.Enums.Document_status;
import com.NovaSmart.Backend.Model.Enums.Institution_status;
import com.NovaSmart.Backend.Model.Enums.Relationships_status;
import com.NovaSmart.Backend.Model.Enums.User_status;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserFullProfile {

    private final JdbcTemplate jdbcTemplate;

    public Optional<InstitutionAndUserModel> getByUserId(Long userId) {

        // 1. La Mega-Consulta con LEFT JOIN y Alias para evitar colisión de columnas
        String query = "SELECT " +
            // Usuario
            "u.id AS u_id, " +
            "u.first_name AS u_first_name, " +
            "u.last_name AS u_last_name, " +
            "u.birthday AS u_birthday, " +
            "u.username AS u_username, " +
            "u.password AS u_password, " +
            "u.is_admin AS u_is_admin, " +
            "u.status AS u_status, " +
            "u.photo AS u_photo, " +
            "u.created_at AS u_created_at, " +
            "u.updated_at AS u_updated_at, " +
            "u.deleted_at AS u_deleted_at, " +

            // Institución
            "i.id AS i_id, " +
            "i.nit AS i_nit, " +
            "i.name AS i_name, " +
            "i.department AS i_department, " +
            "i.city AS i_city, " +
            "i.address AS i_address, " +
            "i.vision AS i_vision, " +
            "i.mission AS i_mission, " +
            "i.logo AS i_logo, " +
            "i.banner AS i_banner, " +
            "i.status AS i_status, " +
            "i.created_at AS i_created_at, " +
            "i.updated_at AS i_updated_at, " +
            "i.deleted_at AS i_deleted_at, " +

            // Roles
            "r.id AS r_id, " +
            "r.name AS r_name, " +

            // Contact info
            "c.id AS c_id, " +
            "c.document_type AS c_doc_type, " +
            "c.identification AS c_ident, " +
            "c.email AS c_email, " +
            "c.phone_number AS c_phone, " +
            "c.city AS c_city, " +
            "c.address AS c_address, " +
            "c.user_id AS c_user_id, " +

            // Emergency contact
            "e.id AS e_id, " +
            "e.first_name AS e_first_name, " +
            "e.last_name AS e_last_name, " +
            "e.relationship AS e_rel, " +
            "e.email AS e_email, " +
            "e.phone_number AS e_phone, " +
            "e.city AS e_city, " +
            "e.address AS e_address, " +
            "e.user_id AS e_user_id " +

            // UNIONES
            "FROM users u " +
            "LEFT JOIN institutions i ON u.institution_id = i.id " +
            "LEFT JOIN user_roles ur ON u.id = ur.user_id " +
            "LEFT JOIN roles r ON ur.role_id = r.id " +
            "LEFT JOIN contact_info c ON u.id = c.user_id " +
            "LEFT JOIN emergency_contacts e ON u.id = e.user_id " +
            "WHERE u.id = ?";

        // 2. ResultSetExtractor permite construir un objeto complejo a partir de los Alias
        return jdbcTemplate.query(query, new ResultSetExtractor<Optional<InstitutionAndUserModel>>() {

            @Override
            public Optional<InstitutionAndUserModel> extractData(ResultSet rs) throws SQLException, DataAccessException {

                if (rs.next()) {
                    InstitutionAndUserModel fullProfile = new InstitutionAndUserModel();

                    // --- Mapear Usuario ---
                    UserModel user = new UserModel();
                    user.setId(rs.getLong("u_id"));
                    user.setFirstName(rs.getString("u_first_name"));
                    user.setLastName(rs.getString("u_last_name"));

                    java.sql.Date bDate = rs.getDate("u_birthday");
                    if (bDate != null) user.setBirthday(bDate.toLocalDate());

                    user.setUsername(rs.getString("u_username"));
                    user.setPassword(rs.getString("u_password"));
                    user.setAdmin(rs.getBoolean("u_is_admin"));

                    String userStatus = rs.getString("u_status");
                    if(userStatus != null) user.setStatus(User_status.valueOf(userStatus));

                    user.setPhoto(rs.getString("u_photo"));

                    Timestamp uCreatedAt = rs.getTimestamp("u_created_at");
                    if (uCreatedAt != null) user.setCreatedAt(uCreatedAt.toLocalDateTime());

                    Timestamp uUpdatedAt = rs.getTimestamp("u_updated_at");
                    if (uUpdatedAt != null) user.setUpdatedAt(uUpdatedAt.toLocalDateTime());

                    Timestamp uDeletedAt = rs.getTimestamp("u_deleted_at");
                    if (uDeletedAt != null) user.setDeletedAt(uDeletedAt.toLocalDateTime());

                    // Nota: evitamos setear 'institutionId' porque ya es una llave foránea de la tabla, y se extrae vía LEFT JOIN

                    fullProfile.setUserModel(user);

                    // --- Mapear Institución (Solo si existe) ---
                    if (rs.getObject("i_id") != null) {
                        InstitutionModel inst = new InstitutionModel();
                        inst.setId(rs.getLong("i_id"));
                        inst.setNit(rs.getString("i_nit"));
                        inst.setName(rs.getString("i_name"));
                        inst.setDepartment(rs.getString("i_department"));
                        inst.setCity(rs.getString("i_city"));
                        inst.setAddress(rs.getString("i_address"));
                        inst.setVision(rs.getString("i_vision"));
                        inst.setMission(rs.getString("i_mission"));
                        inst.setLogo(rs.getString("i_logo"));
                        inst.setBanner(rs.getString("i_banner"));

                        String instStatus = rs.getString("i_status");
                        if(instStatus != null) inst.setStatus(Institution_status.valueOf(instStatus));

                        Timestamp iCreatedAt = rs.getTimestamp("i_created_at");
                        if (iCreatedAt != null) inst.setCreatedAt(iCreatedAt.toLocalDateTime());

                        Timestamp iUpdatedAt = rs.getTimestamp("i_updated_at");
                        if (iUpdatedAt != null) inst.setUpdatedAt(iUpdatedAt.toLocalDateTime());

                        Timestamp iDeletedAt = rs.getTimestamp("i_deleted_at");
                        if (iDeletedAt != null) inst.setDeletedAt(iDeletedAt.toLocalDateTime());

                        fullProfile.setInstitutionModel(inst);
                    }

                    // --- Mapear Rol (Solo si existe) ---
                    if (rs.getObject("r_id") != null) {
                        RoleModel role = new RoleModel();
                        role.setId(rs.getLong("r_id"));
                        role.setName(rs.getString("r_name"));
                        fullProfile.setRoleModel(role);
                    }

                    // --- Mapear Contact Info (Solo si existe) ---
                    if (rs.getObject("c_id") != null) {
                        ContactInfoModel contact = new ContactInfoModel();
                        contact.setId(rs.getLong("c_id"));

                        String docType = rs.getString("c_doc_type");
                        if(docType != null) contact.setDocumentType(Document_status.valueOf(docType));

                        contact.setIdentification(rs.getString("c_ident"));
                        contact.setEmail(rs.getString("c_email"));
                        contact.setPhoneNumber(rs.getString("c_phone"));
                        contact.setCity(rs.getString("c_city"));
                        contact.setAddress(rs.getString("c_address"));
                        contact.setUserId(rs.getLong("c_user_id"));

                        fullProfile.setContactInfoModel(contact);
                    }

                    // --- Mapear Emergency Contact (Solo si existe) ---
                    if (rs.getObject("e_id") != null) {
                        EmergencyContactModel emergency = new EmergencyContactModel();
                        emergency.setId(rs.getLong("e_id"));
                        emergency.setFirstName(rs.getString("e_first_name"));
                        emergency.setLastName(rs.getString("e_last_name"));

                        String relType = rs.getString("e_rel");
                        if(relType != null) emergency.setRelationship(Relationships_status.valueOf(relType));

                        emergency.setEmail(rs.getString("e_email"));
                        emergency.setPhoneNumber(rs.getString("e_phone"));
                        emergency.setCity(rs.getString("e_city"));
                        emergency.setAddress(rs.getString("e_address"));
                        emergency.setUserId(rs.getLong("e_user_id"));

                        fullProfile.setEmergencyContactModel(emergency);
                    }

                    return Optional.of(fullProfile);
                }

                return Optional.empty(); // Si el usuario no existe
            }
        }, userId);
    }
}
