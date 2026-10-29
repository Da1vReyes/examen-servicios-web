CREATE TABLE equipos (
    id                  BIGSERIAL PRIMARY KEY,
    codigo_patrimonial  VARCHAR(50)  NOT NULL,
    nombre              VARCHAR(100) NOT NULL,
    tipo                VARCHAR(30)  NOT NULL,
    estado              VARCHAR(20)  NOT NULL,
    CONSTRAINT uk_equipo_codigo_patrimonial UNIQUE (codigo_patrimonial)
);

CREATE TABLE prestamos (
    id                         BIGSERIAL PRIMARY KEY,
    equipo_id                  BIGINT       NOT NULL,
    nombre_solicitante         VARCHAR(120) NOT NULL,
    fecha_prestamo             DATE         NOT NULL,
    fecha_prevista_devolucion  DATE         NOT NULL,
    estado                     VARCHAR(20)  NOT NULL,
    CONSTRAINT fk_prestamo_equipo FOREIGN KEY (equipo_id) REFERENCES equipos (id)
);
