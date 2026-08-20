package com.NovaSmart.Backend.Service.Combinations.Interfaces;

import com.NovaSmart.Backend.Model.Combinations.AcademicsDashboardDTO.StructureDataDTO;
import com.NovaSmart.Backend.Model.Combinations.AcademicsDashboardDTO.ActivitiesDataDTO;

public interface IAcademicsDashboardService {

    // Método para la Pestaña 1: Carga la estructura general, KPIs y los filtros disponibles
    StructureDataDTO getStructureData(Long institutionId);

    // Método para la Pestaña 2: Carga las actividades y tareas aplicando los filtros dinámicos
    ActivitiesDataDTO getFilteredActivitiesData(Long institutionId, Long gradeId, Long subjectId);

}
