package com.msaproject.pmbackend.controller;

import com.msaproject.pmbackend.entity.Role;
import com.msaproject.pmbackend.entity.User;
import com.msaproject.pmbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = Logger.getLogger(UserController.class.getName());

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")  // This alone is sufficient
    public List<User> getAllUsers() {
        logger.info("Retrieving all users");
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isResourceOwner(#id)")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        logger.info("Retrieving user with ID: " + id);
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public User createUser(@RequestBody User user) {
        // New users are created with USER role by default
        user.setRole(Role.USER);
        logger.info("Creating new user");
        return userService.createUser(user);
    }

    //THIS IS AN UNPROTECTED ROUTE ONLY FOR DEVELOPMENT, MAKE SURE TO REMOVE/SECURE IN PROD!!!
    @PostMapping("/registerAdmin")
    public User createAdmin(@RequestBody User user) {
        user.setRole(Role.ADMIN);
        logger.info("Creating new user");
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isResourceOwner(#id)")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id, 
            @RequestBody User userDetails) {
        try {
            logger.info("Updating user with ID: " + id);
            
            // If not admin, prevent role changes
            boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                    .stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin && userDetails.getRole() != null) {
                // Get current user to preserve role
                userService.getUserById(id).ifPresent(u -> userDetails.setRole(u.getRole()));
            }
            
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            logger.severe("Error updating user: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isResourceOwner(#id)")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            logger.info("Deleting user with ID: " + id);
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            logger.severe("Error deleting user: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/promote/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> promoteToAdmin(@PathVariable Long id) {
        logger.info("Promoting user to admin: " + id);
        return userService.getUserById(id)
                .map(user -> {
                    user.setRole(Role.ADMIN);
                    User updatedUser = userService.updateUser(id, user);
                    return ResponseEntity.ok(updatedUser);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/demote/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> demoteToUser(@PathVariable Long id) {
        logger.info("Demoting user to regular user: " + id);
        return userService.getUserById(id)
                .map(user -> {
                    user.setRole(Role.USER);
                    User updatedUser = userService.updateUser(id, user);
                    return ResponseEntity.ok(updatedUser);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}