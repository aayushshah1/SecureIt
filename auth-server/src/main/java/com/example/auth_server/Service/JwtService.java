package com.example.auth_server.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

public class JwtUtil {
    private static final String SECRET = "secret";
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    public static String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuer("your-app")
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 1 day Expiration
                .signWith(KEY)
                .compact();
    }

    public static Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
