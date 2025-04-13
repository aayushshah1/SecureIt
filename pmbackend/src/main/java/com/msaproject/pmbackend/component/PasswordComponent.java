package com.msaproject.pmbackend.component;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

@Component
public class PasswordComponent {

    @Value("${password.encryption.secret}")
    private String encryptionSecret;

    /**
     * Encrypts a password using AES encryption with CBC mode and PKCS5Padding
     * 
     * @param plainText The plain text password to encrypt
     * @return The encrypted password as a Base64 encoded string with IV prefixed
     */
    public String encryptPassword(String plainText) {
        try {
            SecretKey secretKey = generateSecretKey();
            
            // Generate a random IV
            byte[] iv = new byte[16];
            SecureRandom random = new SecureRandom();
            random.nextBytes(iv);
            IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);
            
            // Initialize cipher with CBC mode
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivParameterSpec);
            
            // Encrypt the data
            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            
            // Combine IV and encrypted data and encode as Base64
            byte[] combined = new byte[iv.length + encryptedBytes.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encryptedBytes, 0, combined, iv.length, encryptedBytes.length);
            
            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting password", e);
        }
    }

    /**
     * Decrypts an encrypted password
     * 
     * @param encryptedText The encrypted password as a Base64 encoded string with IV prefixed
     * @return The decrypted plain text password
     */
    public String decryptPassword(String encryptedText) {
        try {
            // Decode from Base64
            byte[] combined = Base64.getDecoder().decode(encryptedText);
            
            // Extract IV and encrypted data
            byte[] iv = new byte[16];
            byte[] encryptedBytes = new byte[combined.length - 16];
            
            System.arraycopy(combined, 0, iv, 0, iv.length);
            System.arraycopy(combined, iv.length, encryptedBytes, 0, encryptedBytes.length);
            
            IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);
            SecretKey secretKey = generateSecretKey();
            
            // Initialize cipher for decryption
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKey, ivParameterSpec);
            
            // Decrypt the data
            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting password", e);
        }
    }

    /**
     * Generates a secret key for encryption/decryption
     * 
     * @return The generated SecretKey
     * @throws NoSuchAlgorithmException If the algorithm is not available
     */
    private SecretKey generateSecretKey() throws NoSuchAlgorithmException {
        MessageDigest sha = MessageDigest.getInstance("SHA-256");
        byte[] key = sha.digest(encryptionSecret.getBytes(StandardCharsets.UTF_8));
        key = Arrays.copyOf(key, 16); // AES key size is 16 bytes
        return new SecretKeySpec(key, "AES");
    }
}
