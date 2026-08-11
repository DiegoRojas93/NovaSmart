package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.FamilyLinkDTO;
import com.NovaSmart.Backend.Model.Combinations.PersonDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class FamilyLinkRepository {

    private final JdbcTemplate jdbcTemplate;

    // --- 1. OBTENER VÍNCULOS ---
    public List<FamilyLinkDTO> getAllFamilyLinks() {
        String query = "SELECT " +
            "gs.guardian_id, CONCAT(ug.first_name, ' ', ug.last_name) AS guardian_name, " +
            "gs.student_id, CONCAT(us.first_name, ' ', us.last_name) AS student_name, " +
            "gs.relationship " +
            "FROM guardian_students gs " +
            "JOIN users ug ON gs.guardian_id = ug.id " +
            "JOIN users us ON gs.student_id = us.id " +
            "ORDER BY gs.guardian_id DESC";

        return jdbcTemplate.query(query, (rs, rowNum) -> new FamilyLinkDTO(
            rs.getLong("guardian_id"),
            rs.getString("guardian_name"),
            rs.getLong("student_id"),
            rs.getString("student_name"),
            rs.getString("relationship")
        ));
    }

    // --- 2. OBTENER LISTADO DE ACUDIENTES ---
    public List<PersonDTO> getGuardiansList() {
        String query = "SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS name, c.identification " +
            "FROM users u " +
            "JOIN guardians g ON u.id = g.id " +
            "LEFT JOIN contact_info c ON u.id = c.user_id " +
            "WHERE u.status = 'ACTIVO'";

        return jdbcTemplate.query(query, (rs, rowNum) -> new PersonDTO(
            rs.getLong("id"),
            rs.getString("name"),
            rs.getString("identification")
        ));
    }

    // --- 3. OBTENER LISTADO DE ESTUDIANTES ---
    public List<PersonDTO> getStudentsList() {
        String query = "SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS name, c.identification " +
            "FROM users u " +
            "JOIN students s ON u.id = s.id " +
            "LEFT JOIN contact_info c ON u.id = c.user_id " +
            "WHERE u.status = 'ACTIVO'";

        return jdbcTemplate.query(query, (rs, rowNum) -> new PersonDTO(
            rs.getLong("id"),
            rs.getString("name"),
            rs.getString("identification")
        ));
    }

    // --- 4. CREAR VÍNCULO ---
    public void createLink(Long guardianId, Long studentId, String relationship) {
        String query = "INSERT INTO guardian_students (guardian_id, student_id, relationship) " +
            "VALUES (?, ?, CAST(? AS relationships))";
        jdbcTemplate.update(query, guardianId, studentId, relationship);
    }

    // --- 5. ACTUALIZAR VÍNCULO ---
    public void updateLink(Long guardianId, Long studentId, String relationship) {
        String query = "UPDATE guardian_students SET relationship = CAST(? AS relationships) " +
            "WHERE guardian_id = ? AND student_id = ?";
        jdbcTemplate.update(query, relationship, guardianId, studentId);
    }

    // --- 6. ELIMINAR VÍNCULO ---
    public void deleteLink(Long guardianId, Long studentId) {
        String query = "DELETE FROM guardian_students WHERE guardian_id = ? AND student_id = ?";
        jdbcTemplate.update(query, guardianId, studentId);
    }
}
