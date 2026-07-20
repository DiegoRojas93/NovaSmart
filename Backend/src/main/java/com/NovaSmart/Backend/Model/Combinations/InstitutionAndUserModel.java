package com.NovaSmart.Backend.Model.Combinations;

import com.NovaSmart.Backend.Model.Components.InstitutionModel;
import com.NovaSmart.Backend.Model.Components.UserModel;
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

    @Valid // Le dice a Spring que valide los campos internos de InstitutionsModel
    @JsonProperty("institution")
    private InstitutionModel institutionModel;
}
