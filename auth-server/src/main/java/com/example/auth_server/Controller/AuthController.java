package com.example.auth_server.Controller;

import com.example.auth_server.DTO.AuthResponse;
import com.example.auth_server.DTO.AuthRequest;
import com.example.auth_server.Entity.User;
import com.example.auth_server.Service.JwtService;
import com.example.auth_server.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) {
        User savedUser = userService.saveUser(user);

        // Create UserDetails from the saved user
        UserDetails userDetails = userService.loadUserByUsername(savedUser.getEmail());

        // Generate token using UserDetails
        String jwtToken = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail(), jwtToken));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        if (authentication.isAuthenticated()) {
            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // Get UserDetails for token generation
            UserDetails userDetails = userService.loadUserByUsername(user.getEmail());

            // Generate token
            String jwtToken = jwtService.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(user.getId(), user.getUsername(), user.getEmail(), jwtToken));
        } else {
            throw new UsernameNotFoundException("Invalid user credentials");
        }
    }
}