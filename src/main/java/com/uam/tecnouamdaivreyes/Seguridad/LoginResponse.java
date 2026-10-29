package com.uam.tecnouamdaivreyes.Seguridad;

public record LoginResponse(String token, String tipo, long expiraEnSegundos, String username, Rol rol) {
}
