package com.msaproject.pmbackend.service;

import com.msaproject.pmbackend.entity.Passwords;
import com.msaproject.pmbackend.entity.User;
import com.msaproject.pmbackend.repository.PasswordRepository;
import com.msaproject.pmbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PasswordService {

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private UserRepository userRepository;

    public Passwords storePassword(Long userId, Passwords password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        password.setUser(user);
        return passwordRepository.save(password);
    }

    public Passwords updatePassword(Long userId, Long passwordId, Passwords newPassword) {
        return passwordRepository.findById(passwordId)
                .map(password -> {
                    if (!password.getUser().getId().equals(userId)) {
                        throw new RuntimeException("Password does not belong to user");
                    }
                    password.setValue(newPassword.getValue());
                    password.setWebsite(newPassword.getWebsite());
                    password.setUsername(newPassword.getUsername());
                    password.setDescription(newPassword.getDescription());
                    return passwordRepository.save(password);
                }).orElseThrow(() -> new RuntimeException("Password not found"));
    }

    public Optional<Passwords> retrievePassword(Long userId, Long passwordId) {
        Optional<Passwords> password = passwordRepository.findById(passwordId);
        return password.filter(p -> p.getUser().getId().equals(userId));
    }

    public List<Passwords> getAllPasswordsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return user.getPasswords();
    }

    public void deletePassword(Long userId, Long passwordId) {
        passwordRepository.findById(passwordId)
                .ifPresent(password -> {
                    if (password.getUser().getId().equals(userId)) {
                        passwordRepository.deleteById(passwordId);
                    } else {
                        throw new RuntimeException("Password does not belong to user");
                    }
                });
    }
}
