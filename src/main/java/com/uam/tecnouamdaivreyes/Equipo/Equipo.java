package com.uam.tecnouamdaivreyes.Equipo;
import com.uam.tecnouamdaivreyes.Prestamo.Prestamo;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "equipos",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_equipo_codigo_patrimonial",
                        columnNames = "codigo_patrimonial"
                )
        }
)
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "codigo_patrimonial",
            nullable = false,
            unique = true,
            length = 50
    )
    private String codigoPatrimonial;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoEquipo tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoEquipo estado = EstadoEquipo.DISPONIBLE;

    @OneToMany(mappedBy = "equipo", fetch = FetchType.LAZY)
    private List<Prestamo> prestamos = new ArrayList<>();

    protected Equipo() {
    }

    public Equipo(
            String codigoPatrimonial,
            String nombre,
            TipoEquipo tipo
    ) {
        this.codigoPatrimonial = codigoPatrimonial;
        this.nombre = nombre;
        this.tipo = tipo;
        this.estado = EstadoEquipo.DISPONIBLE;
    }

    public Long getId() {
        return id;
    }

    public String getCodigoPatrimonial() {
        return codigoPatrimonial;
    }

    public void setCodigoPatrimonial(String codigoPatrimonial) {
        this.codigoPatrimonial = codigoPatrimonial;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public TipoEquipo getTipo() {
        return tipo;
    }

    public void setTipo(TipoEquipo tipo) {
        this.tipo = tipo;
    }

    public EstadoEquipo getEstado() {
        return estado;
    }

    public void setEstado(EstadoEquipo estado) {
        this.estado = estado;
    }

    public List<Prestamo> getPrestamos() {
        return prestamos;
    }
}
