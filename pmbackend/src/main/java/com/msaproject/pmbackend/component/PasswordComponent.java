package com.msaproject.pmbackend.component;

import org.springframework.stereotype.Component;

@Component
public class PasswordComponent {

    public String encryptPassword(String password) {
        return new StringBuilder(password).reverse().toString();
    }

    public String decryptPassword(String encryptedPassword) {
        return new StringBuilder(encryptedPassword).reverse().toString();
    }
}
