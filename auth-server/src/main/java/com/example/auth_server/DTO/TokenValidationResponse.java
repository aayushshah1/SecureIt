package com.example.auth_server.DTO;

import lombok.Data;

@Data
public class TokenValidationResponse {
    private boolean valid;
    private Long userId;
    private String username;
    private String email;
    private String message;
}