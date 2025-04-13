package com.example.auth_server.Controller;

import com.example.auth_server.DTO.TokenValidationRequest;
import com.example.auth_server.DTO.TokenValidationResponse;
import com.example.auth_server.Entity.User;
import com.example.auth_server.Entity.Role;
import com.example.auth_server.Service.JwtService;
import com.example.auth_server.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller specifically for JWT validation operations used by other microservices
 */
@RestController
@RequestMapping("/api/jwt")
public class JwtValidationController {

    private static final Logger logger = LoggerFactory.getLogger(JwtValidationController.class);

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    /**
     * Validates a JWT token and returns user information if valid
     * @param request containing the JWT token
     * @return validation result with user information if token is valid
     */
    @PostMapping("/validate")
    public ResponseEntity<TokenValidationResponse> validateJwt(@RequestBody TokenValidationRequest request) {
        logger.info("JWT validation request received");
        String token = request.getToken();
        
        TokenValidationResponse response = new TokenValidationResponse();
        
        try {
            // Extract username (email) from token
            String email = jwtService.extractUsername(token);
            
            // Get user details
            UserDetails userDetails = userService.loadUserByUsername(email);
            
            // Validate token
            boolean isValid = jwtService.isTokenValid(token, userDetails);
            response.setValid(isValid);
            
            if (isValid) {
                // Get additional user information
                User user = userService.findByEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                
                response.setUserId(user.getId());
                response.setEmail(user.getEmail());
                response.setUsername(user.getUsername());
                response.setRole(user.getRole());
                response.setMessage("Token is valid");
            } else {
                response.setMessage("Token is invalid");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error validating JWT", e);
            response.setValid(false);
            response.setMessage("Error validating token: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * Extracts and returns claims from a JWT without full validation
     * This endpoint supports both extract-claims and get-claims paths for backward compatibility
     * @param token JWT token as a request parameter
     * @return map of claims from the token
     */
    @GetMapping({"/extract-claims", "/get-claims"})
    public ResponseEntity<Map<String, Object>> extractClaims(@RequestParam String token) {
        try {
            Map<String, Object> claims = new HashMap<>(jwtService.extractAllClaims(token));
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            logger.error("Error extracting claims from JWT", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to extract claims: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Checks if a token is expired
     * @param token JWT token as a request parameter
     * @return status response indicating if the token is expired
     */
    @GetMapping("/check-expiration")
    public ResponseEntity<Map<String, Object>> checkTokenExpiration(@RequestParam String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean isExpired = jwtService.isTokenExpired(token);
            response.put("expired", isExpired);
            response.put("message", isExpired ? "Token has expired" : "Token is still valid");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error checking token expiration", e);
            response.put("error", "Failed to check expiration: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Health check endpoint for the JWT service
     * @return status message
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "JWT Validation Service");
        return ResponseEntity.ok(response);
    }

    /**
     * Verifies if the user in the JWT token matches the requested user ID
     * Used by pmbackend to ensure users can only access their own data
     * @param token JWT token from the request
     * @param userId User ID being accessed
     * @return authorization result with access permission
     */
    @GetMapping("/verify-user-access")
    public ResponseEntity<Map<String, Object>> verifyUserAccess(
            @RequestParam String token, 
            @RequestParam Long userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Extract username (email) from token
            String email = jwtService.extractUsername(token);
            
            // Get user details
            UserDetails userDetails = userService.loadUserByUsername(email);
            
            // Validate token
            boolean isValid = jwtService.isTokenValid(token, userDetails);
            
            if (isValid) {
                // Get user information to compare IDs
                User user = userService.findByEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                
                // Check if user is an ADMIN (admins can access any user's data)
                boolean isAdmin = user.getRole() == Role.ADMIN;
                
                // User has access if they're accessing their own data or they're an admin
                boolean hasAccess = user.getId().equals(userId) || isAdmin;
                
                response.put("authorized", hasAccess);
                response.put("role", user.getRole().toString());
                response.put("message", hasAccess ? 
                        "User is authorized to access this resource" : 
                        "User is not authorized to access this resource");
                
                return ResponseEntity.ok(response);
            } else {
                response.put("authorized", false);
                response.put("message", "Invalid token");
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            logger.error("Error verifying user access", e);
            response.put("authorized", false);
            response.put("message", "Error verifying access: " + e.getMessage());
            return ResponseEntity.status(401).body(response);
        }
    }
    
    /**
     * Checks if a user has a specific role
     * @param token JWT token
     * @param role Role to check
     * @return whether user has the specified role
     */
    @GetMapping("/check-role")
    public ResponseEntity<Map<String, Object>> checkRole(
            @RequestParam String token,
            @RequestParam String role) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Extract username (email) from token
            String email = jwtService.extractUsername(token);
            
            // Get user details
            UserDetails userDetails = userService.loadUserByUsername(email);
            
            // Validate token
            boolean isValid = jwtService.isTokenValid(token, userDetails);
            
            if (isValid) {
                User user = userService.findByEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                
                boolean hasRole = user.getRole().name().equals(role);
                
                response.put("hasRole", hasRole);
                response.put("userRole", user.getRole().name());
                
                return ResponseEntity.ok(response);
            } else {
                response.put("hasRole", false);
                response.put("message", "Invalid token");
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            logger.error("Error checking role", e);
            response.put("hasRole", false);
            response.put("message", "Error checking role: " + e.getMessage());
            return ResponseEntity.status(401).body(response);
        }
    }
}
