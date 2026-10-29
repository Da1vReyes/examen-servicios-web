package com.uam.tecnouamdaivreyes.Prestamo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {

    boolean existsByEquipoIdAndEstado(Long equipoId, EstadoPrestamo estado);

}
