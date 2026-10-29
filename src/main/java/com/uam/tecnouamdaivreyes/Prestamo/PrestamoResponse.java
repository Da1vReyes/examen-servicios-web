package com.uam.tecnouamdaivreyes.Prestamo;

import java.time.LocalDate;

public record PrestamoResponse(
        Long id,
        Long equipoId,
        String equipoNombre,
        String nombreSolicitante,
        LocalDate fechaPrestamo,
        LocalDate fechaPrevistaDevolucion,
        EstadoPrestamo estado
) {
    static PrestamoResponse de(Prestamo p) {
        return new PrestamoResponse(
                p.getId(),
                p.getEquipo().getId(),
                p.getEquipo().getNombre(),
                p.getNombreSolicitante(),
                p.getFechaPrestamo(),
                p.getFechaPrevistaDevolucion(),
                p.getEstado());
    }
}
