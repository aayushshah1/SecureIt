package com.example.auth_server.DTO;

import com.example.auth_server.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long id;
    private String username;
    private String email;
    private String token;
    private Role role;
}
