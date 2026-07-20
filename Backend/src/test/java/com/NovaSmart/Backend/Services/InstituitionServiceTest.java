package com.NovaSmart.Backend.Services;

import com.NovaSmart.Backend.Exception.ValidationException;
import com.NovaSmart.Backend.Model.Enums.Institution_status;
import com.NovaSmart.Backend.Model.Components.InstitutionModel;
import com.NovaSmart.Backend.Repositories.Interfaces.IInstitutionRepository;
import com.NovaSmart.Backend.Service.Components.Interfaces.IInstitutionsInfoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@DirtiesContext( classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class InstituitionServiceTest {

    @Autowired
    private IInstitutionsInfoService institutionsService;
    @Autowired
    private IInstitutionRepository institutionRepository;

    @Test
    void testSavedValidInstitution() {
        InstitutionModel validInstitution = new InstitutionModel(
            null,
            "12345",
            "I.E.D Sorrento",
            "Cundinamarca",
            "Bogotá",
            "Cra. 53d #5-74",
            "Nuestra vision es ...",
            "Nuestra mision es ...",
            "bfgisbgisbdf",
            "djgskfngxdn",
            Institution_status.ACTIVA,
            null,
            null,
            null);

        InstitutionModel savedInstitution = institutionsService.save(validInstitution);

        assertNotNull(savedInstitution.getId(), "El objeto guardado debe tener un ID asignado.");

        assertNotNull(institutionRepository
            .findById(savedInstitution.getId())
            .orElse(null),
            "El objeto guardado debe tener un ID asignado.");
    }

    @Test
    void testSavedInvalidInstitution() {
        InstitutionModel invalidInstitution = new InstitutionModel(
            null,
            "",
            "I.E.D Sorrento",
            "Cundinamarca",
            "Bogotá",
            "Cra. 53d #5-74",
            "Nuestra vision es ...",
            "Nuestra mision es ...",
            "dfkasbfksdb",
            "djfgbdsafig",
            Institution_status.ACTIVA,
            null,
            null,
            null);

        assertThrows(
            ValidationException.class,
            () -> institutionsService.save(invalidInstitution),
            "Debe de lanzarse un ValidationException al evidenciarse que el Nit esta vacio.");
    };
}
