package com.uam.tecnouamdaivreyes.Equipo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EquipoRequest(
        @NotBlank @Size(max = 50) String codigoPatrimonial,
        @NotBlank @Size(max = 100) String nombre,
        @NotNull TipoEquipo tipo
) {
}
