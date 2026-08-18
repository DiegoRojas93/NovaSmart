package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.GuardianSettingsDTO;

public interface IGuardianSettingsService {
    GuardianSettingsDTO getSettings(Long guardianId);
    void updateSettings(Long guardianId, GuardianSettingsDTO dto);
}
