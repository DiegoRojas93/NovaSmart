package com.NovaSmart.Backend.Model.Combinations;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String identification;
    private String roleName;
    private String status;
}
