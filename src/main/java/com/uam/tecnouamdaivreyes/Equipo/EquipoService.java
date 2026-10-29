package com.uam.tecnouamdaivreyes.Equipo;

import com.uam.tecnouamdaivreyes.Prestamo.EstadoPrestamo;
import com.uam.tecnouamdaivreyes.Prestamo.PrestamoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class EquipoService {

    private final EquipoRepository equipoRepository;
    private final PrestamoRepository prestamoRepository;

    public EquipoService(EquipoRepository equipoRepository, PrestamoRepository prestamoRepository) {
        this.equipoRepository = equipoRepository;
        this.prestamoRepository = prestamoRepository;
    }

    @Transactional(readOnly = true)
    public List<EquipoResponse> listar() {
        return equipoRepository.findAll().stream().map(EquipoResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public EquipoResponse obtener(Long id) {
        return EquipoResponse.de(buscar(id));
    }

    public EquipoResponse crear(EquipoRequest request) {
        Equipo equipo = new Equipo(request.codigoPatrimonial(), request.nombre(), request.tipo());
        return EquipoResponse.de(equipoRepository.saveAndFlush(equipo));
    }

    public EquipoResponse actualizar(Long id, EquipoRequest request) {
        Equipo equipo = buscar(id);
        equipo.setCodigoPatrimonial(request.codigoPatrimonial());
        equipo.setNombre(request.nombre());
        equipo.setTipo(request.tipo());
        return EquipoResponse.de(equipoRepository.saveAndFlush(equipo));
    }

    public void eliminar(Long id) {
        Equipo equipo = buscar(id);
        if (prestamoRepository.existsByEquipoIdAndEstado(id, EstadoPrestamo.ACTIVO)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar un equipo con prestamos activos");
        }
        // Los prestamos ya devueltos son historial del equipo y se eliminan con el.
        prestamoRepository.deleteAll(equipo.getPrestamos());
        equipoRepository.delete(equipo);
        equipoRepository.flush();
    }

    public Equipo buscar(Long id) {
        return equipoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo no encontrado: " + id));
    }
}
