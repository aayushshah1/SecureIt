package com.msaproject.pmbackend.security;

import com.msaproject.pmbackend.service.JwtService;
import com.msaproject.pmbackend.entity.User;
import com.msaproject.pmbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class UserSecurity {
    private static final Logger logger = Logger.getLogger(UserSecurity.class.getName());
    
    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;
    
    /**
     * Check if the current authenticated user is the owner of the resource
     * Used in @PreAuthorize expressions
     */
    public boolean isResourceOwner(Long resourceId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warning("No authentication found when checking resource access");
            return false;
        }
        
        // Get JWT token from credentials (set by JwtAuthFilter)
        String jwt = (String) authentication.getCredentials();
        if (jwt == null) {
            logger.warning("No JWT found in authentication credentials");
            return false;
        }

        User user = userService.getUserById(resourceId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check resource access via JwtService
        boolean hasAccess = jwtService.hasResourceAccess(jwt, user);
        if (!hasAccess) {
            logger.warning("User " + authentication.getName() + " denied access to resource: " + resourceId);
        }
        return hasAccess;
    }
    
    /**
     * Check if the current authenticated user has admin role
     * Used in @PreAuthorize expressions
     */
    public boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
