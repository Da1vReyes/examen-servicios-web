package com.uam.tecnouamdaivreyes.Prestamo;

import com.uam.tecnouamdaivreyes.Equipo.Equipo;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "prestamos")
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "equipo_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_prestamo_equipo")
    )
    private Equipo equipo;

    @Column(
            name = "nombre_solicitante",
            nullable = false,
            length = 120
    )
    private String nombreSolicitante;

    @Column(name = "fecha_prestamo", nullable = false)
    private LocalDate fechaPrestamo;

    @Column(
            name = "fecha_prevista_devolucion",
            nullable = false
    )
    private LocalDate fechaPrevistaDevolucion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoPrestamo estado = EstadoPrestamo.ACTIVO;

    protected Prestamo() {
    }

    public Prestamo(
            Equipo equipo,
            String nombreSolicitante,
            LocalDate fechaPrestamo,
            LocalDate fechaPrevistaDevolucion
    ) {
        this.equipo = equipo;
        this.nombreSolicitante = nombreSolicitante;
        this.fechaPrestamo = fechaPrestamo;
        this.fechaPrevistaDevolucion = fechaPrevistaDevolucion;
        this.estado = EstadoPrestamo.ACTIVO;
    }

    public Long getId() {
        return id;
    }

    public Equipo getEquipo() {
        return equipo;
    }

    public String getNombreSolicitante() {
        return nombreSolicitante;
    }

    public LocalDate getFechaPrestamo() {
        return fechaPrestamo;
    }

    public LocalDate getFechaPrevistaDevolucion() {
        return fechaPrevistaDevolucion;
    }

    public void setNombreSolicitante(String nombreSolicitante) {
        this.nombreSolicitante = nombreSolicitante;
    }

    public void setFechaPrevistaDevolucion(LocalDate fechaPrevistaDevolucion) {
        this.fechaPrevistaDevolucion = fechaPrevistaDevolucion;
    }

    public EstadoPrestamo getEstado() {
        return estado;
    }

    public void setEstado(EstadoPrestamo estado) {
        this.estado = estado;
    }
}
