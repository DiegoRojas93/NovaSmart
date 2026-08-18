package com.NovaSmart.Backend.Model.Combinations;

import lombok.Data;
import java.util.List;

@Data
public class GuardianSettingsDTO {
    private GuardianDataDTO guardianData;
    private List<StudentDataDTO> childrenData;

    @Data
    public static class GuardianDataDTO {
        private String firstName;
        private String lastName;
        private String documentType;
        private String documentNumber;
        private String email;
        private String phone;
        private String address;
        private String city;
    }

    @Data
    public static class StudentDataDTO {
        private String id;
        private String name;
        private String course;
        private String photo;
        private String phone;
        private String address;
        private String city;
        private EmergencyContactDTO emergencyContact;
    }

    @Data
    public static class EmergencyContactDTO {
        private String firstName;
        private String lastName;
        private String relationship;
        private String phone;
        private String email;
        private String city;
        private String address;
    }
}
