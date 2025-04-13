package com.example.auth_server.DTO;

import lombok.Data;

@Data
public class PasswordVerificationResponse {
    private boolean valid;
    private Long userId;
    private String message;
}