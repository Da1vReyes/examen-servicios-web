package com.uam.tecnouamdaivreyes.Prestamo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/** equipoId y fechaPrestamo solo se usan al crear; fechaPrestamo es hoy si no se envia. */
public record PrestamoRequest(
        Long equipoId,
        @NotBlank @Size(max = 120) String nombreSolicitante,
        LocalDate fechaPrestamo,
        @NotNull LocalDate fechaPrevistaDevolucion
) {
}
