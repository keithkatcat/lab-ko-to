package org.example.labkoto.api.controller;

import org.example.labkoto.api.model.User;
import org.example.labkoto.api.security.JWTUtility;
import org.example.labkoto.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final JWTUtility jwtUtility;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, JWTUtility jwtUtility, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtility = jwtUtility;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User savedUser = userService.register(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(createErrorResponse("Invalid authorization header"));
            }

            String token = authHeader.substring(7);

            if (!jwtUtility.validateToken(token)) {
                return ResponseEntity.status(401).body(createErrorResponse("Invalid token"));
            }

            String email = jwtUtility.extractEmail(token);
            Optional<User> userOptional = userService.findByEmail(email);

            if (userOptional.isPresent()) {
                return ResponseEntity.ok(userOptional.get());
            } else {
                return ResponseEntity.status(404).body(createErrorResponse("User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body(createErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateOwnProfile(
        @RequestBody ProfileUpdateRequest request,
        @RequestHeader("Authorization") String authHeader) {

        try {
            // Extract email from JWT token
            String token = authHeader.substring(7);
            String currentUserEmail = jwtUtility.extractEmail(token);

            // Find current user
            User currentUser = userService.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println("=== Profile Update Request ===");
            System.out.println("Current user email: " + currentUserEmail);
            System.out.println("Request: " + request);

            // EMAIL UPDATE
            if (request.getEmail() != null && !request.getEmail().isBlank()) {
                // Check if new email is different from current
                if (request.getEmail().equals(currentUser.getEmail())) {
                    return ResponseEntity.badRequest()
                        .body(createErrorResponse("New email is the same as current email"));
                }

                // Check if email already exists
                Optional<User> existingUser = userService.findByEmail(request.getEmail());
                if (existingUser.isPresent()) {
                    return ResponseEntity.badRequest()
                        .body(createErrorResponse("Email already in use"));
                }

                // Verify old password for email change
                if (request.getOldPassword() == null || request.getOldPassword().isBlank()) {
                    return ResponseEntity.badRequest()
                        .body(createErrorResponse("Password is required to change email"));
                }

                if (!passwordEncoder.matches(request.getOldPassword(), currentUser.getPassword())) {
                    return ResponseEntity.status(401)
                        .body(createErrorResponse("Incorrect password"));
                }

                // Update email
                currentUser.setEmail(request.getEmail());
                System.out.println("Email updated to: " + request.getEmail());
            }

            // USERNAME UPDATE
            if (request.getUsername() != null && !request.getUsername().isBlank()) {
                currentUser.setUsername(request.getUsername());
                System.out.println("Username updated to: " + request.getUsername());
            }

            // PASSWORD UPDATE
            if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
                // Check if old password is provided
                if (request.getOldPassword() == null || request.getOldPassword().isBlank()) {
                    return ResponseEntity.badRequest()
                        .body(createErrorResponse("Old password is required to change password"));
                }

                // Verify old password matches
                if (!passwordEncoder.matches(request.getOldPassword(), currentUser.getPassword())) {
                    return ResponseEntity.status(401)
                        .body(createErrorResponse("Old password is incorrect"));
                }

                // Check if new password is different
                if (passwordEncoder.matches(request.getNewPassword(), currentUser.getPassword())) {
                    return ResponseEntity.badRequest()
                        .body(createErrorResponse("New password must be different from current password"));
                }

                // Update password
                currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
                System.out.println("Password updated");
            }

            // Save and return updated user
            User updated = userService.updateUser(currentUser);
            System.out.println("User updated successfully");

            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            System.err.println("Error updating profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(createErrorResponse("Failed to update profile: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<User> getUser(@PathVariable Integer id) {
        Optional<User> userOptional = userService.getUser(id);
        return userOptional.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User user) {
        user.setId(id);
        User updated = userService.updateUser(user);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Helper method to create error responses
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);
        return error;
    }

    // DTOs
    public static class ProfileUpdateRequest {
        private String email;
        private String username;
        private String oldPassword;
        private String newPassword;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getOldPassword() {
            return oldPassword;
        }

        public void setOldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }

        @Override
        public String toString() {
            return "ProfileUpdateRequest{" +
                "email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", hasOldPassword=" + (oldPassword != null) +
                ", hasNewPassword=" + (newPassword != null) +
                '}';
        }
    }
}