package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.PersonalModel;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface IPersonalManagerService {
    Map<String, Object> registerPersonal(
        PersonalModel request,
        MultipartFile photo
    );
}
