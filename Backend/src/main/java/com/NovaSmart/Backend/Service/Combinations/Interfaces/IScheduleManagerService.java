package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.ScheduleFormDTO;
import com.NovaSmart.Backend.Model.Combinations.ScheduleSummaryDTO;

import java.util.List;
import java.util.Map;

public interface IScheduleManagerService {
    // --- MÉTODOS DE ESCRITURA (Transaccionales) ---

    /**
     * Crea una nueva asignación base y sus bloques de horario asociados.
     */
    void createSchedule(ScheduleFormDTO request);

    /**
     * Actualiza la asignación base y reemplaza los bloques de horario existentes.
     */
    void updateSchedule(ScheduleFormDTO request);

    /**
     * Elimina todos los bloques de horario y la asignación base de un docente.
     */
    void deleteSchedule(Long classroomSubjectId, Long institutionId);

    // --- MÉTODOS DE LECTURA ---

    /**
     * Obtiene el listado resumido de horarios para pintar la tabla principal.
     */
    List<ScheduleSummaryDTO> getAllSchedulesSummary(Long institutionId);

    /**
     * Obtiene las listas de docentes, materias, aulas y periodos para llenar los <select>.
     */
    Map<String, Object> getFormOptions(Long institutionId);

    /**
     * Obtiene todos los detalles de un horario específico (asignación y bloques de tiempo) para editarlo.
     */
    ScheduleFormDTO getScheduleById(Long scheduleId, Long institutionId);
}
