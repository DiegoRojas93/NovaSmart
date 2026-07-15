package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.AcademyPeriodModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IAcademyPeriodRepository;
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
public class AcademyPeriodRepository implements IAcademyPeriodRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<AcademyPeriodModel> rowMapper = (rs, rowNum) -> {
        AcademyPeriodModel model = new AcademyPeriodModel();
        model.setId(rs.getLong("id"));
        model.setName(rs.getString("name"));
        model.setYear(rs.getShort("year"));

        java.sql.Date startDate = rs.getDate("start_date");
        model.setStartDate(startDate != null ? startDate.toLocalDate() : null);

        java.sql.Date endDate = rs.getDate("end_date");
        model.setEndDate(endDate != null ? endDate.toLocalDate() : null);

        return model;
    };

    @Override
    public AcademyPeriodModel save(AcademyPeriodModel period) {
        if (period.getId() == null) {

            String query = "INSERT INTO academic_periods (name, year, start_date, end_date) VALUES (?, ?, ?, ?)";

            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});
                ps.setString(1, period.getName());
                ps.setShort(2, period.getYear());
                ps.setDate(3, period.getStartDate() != null ? java.sql.Date.valueOf(period.getStartDate()) : null);
                ps.setDate(4, period.getEndDate() != null ? java.sql.Date.valueOf(period.getEndDate()) : null);
                return ps;
            }, keyHolder);

            period.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        } else {
            String query = "UPDATE academic_periods SET name = ?, year = ?, start_date = ?, end_date = ? WHERE id = ?";
            jdbcTemplate.update(query,
                period.getName(),
                period.getYear(),
                period.getStartDate() != null ? java.sql.Date.valueOf(period.getStartDate()) : null,
                period.getEndDate() != null ? java.sql.Date.valueOf(period.getEndDate()) : null,
                period.getId()
            );
        }
        return period;
    }

    @Override
    public Optional<AcademyPeriodModel> findById(Long id) {
        String query = "SELECT * FROM academic_periods WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<AcademyPeriodModel> findAll() {
        String query = "SELECT * FROM academic_periods";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM academic_periods WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
