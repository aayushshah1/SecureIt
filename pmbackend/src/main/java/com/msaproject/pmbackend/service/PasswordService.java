package com.msaproject.pmbackend.service;

import com.msaproject.pmbackend.entity.Passwords;
import com.msaproject.pmbackend.entity.User;
import com.msaproject.pmbackend.repository.PasswordRepository;
import com.msaproject.pmbackend.repository.UserRepository;
import com.msaproject.pmbackend.component.PasswordComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class PasswordService {
    private static final Logger logger = Logger.getLogger(PasswordService.class.getName());

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordComponent passwordComponent;

    @Transactional
    public Passwords storePassword(Long userId, Passwords password) {
        logger.info("Attempting to store password for user ID: " + userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.severe("User not found with ID: " + userId);
                    return new RuntimeException("User not found with id: " + userId);
                });
        
        logger.info("User found: " + user.getUsername());
        
        try {
            // Encrypt password before saving
            String encryptedValue = passwordComponent.encryptPassword(password.getValue());
            password.setValue(encryptedValue);
            password.setUser(user);
            
            logger.info("Password encrypted and user set, saving to repository");
            
            Passwords savedPassword = passwordRepository.save(password);
            logger.info("Password saved with ID: " + savedPassword.getId());
            
            return savedPassword;
        } catch (Exception e) {
            logger.severe("Error saving password: " + e.getMessage());
            throw new RuntimeException("Error saving password", e);
        }
    }

    @Transactional
    public Passwords updatePassword(Long userId, Long passwordId, Passwords newPassword) {
        logger.info("Attempting to update password for user ID: " + userId + " and password ID: " + passwordId);
        
        return passwordRepository.findById(passwordId)
                .map(password -> {
                    if (!password.getUser().getId().equals(userId)) {
                        logger.severe("Password does not belong to user ID: " + userId);
                        throw new RuntimeException("Password does not belong to user");
                    }
                    
                    try {
                        // Encrypt the new password value
                        String encryptedValue = passwordComponent.encryptPassword(newPassword.getValue());
                        password.setValue(encryptedValue);
                        password.setWebsite(newPassword.getWebsite());
                        password.setUsername(newPassword.getUsername());
                        password.setDescription(newPassword.getDescription());
                        
                        logger.info("Password updated, saving to repository");
                        
                        Passwords updatedPassword = passwordRepository.save(password);
                        logger.info("Password updated with ID: " + updatedPassword.getId());
                        
                        return updatedPassword;
                    } catch (Exception e) {
                        logger.severe("Error updating password: " + e.getMessage());
                        throw new RuntimeException("Error updating password", e);
                    }
                }).orElseThrow(() -> {
                    logger.severe("Password not found with ID: " + passwordId);
                    return new RuntimeException("Password not found");
                });
    }

    public Optional<Passwords> retrievePassword(Long userId, Long passwordId) {
        logger.info("Attempting to retrieve password for user ID: " + userId + " and password ID: " + passwordId);
        
        Optional<Passwords> passwordOpt = passwordRepository.findById(passwordId);
        if (passwordOpt.isPresent() && passwordOpt.get().getUser().getId().equals(userId)) {
            Passwords password = passwordOpt.get();
            
            try {
                // Decrypt password before returning
                String decryptedValue = passwordComponent.decryptPassword(password.getValue());
                password.setValue(decryptedValue);
                
                logger.info("Password retrieved and decrypted");
                
                return Optional.of(password);
            } catch (Exception e) {
                logger.severe("Error decrypting password: " + e.getMessage());
                throw new RuntimeException("Error decrypting password", e);
            }
        }
        
        logger.warning("Password not found or does not belong to user ID: " + userId);
        return Optional.empty();
    }

    public List<Passwords> getAllPasswordsForUser(Long userId) {
        logger.info("Attempting to retrieve all passwords for user ID: " + userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.severe("User not found with ID: " + userId);
                    return new RuntimeException("User not found with id: " + userId);
                });
        
        logger.info("User found: " + user.getUsername());
        
        List<Passwords> passwords = user.getPasswords();
        passwords.forEach(password -> {
            password.setValue(passwordComponent.decryptPassword(password.getValue()));
        });
        
        logger.info("Passwords retrieved for user ID: " + userId);
        
        return passwords;
    }

    @Transactional
    public void deletePassword(Long userId, Long passwordId) {
        logger.info("Attempting to delete password for user ID: " + userId + " and password ID: " + passwordId);
        
        passwordRepository.findById(passwordId)
                .ifPresent(password -> {
                    if (password.getUser().getId().equals(userId)) {
                        try {
                            passwordRepository.deleteById(passwordId);
                            logger.info("Password deleted with ID: " + passwordId);
                        } catch (Exception e) {
                            logger.severe("Error deleting password: " + e.getMessage());
                            throw new RuntimeException("Error deleting password", e);
                        }
                    } else {
                        logger.severe("Password does not belong to user ID: " + userId);
                        throw new RuntimeException("Password does not belong to user");
                    }
                });
    }
}
