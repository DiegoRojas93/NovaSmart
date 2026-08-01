package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.Components.EmergencyContactModel;
import com.NovaSmart.Backend.Model.Enums.Relationships_status;
import com.NovaSmart.Backend.Repositories.Interfaces.IEmergencyContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class EmergencyContactRepository implements IEmergencyContactRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<EmergencyContactModel> rowMapper = (rs, rowNum) -> {
        EmergencyContactModel model = new EmergencyContactModel();
        model.setId(rs.getLong("id"));
        model.setFirstName(rs.getString("first_name"));
        model.setLastName(rs.getString("last_name"));

        String relationshipStr = rs.getString("relationship");
        if (relationshipStr != null) {
            model.setRelationship(Relationships_status.valueOf(relationshipStr));
        }

        model.setEmail(rs.getString("email"));
        model.setPhoneNumber(rs.getString("phone_number"));
        model.setCity(rs.getString("city"));
        model.setAddress(rs.getString("address"));
        model.setUserId(rs.getLong("user_id"));

        return model;
    };

    @Override
    public EmergencyContactModel save(EmergencyContactModel emergencyContact) {
        if (emergencyContact.getId() == null) {
            String query = "INSERT INTO emergency_contacts " +
                "(first_name, last_name, relationship, email, phone_number, city, address, user_id) " +
                "VALUES (?, ?, CAST(? AS relationships), ?, ?, ?, ?, ?)";

            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});
                ps.setString(1, emergencyContact.getFirstName());
                ps.setString(2, emergencyContact.getLastName());
                ps.setString(3, emergencyContact.getRelationship() != null ? emergencyContact.getRelationship().name() : null);
                ps.setString(4, emergencyContact.getEmail());
                ps.setString(5, emergencyContact.getPhoneNumber());
                ps.setString(6, emergencyContact.getCity());
                ps.setString(7, emergencyContact.getAddress());
//                ps.setLong(8, emergencyContact.getUserId());

                if (emergencyContact.getUserId() != null) {
                    ps.setLong(8, emergencyContact.getUserId());
                } else {
                    ps.setNull(8, java.sql.Types.BIGINT);
                }
                return ps;
            }, keyHolder);

            emergencyContact.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        } else {
            String query = "UPDATE emergency_contacts SET " +
                "first_name = ?, last_name = ?, relationship = CAST(? AS relationships), email = ?, phone_number = ?, city = ?, address = ?, user_id = ? " +
                "WHERE id = ?";

            jdbcTemplate.update(query,
                emergencyContact.getFirstName(),
                emergencyContact.getLastName(),
                emergencyContact.getRelationship() != null ? emergencyContact.getRelationship().name() : null,
                emergencyContact.getEmail(),
                emergencyContact.getPhoneNumber(),
                emergencyContact.getCity(),
                emergencyContact.getAddress(),
                emergencyContact.getUserId(),
                emergencyContact.getId()
            );
        }
        return emergencyContact;
    }

    @Override
    public Optional<EmergencyContactModel> findById(Long id) {
        String query = "SELECT * FROM emergency_contacts WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<EmergencyContactModel> findByUserId(Long userId) {
        String query = "SELECT * FROM emergency_contacts WHERE user_id = ?";
        return jdbcTemplate.query(query, rowMapper, userId);
    }

    @Override
    public List<EmergencyContactModel> findAll() {
        String query = "SELECT * FROM emergency_contacts";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM emergency_contacts WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
