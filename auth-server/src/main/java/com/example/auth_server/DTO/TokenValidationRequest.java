package com.example.auth_server.DTO;

import lombok.Data;

@Data
public class TokenValidationRequest {
    private String token;
}