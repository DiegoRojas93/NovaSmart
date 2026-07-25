package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.Components.ContactInfoModel;
import com.NovaSmart.Backend.Model.Enums.Document_status;
import com.NovaSmart.Backend.Repositories.Interfaces.IContactInfoRepository;
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
public class ContactInfoRepository implements IContactInfoRepository {
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<ContactInfoModel> rowMapper = (rs, rowNum) -> {
        ContactInfoModel model = new ContactInfoModel();
        model.setId(rs.getLong("id"));

        String docTypeStr = rs.getString("document_type");

        if (docTypeStr != null) {
            model.setDocumentType(Document_status.valueOf(docTypeStr));
        }

        model.setIdentification(rs.getString("identification"));
        model.setEmail(rs.getString("email"));
        model.setPhoneNumber(rs.getString("phone_number"));
        model.setCity(rs.getString("city"));
        model.setAddress(rs.getString("address"));
        model.setUserId(rs.getLong("user_id"));

        return model;
    };

    @Override
    public ContactInfoModel save(ContactInfoModel contactInfo) {
        if (contactInfo.getId() == null) {
            String query = "INSERT INTO contact_info " +
                "(document_type, identification, email, phone_number, city, address, user_id) " +
                "VALUES (CAST(? AS document_types), ?, ?, ?, ?, ?, ?)";

            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});
                ps.setString(1, contactInfo.getDocumentType() != null ? contactInfo.getDocumentType().name() : null);
                ps.setString(2, contactInfo.getIdentification());
                ps.setString(3, contactInfo.getEmail());
                ps.setString(4, contactInfo.getPhoneNumber());
                ps.setString(5, contactInfo.getCity());
                ps.setString(6, contactInfo.getAddress());
//                ps.setLong(7, contactInfo.getUserId());

                if (contactInfo.getUserId() != null) {
                    ps.setLong(7, contactInfo.getUserId());
                } else {
                    ps.setNull(7, java.sql.Types.BIGINT);
                }
                return ps;
            }, keyHolder);

            contactInfo.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        } else {
            String query = "UPDATE contact_info SET " +
                "document_type = CAST(? AS document_types), identification = ?, email = ?, phone_number = ?, city = ?, address = ?, user_id = ? " +
                "WHERE id = ?";

            jdbcTemplate.update(query,
                contactInfo.getDocumentType() != null ? contactInfo.getDocumentType().name() : null,
                contactInfo.getIdentification(),
                contactInfo.getEmail(),
                contactInfo.getPhoneNumber(),
                contactInfo.getCity(),
                contactInfo.getAddress(),
                contactInfo.getUserId(),
                contactInfo.getId()
            );
        }
        return contactInfo;
    }

    @Override
    public Optional<ContactInfoModel> findById(Long id) {
        String query = "SELECT * FROM contact_info WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<ContactInfoModel> findByUserId(Long userId) {
        String query = "SELECT * FROM contact_info WHERE user_id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, userId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<ContactInfoModel> findAll() {
        String query = "SELECT * FROM contact_info";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM contact_info WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
