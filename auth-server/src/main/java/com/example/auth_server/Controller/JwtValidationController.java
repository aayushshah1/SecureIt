package com.example.auth_server.Controller;

import com.example.auth_server.DTO.TokenValidationRequest;
import com.example.auth_server.DTO.TokenValidationResponse;
import com.example.auth_server.Entity.User;
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
     * Useful for debugging or when services need to inspect token content
     * @param token JWT token as a request parameter
     * @return map of claims from the token
     */
    @GetMapping("/extract-claims")
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
}
