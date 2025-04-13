package com.example.auth_server.DTO;

import lombok.Data;

@Data
public class PasswordVerificationRequest {
    private String email;
    private String password;
}