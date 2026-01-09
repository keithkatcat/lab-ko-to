package org.example.labkoto.services;

import org.example.labkoto.api.model.User;
import org.example.labkoto.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    // Constructor injection (preferred)
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Get user by ID
    public Optional<User> getUser(Integer id) {
        return userRepository.findById(id);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Save new user
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Update existing user
    public User updateUser(User user) {
        User existing = userRepository.findById(user.getId())
            .orElseThrow(() -> new RuntimeException("User with " + user.getId() + " id not found"));

        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            existing.setEmail(user.getEmail());
        }

        if (user.getUsername() != null && !user.getUsername().isBlank()) {
            existing.setUsername(user.getUsername());
        }
        if (user.getAccountType() != null && !user.getAccountType().isBlank()) {
            existing.setAccountType(user.getAccountType());
        }

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(existing);
    }


    // Delete user by ID
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    // Find user by email (for login)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
