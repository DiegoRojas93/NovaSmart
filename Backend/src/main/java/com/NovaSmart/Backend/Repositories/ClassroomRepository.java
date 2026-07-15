package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.ClassroomModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IClassroomRepository;
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
public class ClassroomRepository implements IClassroomRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<ClassroomModel> rowMapper = (rs, rowNum) -> {
        ClassroomModel model = new ClassroomModel();
        model.setId(rs.getLong("id"));
        model.setName(rs.getString("name"));

        // Manejo seguro de nulos para tipos numéricos en JDBC
        model.setCapacity(rs.getObject("capacity", Short.class));
        model.setFloor(rs.getObject("floor", Short.class));

        model.setBuilding(rs.getString("building"));
        return model;
    };

    @Override
    public ClassroomModel save(ClassroomModel classroom) {
        if (classroom.getId() == null) {
            String query = "INSERT INTO classrooms (name, capacity, floor, building) VALUES (?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});
                ps.setString(1, classroom.getName());

                // setObject maneja correctamente los nulls si el Short está vacío
                ps.setObject(2, classroom.getCapacity(), java.sql.Types.SMALLINT);
                ps.setObject(3, classroom.getFloor(), java.sql.Types.SMALLINT);
                ps.setString(4, classroom.getBuilding());

                return ps;
            }, keyHolder);

            classroom.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());
        } else {
            String query = "UPDATE classrooms SET name = ?, capacity = ?, floor = ?, building = ? WHERE id = ?";
            jdbcTemplate.update(query,
                classroom.getName(),
                classroom.getCapacity(),
                classroom.getFloor(),
                classroom.getBuilding(),
                classroom.getId()
            );
        }
        return classroom;
    }

    @Override
    public Optional<ClassroomModel> findById(Long id) {
        String query = "SELECT * FROM classrooms WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, rowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<ClassroomModel> findAll() {
        String query = "SELECT * FROM classrooms";
        return jdbcTemplate.query(query, rowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM classrooms WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
