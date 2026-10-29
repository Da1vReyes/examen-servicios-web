package com.uam.tecnouamdaivreyes.Equipo;

public record EquipoResponse(
        Long id,
        String codigoPatrimonial,
        String nombre,
        TipoEquipo tipo,
        EstadoEquipo estado
) {
    static EquipoResponse de(Equipo e) {
        return new EquipoResponse(e.getId(), e.getCodigoPatrimonial(), e.getNombre(), e.getTipo(), e.getEstado());
    }
}
