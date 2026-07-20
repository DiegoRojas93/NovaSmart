package com.NovaSmart.Backend.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {

    // IMPORTANTE: En producción esto va en tu application.properties
    // Esta es una clave secreta (debe tener al menos 256 bits).
    private static final String SECRET_KEY = "N0v4Sm4rtS3cr3tK3yF0rT0k3nS3cur1tyMustB3L0ng";

    public String generateToken(String username, Map extraClaims) {
        return Jwts.builder()
            .claims(extraClaims)
            .subject(username)
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // Expira en 24 horas
            .signWith(getSignInKey())
            .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
            .verifyWith(getSignInKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // 1. Método principal que llama el Filtro para saber si el token es válido
    public boolean isTokenValid(String token, org.springframework.security.core.userdetails.UserDetails userDetails) {
        final String username = extractUsername(token);
        // Es válido si el nombre coincide y si NO ha expirado
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // 2. Comprueba si la fecha actual es posterior a la fecha de expiración del token
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // 3. Extrae específicamente la fecha de expiración
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // 4. Método genérico para extraer cualquier "Claim" (Dato) del token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // 5. Desencripta el token completo para poder leer su interior
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSignInKey()) // Usa tu clave secreta para verificar la firma
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
