package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class GradeSaveRequestDTO {
    private Long activityId;
    private Long institutionId;
    private List<RecordDTO> grades;

    @Data
    public static class RecordDTO {
        private Long enrollmentId;
        private BigDecimal grade;
        private String observations;
    }
}
