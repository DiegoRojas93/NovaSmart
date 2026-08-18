package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Model.Combinations.GuardianSettingsDTO;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IGuardianSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/guardian-settings")
public class GuardianSettingsController {

    private final IGuardianSettingsService service;

    // Obtener los datos actuales al cargar la página
    @GetMapping("/{guardianId}")
    public ResponseEntity<GuardianSettingsDTO> getSettings(@PathVariable Long guardianId) {
        return ResponseEntity.ok(service.getSettings(guardianId));
    }

    // Guardar los ajustes (Actualizar base de datos)
    @PutMapping("/{guardianId}")
    public ResponseEntity<Void> updateSettings(
        @PathVariable Long guardianId,
        @RequestBody GuardianSettingsDTO dto) {

        service.updateSettings(guardianId, dto);
        return ResponseEntity.ok().build();
    }
}
