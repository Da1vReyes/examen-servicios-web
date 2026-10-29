package com.uam.tecnouamdaivreyes.Seguridad;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(@NotBlank String username, @NotBlank String password) {
}
