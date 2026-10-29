package com.uam.tecnouamdaivreyes.Seguridad;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Crea las cuentas de prueba con las contrasenas de las variables de entorno (nunca en el repositorio). */
@Component
public class UsuariosIniciales implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminPassword;
    private final String userPassword;

    public UsuariosIniciales(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                             @Value("${APP_ADMIN_PASSWORD:}") String adminPassword,
                             @Value("${APP_USER_PASSWORD:}") String userPassword) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminPassword = adminPassword;
        this.userPassword = userPassword;
    }

    @Override
    public void run(String... args) {
        crearSiNoExiste("admin", adminPassword, Rol.ADMIN);
        crearSiNoExiste("user", userPassword, Rol.USER);
    }

    private void crearSiNoExiste(String username, String password, Rol rol) {
        if (password.isBlank() || usuarioRepository.findByUsername(username).isPresent()) {
            return;
        }
        usuarioRepository.save(new Usuario(username, passwordEncoder.encode(password), rol));
    }
}
