package com.example.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class GatewayCorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Explicit allowed origins - credentials require specific origins, not wildcard
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",     // Local development
            "http://localhost:8000",     // Gateway itself
            "http://localhost:8081",     // Auth server direct access
            "http://localhost:8080",     // Backend direct access
            "http://client",             // Docker network client hostname
            "http://api-gateway",        // Docker network gateway hostname
            "http://auth-server",        // Docker network auth-server hostname
            "http://pmbackend"           // Docker network backend hostname
        ));
        
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
