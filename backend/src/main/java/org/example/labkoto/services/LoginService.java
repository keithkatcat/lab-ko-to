package org.example.labkoto.services;


import org.example.labkoto.api.security.JWTUtility;
import org.example.labkoto.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtility jwtUtility;

    public LoginService
        (UserRepository userRepository, PasswordEncoder passwordEncoder, JWTUtility jwtUtility) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtility = jwtUtility;
    }

    public Optional<String> login(String email, String rawPassword) {
        return userRepository.findByEmail(email)
            .filter(user -> passwordEncoder.matches(rawPassword, user.getPassword()))
            .map(user -> jwtUtility.GenerateToken(user.getEmail(), user.getPerm()));
    }
}