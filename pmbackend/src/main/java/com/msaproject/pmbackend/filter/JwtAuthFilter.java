package com.msaproject.pmbackend.filter;

import com.msaproject.pmbackend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private static final Logger logger = Logger.getLogger(JwtAuthFilter.class.getName());

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            final String jwt = authHeader.substring(7);
            
            // Check token validity with auth-server
            boolean isValid = jwtService.isTokenValid(jwt);
            
            if (isValid && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Get all claims from auth-server
                Map<String, Object> claims = jwtService.getClaims(jwt);
                
                // Extract username from claims (subject claim)
                String username = (String) claims.getOrDefault("sub", "");
                
                if (username.isEmpty()) {
                    filterChain.doFilter(request, response);
                    return;
                }
                
                // Extract roles from claims
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                Object rolesObj = claims.get("roles");
                if (rolesObj instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> roles = (List<String>) rolesObj;
                    authorities = roles.stream()
                            .map(role -> new SimpleGrantedAuthority(role.startsWith("ROLE_") ? role : "ROLE_" + role))
                            .collect(Collectors.toList());
                }
                
                // Create and set authentication token
                UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                                username,
                                jwt, // Store JWT as credentials for later access
                                authorities
                        );
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.info("Authentication set for user: " + username + " with authorities: " + authorities);
            }
        } catch (Exception e) {
            logger.warning("Could not set user authentication: " + e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
}
