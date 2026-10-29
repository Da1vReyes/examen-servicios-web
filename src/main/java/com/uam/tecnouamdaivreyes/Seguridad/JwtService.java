package com.uam.tecnouamdaivreyes.Seguridad;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private static final long EXPIRACION_MS = 1000L * 60 * 60; // 1 hora

    private final SecretKey clave;

    // La app no levanta si JWT_SECRET_KEY falta, no es base64 o es menor a 256 bits.
    public JwtService(@Value("${JWT_SECRET_KEY}") String secretKey) {
        this.clave = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }

    public String generarToken(Usuario usuario) {
        long ahora = System.currentTimeMillis();
        return Jwts.builder()
                .subject(usuario.getUsername())
                .claim("rol", usuario.getRol().name())
                .issuedAt(new Date(ahora))
                .expiration(new Date(ahora + EXPIRACION_MS))
                .signWith(clave)
                .compact();
    }

    public long getExpiracionSegundos() {
        return EXPIRACION_MS / 1000;
    }

    public String extraerUsername(String token) {
        return claims(token).getSubject();
    }

    public boolean esValido(String token, UserDetails usuario) {
        Claims claims = claims(token);
        return claims.getSubject().equals(usuario.getUsername())
                && claims.getExpiration().after(new Date());
    }

    private Claims claims(String token) {
        return Jwts.parser().verifyWith(clave).build().parseSignedClaims(token).getPayload();
    }
}
