package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.InstitutionAndUserModel;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface IInstitutionInscription {
    Map<String, Object> registerInstitutionWithAdmin(
        InstitutionAndUserModel request,
        MultipartFile logo,
        MultipartFile banner,
        MultipartFile photo
    );
}
