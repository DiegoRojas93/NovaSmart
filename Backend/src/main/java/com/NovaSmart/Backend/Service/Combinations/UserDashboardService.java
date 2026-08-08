package com.NovaSmart.Backend.Service.Combinations;

import com.NovaSmart.Backend.Model.Combinations.InstitutionAndUserModel;
import com.NovaSmart.Backend.Repositories.Combinations.UserFullProfile;
import com.NovaSmart.Backend.Service.Combinations.Interfaces.IUserDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDashboardService implements IUserDashboardService {

    private final UserFullProfile userDashboardRepository;

    @Override
    public Optional<InstitutionAndUserModel> getFullUserProfileByUserId(Long userId) {
        // Llama a la mega-consulta del repositorio que acabamos de crear
        return userDashboardRepository.getByUserId(userId);
    }
}
