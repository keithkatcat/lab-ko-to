package org.example.labkoto.api.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;

@Component
public class JWTUtility {
    private final String secretkey = "labkotoadminkeylabkotoadminkey123";
    private final long ExpirationTime = 1000 * 60 * 60;

    private final Key key = Keys.hmacShaKeyFor(secretkey.getBytes());

    public String GenerateToken(String email, int perm) {
        return Jwts.builder()
            .setSubject(email)
            .addClaims(Map.of("perm", perm))
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + ExpirationTime))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token).getBody().getSubject();
    }

    public int extractPerm(String token) {
        return (int) Jwts.parser()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token).getBody().get("perm");
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        }
        catch (JwtException e) {
            return false;
        }
    }
}
