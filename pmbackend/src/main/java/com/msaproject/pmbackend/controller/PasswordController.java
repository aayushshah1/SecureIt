package com.msaproject.pmbackend.controller;

import com.msaproject.pmbackend.entity.Passwords;
import com.msaproject.pmbackend.service.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/passwords")
public class PasswordController {
    private static final Logger logger = Logger.getLogger(PasswordController.class.getName());

    @Autowired
    private PasswordService passwordService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<Passwords> createPassword(
            @PathVariable Long userId,
            @RequestBody Passwords password) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            // Log the userId from path and authentication details
            logger.info("Creating password for userId: " + userId + ", authenticated user: " + email);
            
            // Log the incoming password data (omit actual password value)
            logger.info("Password data - website: " + password.getWebsite() + ", username: " + password.getUsername());
            
            // Add null check for required fields
            if (password.getValue() == null || password.getWebsite() == null || password.getUsername() == null) {
                logger.warning("Missing required fields in password creation request");
                return ResponseEntity.badRequest().build();
            }
            
            Passwords savedPassword = passwordService.storePassword(userId, password);
            logger.info("Password stored successfully with ID: " + (savedPassword != null ? savedPassword.getId() : "null"));
            return ResponseEntity.ok(savedPassword);
        } catch (Exception e) {
            logger.severe("Error storing password: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Passwords>> getAllPasswordsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(passwordService.getAllPasswordsForUser(userId));
    }

    @GetMapping("/user/{userId}/{passwordId}")
    public ResponseEntity<Passwords> getPassword(
            @PathVariable Long userId,
            @PathVariable Long passwordId) {
        return passwordService.retrievePassword(userId, passwordId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/user/{userId}/{passwordId}")
    public ResponseEntity<Passwords> updatePassword(
            @PathVariable Long userId,
            @PathVariable Long passwordId,
            @RequestBody Passwords password) {
        try {
            return ResponseEntity.ok(passwordService.updatePassword(userId, passwordId, password));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/user/{userId}/{passwordId}")
    public ResponseEntity<Void> deletePassword(
            @PathVariable Long userId,
            @PathVariable Long passwordId) {
        try {
            passwordService.deletePassword(userId, passwordId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}