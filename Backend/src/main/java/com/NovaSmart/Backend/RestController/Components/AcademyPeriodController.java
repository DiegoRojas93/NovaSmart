package com.NovaSmart.Backend.RestController.Components;

import com.NovaSmart.Backend.Model.Components.AcademyPeriodModel;
import com.NovaSmart.Backend.Model.Components.UserModel;
import com.NovaSmart.Backend.Repositories.Components.UserRepository;
import com.NovaSmart.Backend.Service.Components.Interfaces.IAcademyPeriodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDateTime; // <-- NUEVO IMPORT NECESARIO
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/academic-periods")
public class AcademyPeriodController {

    private final IAcademyPeriodService academyPeriodService;

    // Inyectamos el repositorio para buscar al usuario dueño del token
    private final UserRepository userRepository;

    // --- FUNCIÓN AUXILIAR DE SEGURIDAD ---
    private Long getInstitutionIdFromToken(Principal principal) {
        UserModel user = userRepository.findByUsername(principal.getName())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Usuario no autenticado."
            ));
        return user.getInstitutionId();
    }

    // 1. Obtener todos los periodos (Filtrados por la institución del usuario)
    @GetMapping
    public List<AcademyPeriodModel> getAllPeriods(Principal principal) {
        Long institutionId = getInstitutionIdFromToken(principal);
        return academyPeriodService.findAllByInstitutionId(institutionId);
    }

    // 2. Obtener un periodo por ID (Verificando que sea del mismo colegio)
    @GetMapping("/{id}")
    public AcademyPeriodModel getPeriodById(@PathVariable Long id, Principal principal) {
        AcademyPeriodModel period = academyPeriodService.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "El periodo académico no fue encontrado."
            ));

        // Bloqueo de seguridad: Evita que el Colegio A vea periodos del Colegio B
        if (!period.getInstitutionId().equals(getInstitutionIdFromToken(principal))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para ver este periodo.");
        }

        return period;
    }

    // 3. Crear un nuevo periodo (Asignando la institución automáticamente)
    @PostMapping
    public ResponseEntity<AcademyPeriodModel> createPeriod(
        @RequestBody AcademyPeriodModel period,
        Principal principal
    ) {
        // El frontend ya no necesita enviar institutionId, lo sacamos del token
        period.setInstitutionId(getInstitutionIdFromToken(principal));

        // --- SOLUCIÓN: Asignamos la fecha actual en la creación ---
        period.setCreatedAt(LocalDateTime.now());

        AcademyPeriodModel savedPeriod = academyPeriodService.save(period);
        return new ResponseEntity<>(savedPeriod, HttpStatus.CREATED);
    }

    // 4. Actualizar un periodo existente
    @PutMapping("/{id}")
    public ResponseEntity<AcademyPeriodModel> updatePeriod(
        @PathVariable Long id,
        @RequestBody AcademyPeriodModel period,
        Principal principal
    ) {
        Long userInstitutionId = getInstitutionIdFromToken(principal);

        // Verificamos que el periodo exista en la BD
        AcademyPeriodModel existingPeriod = academyPeriodService.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "El periodo académico no fue encontrado."
            ));

        // Validamos la propiedad
        if (!existingPeriod.getInstitutionId().equals(userInstitutionId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para editar este periodo.");
        }

        // Aplicamos los valores de seguridad
        period.setId(id);
        period.setInstitutionId(userInstitutionId);

        // --- SOLUCIÓN: Rescatamos la fecha de creación original y ponemos la de actualización ---
        period.setCreatedAt(existingPeriod.getCreatedAt());
        period.setUpdatedAt(LocalDateTime.now());

        AcademyPeriodModel updatedPeriod = academyPeriodService.save(period);
        return ResponseEntity.ok(updatedPeriod);
    }

    // 5. Eliminar un periodo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePeriod(@PathVariable Long id, Principal principal) {
        Long userInstitutionId = getInstitutionIdFromToken(principal);

        AcademyPeriodModel existingPeriod = academyPeriodService.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "El periodo académico no fue encontrado."
            ));

        // Validamos la propiedad antes de borrar
        if (!existingPeriod.getInstitutionId().equals(userInstitutionId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para eliminar este periodo.");
        }

        academyPeriodService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{institutionId}/current")
    public ResponseEntity<?> getCurrentPeriod(@PathVariable Long institutionId) {
        Map<String, Object> period = academyPeriodService.getCurrentPeriod(institutionId);
        if (period == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(period);
    }
}
