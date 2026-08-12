package com.NovaSmart.Backend.Repositories.Combinations;

import com.NovaSmart.Backend.Model.Combinations.ClassroomDTO;
import com.NovaSmart.Backend.Model.Combinations.GradeSummaryDTO;
import com.NovaSmart.Backend.Model.Combinations.SubjectDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class AcademicsRepository {

    private final JdbcTemplate jdbcTemplate;

    // --- LECTURAS ---
    public List<GradeSummaryDTO> getAllGradesSummary(Long institutionId) {
        String sql = "SELECT sg.id, sg.name, " +
            "(SELECT COUNT(*) FROM grade_classrooms gc WHERE gc.grade_id = sg.id) AS classroomCount, " +
            "(SELECT COUNT(*) FROM grade_subjects gs WHERE gs.grade_id = sg.id) AS subjectCount " +
            "FROM school_grades sg WHERE sg.institution_id = ? AND sg.deleted_at IS NULL ORDER BY sg.id DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new GradeSummaryDTO(
            rs.getLong("id"), rs.getString("name"), rs.getInt("classroomCount"), rs.getInt("subjectCount")
        ), institutionId);
    }

    public String getGradeNameById(Long gradeId) {
        return jdbcTemplate.queryForObject(
            "SELECT name FROM school_grades WHERE id = ? AND deleted_at IS NULL",
            String.class, gradeId
        );
    }

    public List<ClassroomDTO> getClassroomsByGradeId(Long gradeId) {
        // Añadimos c.floor a la consulta SELECT
        String sql = "SELECT c.id, c.name, c.capacity, c.floor, c.building FROM classrooms c " +
            "JOIN grade_classrooms gc ON c.id = gc.classroom_id WHERE gc.grade_id = ? AND c.deleted_at IS NULL";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new ClassroomDTO(
            rs.getLong("id"),
            rs.getString("name"),
            rs.getObject("capacity", Integer.class),
            rs.getObject("floor", Integer.class), // <-- Extraemos el piso
            rs.getString("building")
        ), gradeId);
    }

    public List<SubjectDTO> getSubjectsByGradeId(Long gradeId) {
        String sql = "SELECT s.id, s.name, s.code, s.description FROM subjects s " +
            "JOIN grade_subjects gs ON s.id = gs.subject_id WHERE gs.grade_id = ? AND s.deleted_at IS NULL";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new SubjectDTO(
            rs.getLong("id"), rs.getString("name"), rs.getString("code"), rs.getString("description")
        ), gradeId);
    }

    // --- ESCRITURAS ---
    public Long createGrade(String name, Long institutionId) {
        String sql = """
        INSERT INTO school_grades (name, institution_id, created_at)
        VALUES (?, ?, ?)
        ON CONFLICT (name, institution_id)
        DO UPDATE SET
            deleted_at = NULL,
            updated_at = EXCLUDED.created_at
        RETURNING id
        """;

        return jdbcTemplate.queryForObject(sql, Long.class,
            name,
            institutionId,
            Timestamp.valueOf(LocalDateTime.now())
        );
    }

    public void updateGrade(Long gradeId, String name) {
        jdbcTemplate.update("UPDATE school_grades SET name = ?, updated_at = ? WHERE id = ?",
            name, Timestamp.valueOf(LocalDateTime.now()), gradeId);
    }

    public void deleteGradeRelations(Long gradeId) {
        jdbcTemplate.update("DELETE FROM grade_classrooms WHERE grade_id = ?", gradeId);
        jdbcTemplate.update("DELETE FROM grade_subjects WHERE grade_id = ?", gradeId);
    }

    public void softDeleteGrade(Long gradeId) {
        jdbcTemplate.update("UPDATE school_grades SET deleted_at = ? WHERE id = ?",
            Timestamp.valueOf(LocalDateTime.now()), gradeId);
    }

    public Long createClassroom(ClassroomDTO classroom, Long institutionId) {
        String sql = """
        INSERT INTO classrooms (name, capacity, floor, building, institution_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT (name, institution_id)
        DO UPDATE SET
            capacity = EXCLUDED.capacity,
            floor = EXCLUDED.floor,
            building = EXCLUDED.building,
            deleted_at = NULL
        RETURNING id
        """;

        return jdbcTemplate.queryForObject(sql, Long.class,
            classroom.getName(),
            classroom.getCapacity(),
            classroom.getFloor(),
            classroom.getBuilding(),
            institutionId,
            Timestamp.valueOf(LocalDateTime.now())
        );
    }

    public void updateClassroom(ClassroomDTO c) {
        String sql = "UPDATE classrooms SET name = ?, capacity = ?, floor = ?, building = ?, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql, c.getName(), c.getCapacity(), c.getFloor(), c.getBuilding(), Timestamp.valueOf(LocalDateTime.now()), c.getId());
    }

    public void softDeleteClassroom(Long id) {
        jdbcTemplate.update("UPDATE classrooms SET deleted_at = ? WHERE id = ?", Timestamp.valueOf(LocalDateTime.now()), id);
    }

    public Long createSubject(SubjectDTO subject, Long institutionId) {
        String sql = """
        INSERT INTO subjects (name, code, description, institution_id, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT (code, institution_id)
        DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            deleted_at = NULL
        RETURNING id
        """;

        return jdbcTemplate.queryForObject(sql, Long.class,
            subject.getName(),
            subject.getCode(),
            subject.getDescription(),
            institutionId,
            Timestamp.valueOf(LocalDateTime.now())
        );
    }

    public void updateSubject(SubjectDTO s) {
        String sql = "UPDATE subjects SET name = ?, code = ?, description = ?, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql, s.getName(), s.getCode(), s.getDescription(), Timestamp.valueOf(LocalDateTime.now()), s.getId());
    }

    public void softDeleteSubject(Long id) {
        jdbcTemplate.update("UPDATE subjects SET deleted_at = ? WHERE id = ?", Timestamp.valueOf(LocalDateTime.now()), id);
    }

    public void linkGradeClassroom(Long gradeId, Long classroomId) {
        jdbcTemplate.update("INSERT INTO grade_classrooms (grade_id, classroom_id) VALUES (?, ?) ON CONFLICT DO NOTHING", gradeId, classroomId);
    }

    public void linkGradeSubject(Long gradeId, Long subjectId) {
        jdbcTemplate.update("INSERT INTO grade_subjects (grade_id, subject_id) VALUES (?, ?) ON CONFLICT DO NOTHING", gradeId, subjectId);
    }
}
