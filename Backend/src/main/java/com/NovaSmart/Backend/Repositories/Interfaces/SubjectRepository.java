package com.NovaSmart.Backend.Repositories.Interfaces;

import com.NovaSmart.Backend.Model.Components.SubjectModel;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class SubjectRepository implements ISubjectRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<SubjectModel> rowMapper = (rs, rowNum) -> {
        SubjectModel model = new SubjectModel();
        model.setId(rs.getLong("id"));
        model.setName(rs.getString("name"));
        model.setCode(rs.getString("code"));
        model.setDescription(rs.getString("description"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        model.setCreatedAt(createdAt != null ? createdAt.toLocalDateTime() : null);

        return model;
    };

    @Override
    public SubjectModel save(SubjectModel subject) {
        if (subject.getId() == null) {
            String query = "INSERT INTO subjects (name, code, description, created_at) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});
                ps.setString(1, subject.getName());
                ps.setString(2, subject.getCode());
                ps.setString(3, subject.getDescription());
                ps.setTimestamp(4, subject.getCreatedAt() != null ? Timestamp.valueOf(subject.getCreatedAt()) : null);
                return ps;
            }, keyHolder);

            subject.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        } else {
            String query = "UPDATE subjects SET name = ?, code = ?, description = ?, created_at = ? WHERE id = ?";
            jdbcTemplate.update(query,
                subject.getName(),
                subject.getCode(),
                subject.getDescription(),
                subject.getCreatedAt() != null ? Timestamp.valueOf(subject.getCreatedAt()) : null,
                subject.getId()
            );
        }
        return subject;
    }

    @Override
    public Optional<SubjectModel> findById(Long id) {
        String query = "SELECT * FROM subjects WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<SubjectModel> findAll() {
        String query = "SELECT * FROM subjects";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM subjects WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
