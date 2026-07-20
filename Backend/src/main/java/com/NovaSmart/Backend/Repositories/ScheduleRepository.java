package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.Components.ScheduleModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IScheduleRepository;
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
public class ScheduleRepository implements IScheduleRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<ScheduleModel> rowMapper = (rs, rowNum) -> {
        ScheduleModel model = new ScheduleModel();
        model.setId(rs.getLong("id"));
        model.setClassroomSubjectId(rs.getLong("classroom_subject_id"));
        model.setDayOfWeek(rs.getShort("day_of_week"));

        java.sql.Time startTime = rs.getTime("start_time");
        model.setStartTime(startTime != null ? startTime.toLocalTime() : null);

        java.sql.Time endTime = rs.getTime("end_time");
        model.setEndTime(endTime != null ? endTime.toLocalTime() : null);

        return model;
    };

    @Override
    public ScheduleModel save(ScheduleModel schedule) {
        if (schedule.getId() == null) {
            String query = "INSERT INTO schedules (classroom_subject_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});
                ps.setLong(1, schedule.getClassroomSubjectId());
                ps.setShort(2, schedule.getDayOfWeek());
                ps.setTime(3, schedule.getStartTime() != null ? java.sql.Time.valueOf(schedule.getStartTime()) : null);
                ps.setTime(4, schedule.getEndTime() != null ? java.sql.Time.valueOf(schedule.getEndTime()) : null);
                return ps;
            }, keyHolder);

            schedule.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        } else {
            String query = "UPDATE schedules SET classroom_subject_id = ?, day_of_week = ?, start_time = ?, end_time = ? WHERE id = ?";
            jdbcTemplate.update(query,
                schedule.getClassroomSubjectId(),
                schedule.getDayOfWeek(),
                schedule.getStartTime() != null ? java.sql.Time.valueOf(schedule.getStartTime()) : null,
                schedule.getEndTime() != null ? java.sql.Time.valueOf(schedule.getEndTime()) : null,
                schedule.getId()
            );
        }
        return schedule;
    }

    @Override
    public Optional<ScheduleModel> findById(Long id) {
        String query = "SELECT * FROM schedules WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<ScheduleModel> findByClassroomSubjectId(Long classroomSubjectId) {
        String query = "SELECT * FROM schedules WHERE classroom_subject_id = ?";
        return jdbcTemplate.query(query, rowMapper, classroomSubjectId);
    }

    @Override
    public List<ScheduleModel> findAll() {
        String query = "SELECT * FROM schedules";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM schedules WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
