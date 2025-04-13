package com.msaproject.pmbackend.service;

import com.msaproject.pmbackend.entity.Role;
import com.msaproject.pmbackend.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class JwtService {
    private static final Logger logger = Logger.getLogger(JwtService.class.getName());

    @Value("${auth.server.url}")
    private String authServerUrl;

    private final RestTemplate restTemplate;

    public JwtService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    /**
     * Get all claims from the token in a single API call to auth-server
     * This replaces multiple individual claim extraction methods
     */
    public Map<String, Object> getClaims(String token) {
        try {
            Map<String, Object> response = restTemplate.getForObject(
                    authServerUrl + "/api/jwt/get-claims?token=" + token,
                    Map.class
            );
            
            if (response != null) {
                logger.info("Retrieved claims for token");
                return response;
            }
        } catch (Exception e) {
            logger.warning("Error retrieving claims: " + e.getMessage());
        }
        return Collections.emptyMap();
    }
    
    /**
     * Check if the token is valid (not expired and signature is valid)
     */
    public boolean isTokenValid(String token) {
        try {
            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Create request body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("token", token);
            
            // Create the HTTP entity with headers and body
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
            
            // Send POST request to auth-server
            Map<String, Object> response = restTemplate.postForObject(
                    authServerUrl + "/api/jwt/validate",
                    requestEntity,
                    Map.class
            );
            
            // Process response
            if (response != null && response.containsKey("valid")) {
                boolean isValid = (Boolean) response.get("valid");
                logger.info("Token validation result: " + isValid);
                return isValid;
            }
            return false;
        } catch (Exception e) {
            logger.warning("Error validating token: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Check if the user has access to a specific resource
     * This is used to control access to user-specific resources
     */
    public boolean hasResourceAccess(String token, User user) {
        try {
            // First check if token is valid
            if (!isTokenValid(token)) {
                return false;
            }

            // Get claims from token
            Map<String, Object> claims = getClaims(token);

            // If user is admin, allow access
            if (user.getRole().equals(Role.ADMIN)) {
                return true;
            }

            String email = (String) claims.get("sub");
            return email.equals(user.getEmail());

        } catch (Exception e) {
            logger.warning("Error checking resource access: " + e.getMessage());
            return false;
        }
    }
}
