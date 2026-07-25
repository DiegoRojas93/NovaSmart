package com.NovaSmart.Backend.Model.Combinations;

import com.NovaSmart.Backend.Model.Components.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstitutionAndUserModel {

    @Valid
    @JsonProperty("user")
    private UserModel userModel;

    @Valid
    @JsonProperty("institution")
    private InstitutionModel institutionModel;

    @Valid
    @JsonProperty("roles")
    private RoleModel roleModel;

    @Valid
    @JsonProperty("contact_info")
    private ContactInfoModel contactInfoModel;

    @Valid
    @JsonProperty("emergency_contacts")
    private EmergencyContactModel emergencyContactModel;
}
