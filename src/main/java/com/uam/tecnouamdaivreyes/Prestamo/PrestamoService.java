package com.uam.tecnouamdaivreyes.Prestamo;

import com.uam.tecnouamdaivreyes.Equipo.Equipo;
import com.uam.tecnouamdaivreyes.Equipo.EquipoService;
import com.uam.tecnouamdaivreyes.Equipo.EstadoEquipo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PrestamoService {

    private final PrestamoRepository prestamoRepository;
    private final EquipoService equipoService;

    public PrestamoService(PrestamoRepository prestamoRepository, EquipoService equipoService) {
        this.prestamoRepository = prestamoRepository;
        this.equipoService = equipoService;
    }

    @Transactional(readOnly = true)
    public List<PrestamoResponse> listar() {
        return prestamoRepository.findAll().stream().map(PrestamoResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public PrestamoResponse obtener(Long id) {
        return PrestamoResponse.de(buscar(id));
    }

    public PrestamoResponse crear(PrestamoRequest request) {
        if (request.equipoId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "equipoId es obligatorio");
        }
        Equipo equipo = equipoService.buscar(request.equipoId());
        if (equipo.getEstado() != EstadoEquipo.DISPONIBLE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El equipo no esta disponible");
        }
        LocalDate fechaPrestamo = request.fechaPrestamo() != null ? request.fechaPrestamo() : LocalDate.now();
        validarFechas(fechaPrestamo, request.fechaPrevistaDevolucion());

        equipo.setEstado(EstadoEquipo.PRESTADO);
        Prestamo prestamo = new Prestamo(equipo, request.nombreSolicitante(), fechaPrestamo,
                request.fechaPrevistaDevolucion());
        return PrestamoResponse.de(prestamoRepository.save(prestamo));
    }

    public PrestamoResponse actualizar(Long id, PrestamoRequest request) {
        Prestamo prestamo = buscar(id);
        if (prestamo.getEstado() == EstadoPrestamo.DEVUELTO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El prestamo ya fue devuelto");
        }
        validarFechas(prestamo.getFechaPrestamo(), request.fechaPrevistaDevolucion());
        prestamo.setNombreSolicitante(request.nombreSolicitante());
        prestamo.setFechaPrevistaDevolucion(request.fechaPrevistaDevolucion());
        return PrestamoResponse.de(prestamo);
    }

    public PrestamoResponse devolver(Long id) {
        Prestamo prestamo = buscar(id);
        if (prestamo.getEstado() == EstadoPrestamo.DEVUELTO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El prestamo ya fue devuelto");
        }
        prestamo.setEstado(EstadoPrestamo.DEVUELTO);
        prestamo.getEquipo().setEstado(EstadoEquipo.DISPONIBLE);
        return PrestamoResponse.de(prestamo);
    }

    public void eliminar(Long id) {
        Prestamo prestamo = buscar(id);
        if (prestamo.getEstado() == EstadoPrestamo.ACTIVO) {
            prestamo.getEquipo().setEstado(EstadoEquipo.DISPONIBLE);
        }
        prestamoRepository.delete(prestamo);
    }

    private Prestamo buscar(Long id) {
        return prestamoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prestamo no encontrado: " + id));
    }

    private void validarFechas(LocalDate prestamo, LocalDate devolucion) {
        if (devolucion.isBefore(prestamo)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La fecha prevista de devolucion no puede ser anterior a la del prestamo");
        }
    }
}
