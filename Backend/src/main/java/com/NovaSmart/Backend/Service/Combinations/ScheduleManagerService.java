package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.ScheduleFormDTO;
import com.NovaSmart.Backend.Model.Combinations.ScheduleSummaryDTO;
import com.NovaSmart.Backend.Repositories.Combinations.ScheduleManagerRepository;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IScheduleManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ScheduleManagerService implements IScheduleManagerService {

    // Inyectamos el repositorio con el nombre actualizado para evitar conflictos de Beans
    private final ScheduleManagerRepository scheduleManagerRepository;

    // --- MÉTODOS DE ESCRITURA (Transaccionales) ---

    @Override
    @Transactional
    public void createSchedule(ScheduleFormDTO request) {
        // 1. Guardar la asignación base (Materia, Aula, Docente, Periodo)
        Long classroomSubjectId = scheduleManagerRepository.insertClassroomSubject(
            request.getAssignment(), request.getInstitutionId()
        );

        // 2. Iterar y guardar cada bloque de tiempo
        for (ScheduleFormDTO.TimeBlockDTO block : request.getSchedules()) {
            scheduleManagerRepository.insertTimeBlock(classroomSubjectId, block, request.getInstitutionId());
        }
    }

    @Override
    @Transactional
    public void updateSchedule(ScheduleFormDTO request) {
        Long csId = request.getId();
        Long instId = request.getInstitutionId();

        // 1. Actualizamos la asignación base (siempre validando institution_id)
        scheduleManagerRepository.updateClassroomSubject(csId, request.getAssignment(), instId);

        // 2. Técnica "Wipe and Replace": Borramos los horarios antiguos de esta asignación
        scheduleManagerRepository.deleteSchedulesByClassroomSubject(csId, instId);

        // 3. Insertamos los nuevos bloques enviados desde React
        for (ScheduleFormDTO.TimeBlockDTO block : request.getSchedules()) {
            scheduleManagerRepository.insertTimeBlock(csId, block, instId);
        }
    }

    @Override
    @Transactional
    public void deleteSchedule(Long classroomSubjectId, Long institutionId) {
        // El repositorio se encarga de borrar primero los bloques y luego la asignación base
        scheduleManagerRepository.deleteFullAssignment(classroomSubjectId, institutionId);
    }


    // --- MÉTODOS DE LECTURA (Delegados al repositorio) ---

    @Override
    public List<ScheduleSummaryDTO> getAllSchedulesSummary(Long institutionId) {
        return scheduleManagerRepository.getAllSchedulesSummary(institutionId);
    }

    @Override
    public Map<String, Object> getFormOptions(Long institutionId) {
        return scheduleManagerRepository.getFormOptions(institutionId);
    }

    @Override
    public ScheduleFormDTO getScheduleById(Long scheduleId, Long institutionId) {
        return scheduleManagerRepository.getScheduleById(scheduleId, institutionId);
    }
}
