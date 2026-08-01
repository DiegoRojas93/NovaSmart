package com.NovaSmart.Backend.RestController.Combinations;

import com.NovaSmart.Backend.Service.Components.Interfaces.IInstitutionsInfoService;
import com.NovaSmart.Backend.Service.Components.Interfaces.IRoleService;
import com.NovaSmart.Backend.Service.Components.Interfaces.IUserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/userLogged")
public class SesionInfoController {
    private final IInstitutionsInfoService institutionsInfoService;
    private final IUserInfoService userInfoService;
    private final IRoleService roleService;

    
}
