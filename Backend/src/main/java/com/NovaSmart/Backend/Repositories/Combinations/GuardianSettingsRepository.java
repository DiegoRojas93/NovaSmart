package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GuardianSettingsDTO.*;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class GuardianSettingsRepository {

    private final JdbcTemplate jdbcTemplate;

    // --- LECTURAS (GET) ---

    public GuardianDataDTO getGuardianData(Long guardianId) {
        // CORRECCIÓN: 'identification' en lugar de 'document_number', y 'phone_number' en lugar de 'phone'
        String sql = "SELECT u.first_name, u.last_name, " +
            "ci.document_type, ci.identification AS document_number, " +
            "ci.email, ci.phone_number AS phone, ci.address, ci.city " +
            "FROM users u " +
            "LEFT JOIN contact_info ci ON u.id = ci.user_id " +
            "WHERE u.id = ?";

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            GuardianDataDTO dto = new GuardianDataDTO();
            dto.setFirstName(rs.getString("first_name"));
            dto.setLastName(rs.getString("last_name"));
            dto.setDocumentType(rs.getString("document_type"));
            dto.setDocumentNumber(rs.getString("document_number"));
            dto.setEmail(rs.getString("email"));
            dto.setPhone(rs.getString("phone"));
            dto.setAddress(rs.getString("address"));
            dto.setCity(rs.getString("city"));
            return dto;
        }, guardianId);
    }

    public List<StudentDataDTO> getGuardianStudents(Long guardianId) {
        // CORRECCIÓN: 'ci.phone_number' y 'ec.phone_number'
        String sql = "SELECT u.id, u.first_name || ' ' || u.last_name AS name, u.photo, " +
            "c.name AS course_name, ci.phone_number AS student_phone, ci.address AS student_address, ci.city AS student_city, " +
            "ec.first_name AS ec_first_name, ec.last_name AS ec_last_name, ec.relationship, " +
            "ec.phone_number AS ec_phone, ec.email AS ec_email, ec.city AS ec_city, ec.address AS ec_address " +
            "FROM guardian_students sg " + // CORRECCIÓN: La tabla se llama guardian_students, no student_guardians
            "JOIN users u ON sg.student_id = u.id " +
            "LEFT JOIN enrollments e ON u.id = e.student_id " +
            "LEFT JOIN classrooms c ON e.classroom_id = c.id " +
            "LEFT JOIN contact_info ci ON u.id = ci.user_id " +
            "LEFT JOIN emergency_contacts ec ON u.id = ec.user_id " +
            "WHERE sg.guardian_id = ?";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            StudentDataDTO student = new StudentDataDTO();
            student.setId(rs.getString("id"));
            student.setName(rs.getString("name"));
            student.setCourse(rs.getString("course_name") != null ? rs.getString("course_name") : "Sin Curso");
            student.setPhoto(rs.getString("photo"));
            student.setPhone(rs.getString("student_phone"));
            student.setAddress(rs.getString("student_address"));
            student.setCity(rs.getString("student_city"));

            EmergencyContactDTO ec = new EmergencyContactDTO();
            ec.setFirstName(rs.getString("ec_first_name"));
            ec.setLastName(rs.getString("ec_last_name"));
            ec.setRelationship(rs.getString("relationship"));
            ec.setPhone(rs.getString("ec_phone"));
            ec.setEmail(rs.getString("ec_email"));
            ec.setCity(rs.getString("ec_city"));
            ec.setAddress(rs.getString("ec_address"));

            student.setEmergencyContact(ec);
            return student;
        }, guardianId);
    }

    // --- ESCRITURAS (UPSERT) ---

    public void updateContactInfo(Long userId, String email, String phone, String address, String city) {
        // Usamos COALESCE para el email: si llega 'null' (como en el caso de los estudiantes), mantiene el correo que ya tenía en BD.
        String sql = "UPDATE contact_info SET " +
            "email = COALESCE(?, email), phone_number = ?, address = ?, city = ? " +
            "WHERE user_id = ?";

        jdbcTemplate.update(sql, email, phone, address, city, userId);
    }

    public void upsertEmergencyContact(Long userId, EmergencyContactDTO ec) {
        // 1. Verificamos si el contacto de emergencia ya existe
        String checkSql = "SELECT count(*) FROM emergency_contacts WHERE user_id = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, userId);

        if (count != null && count > 0) {
            // 2A. Si ya existe, hacemos un UPDATE
            String updateSql = "UPDATE emergency_contacts SET " +
                "first_name = ?, last_name = ?, relationship = ?::relationships, " +
                "phone_number = ?, email = ?, city = ?, address = ? " +
                "WHERE user_id = ?";
            jdbcTemplate.update(updateSql, ec.getFirstName(), ec.getLastName(),
                ec.getRelationship(), ec.getPhone(), ec.getEmail(),
                ec.getCity(), ec.getAddress(), userId);
        } else {
            // 2B. Si NO existe, hacemos un INSERT
            String insertSql = "INSERT INTO emergency_contacts (user_id, first_name, last_name, relationship, phone_number, email, city, address) " +
                "VALUES (?, ?, ?, ?::relationships, ?, ?, ?, ?)";
            jdbcTemplate.update(insertSql, userId, ec.getFirstName(), ec.getLastName(),
                ec.getRelationship(), ec.getPhone(), ec.getEmail(),
                ec.getCity(), ec.getAddress());
        }
    }
}
