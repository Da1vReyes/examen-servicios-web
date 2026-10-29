CREATE TABLE usuarios (
    id        BIGSERIAL PRIMARY KEY,
    username  VARCHAR(50)  NOT NULL,
    password  VARCHAR(100) NOT NULL,
    rol       VARCHAR(20)  NOT NULL,
    CONSTRAINT uk_usuario_username UNIQUE (username)
);
