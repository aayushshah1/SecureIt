package com.example.auth_server.DTO;

import com.example.auth_server.Entity.Role;
import lombok.Data;

@Data
public class TokenValidationResponse {
    private boolean valid;
    private Long userId;
    private String email;
    private String username;
    private Role role;
    private String message;
}