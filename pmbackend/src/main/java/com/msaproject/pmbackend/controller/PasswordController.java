package com.msaproject.pmbackend.controller;

import com.msaproject.pmbackend.entity.Passwords;
import com.msaproject.pmbackend.service.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passwords")
public class PasswordController {

    @Autowired
    private PasswordService passwordService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<Passwords> createPassword(
            @PathVariable Long userId,
            @RequestBody Passwords password) {
        return ResponseEntity.ok(passwordService.storePassword(userId, password));
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