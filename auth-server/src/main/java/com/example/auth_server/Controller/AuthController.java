package com.example.auth_server.Controller;

import com.example.auth_server.DTO.AuthResponse;
import com.example.auth_server.DTO.AuthRequest;
import com.example.auth_server.DTO.PasswordVerificationRequest;
import com.example.auth_server.DTO.PasswordVerificationResponse;
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
import org.springframework.security.crypto.password.PasswordEncoder;
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
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) {
        User savedUser = userService.saveUser(user);

        // Create UserDetails from the saved user
        UserDetails userDetails = userService.loadUserByUsername(savedUser.getEmail());

        // Generate token using UserDetails
        String jwtToken = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(
            savedUser.getId(), 
            savedUser.getUsername(), 
            savedUser.getEmail(), 
            jwtToken,
            savedUser.getRole())
        );
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

            return ResponseEntity.ok(new AuthResponse(
                user.getId(), 
                user.getUsername(), 
                user.getEmail(), 
                jwtToken,
                user.getRole())
            );
        } else {
            throw new UsernameNotFoundException("Invalid user credentials");
        }
    }
    
    @PostMapping("/verify-password")
    public ResponseEntity<PasswordVerificationResponse> verifyPassword(@RequestBody PasswordVerificationRequest request) {
        try {
            // Find user by email
            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
            // Verify password
            boolean isValid = passwordEncoder.matches(request.getPassword(), user.getPassword());
            
            PasswordVerificationResponse response = new PasswordVerificationResponse();
            response.setValid(isValid);
            response.setUserId(user.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            PasswordVerificationResponse response = new PasswordVerificationResponse();
            response.setValid(false);
            response.setMessage("Error verifying password: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}