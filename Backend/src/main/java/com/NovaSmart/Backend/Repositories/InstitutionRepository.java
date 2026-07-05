package com.NovaSmart.Backend.Repositories;

import com.NovaSmart.Backend.Model.Enums.Institution_status;
import com.NovaSmart.Backend.Model.InstitutionModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IInstitutionRepository;
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
public class InstitutionRepository implements IInstitutionRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<InstitutionModel> institutionsModelRowMapper = (rs, amountRow ) -> {
        InstitutionModel institutionModel = new InstitutionModel();

        institutionModel.setId(rs.getLong("id"));
        institutionModel.setNit(rs.getString("nit"));
        institutionModel.setName(rs.getString("name"));
        institutionModel.setDepartment(rs.getString("department"));
        institutionModel.setCity(rs.getString("city"));

        // CORRECCIÓN 1: Asignar correctamente cada variable
        institutionModel.setAddress(rs.getString("address"));
        institutionModel.setVision(rs.getString("vision"));
        institutionModel.setMission(rs.getString("mission"));

        // Manejo seguro del Enum por si viene nulo desde la base de datos
        String statusStr = rs.getString("status");
        if (statusStr != null) {
            institutionModel.setStatus(Institution_status.valueOf(statusStr));
        }

        Timestamp createdAt = rs.getTimestamp("created_at");
        Timestamp updatedAt = rs.getTimestamp("updated_at");
        Timestamp deletedAt = rs.getTimestamp("deleted_at");

        institutionModel.setCreated_at(createdAt != null ? createdAt.toLocalDateTime() : null);
        institutionModel.setUpdated_at(updatedAt != null ? updatedAt.toLocalDateTime() : null);
        institutionModel.setDeleted_at(deletedAt != null ? deletedAt.toLocalDateTime() : null);

        return institutionModel;
    };

    @Override
    public InstitutionModel save(InstitutionModel institutionInfo) {
        if ( institutionInfo.getId() == null ) {
            // CORRECCIÓN 2: 12 columnas = 12 parámetros (?,?,?,?,?,?,?,CAST(? AS institution_status),?,?,?,?)

//            String query = "INSERT INTO institutions " +
//                "(nit, name, department, city, address, vision, mission, status, created_at, updated_at, deleted_at)" +
//                " VALUES " +
//                "(?,?,?,?,?,?,?,CAST(? AS institution_status),?,?,?)";

            String query = "INSERT INTO institutions " +
                "(nit, name, department, city, address, vision, mission, logo, banner, status, created_at, updated_at, deleted_at)" +
                " VALUES " +
                "(?,?,?,?,?,?,?,?,?,CAST(? AS institution_status),?,?,?)";

            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update( connection -> {

                PreparedStatement ps = connection.prepareStatement(query, new String[]{"id"});

                ps.setString(1, institutionInfo.getNit());
                ps.setString(2, institutionInfo.getName());
                ps.setString(3, institutionInfo.getDepartment());
                ps.setString(4, institutionInfo.getCity());
                ps.setString(5, institutionInfo.getAddress());
                ps.setString(6, institutionInfo.getVision());
                ps.setString(7, institutionInfo.getMission());

                // --- NUEVO: Insertar Logo y Banner ---
                ps.setString(8, institutionInfo.getLogo());
                ps.setString(9, institutionInfo.getBanner());

                // Prevención de NullPointerException si no se seleccionó estado en el Frontend
                ps.setString(10, institutionInfo.getStatus() != null ? institutionInfo.getStatus().name() : null);

                ps.setTimestamp(11, institutionInfo.getCreated_at() != null ? Timestamp.valueOf(institutionInfo.getCreated_at()) : null);
                ps.setTimestamp(12, institutionInfo.getUpdated_at() != null ? Timestamp.valueOf(institutionInfo.getUpdated_at()) : null);
                ps.setTimestamp(13, institutionInfo.getDeleted_at() != null ? Timestamp.valueOf(institutionInfo.getDeleted_at()) : null);

                return ps;
            }, keyHolder);

            institutionInfo.setId(Objects.requireNonNull(keyHolder.getKey()).longValue());

        } else {
            String query = "UPDATE institutions SET " +
                "nit = ?, name = ?, department = ?, city = ?, address = ?, vision = ?, mission = ?, logo, banner, status = CAST(? AS institution_status), created_at = ?, updated_at = ?, deleted_at = ? " +
                "WHERE id = ?";

            jdbcTemplate.update( query,
                institutionInfo.getNit(),
                institutionInfo.getName(),
                institutionInfo.getDepartment(),
                institutionInfo.getCity(),
                institutionInfo.getAddress(),
                institutionInfo.getVision(),
                institutionInfo.getMission(),
                // --- NUEVO: Valores para el UPDATE ---
                institutionInfo.getLogo(),
                institutionInfo.getBanner(),

                institutionInfo.getStatus() != null ? institutionInfo.getStatus().name() : null,
                institutionInfo.getCreated_at(),
                institutionInfo.getUpdated_at(),
                institutionInfo.getDeleted_at(),
                // CORRECCIÓN 3: Faltaba pasar el ID para el WHERE
                institutionInfo.getId()
            );
        }

        return institutionInfo;
    }

    @Override
    public Optional<InstitutionModel> findById(Long id) {
        String query = "SELECT * FROM institutions WHERE id = ?";
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(query, institutionsModelRowMapper, id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<InstitutionModel> findAll() {
        String query = "SELECT * FROM institutions";
        return jdbcTemplate.query(query, institutionsModelRowMapper);
    }

    @Override
    public void deleteById(Long id) {
        String query = "DELETE FROM institutions WHERE id = ?";
        jdbcTemplate.update(query, id);
    }
}
