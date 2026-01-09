package org.example.labkoto.api.controller;

import org.example.labkoto.api.model.User;
import org.example.labkoto.api.security.JWTUtility;
import org.example.labkoto.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping ("/api/user")
public class UserController {

    private final UserService userService;
    private final JWTUtility jWTUtility;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, JWTUtility jWTUtility, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jWTUtility = jWTUtility;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping ("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User savedUser = userService.register(user);
        return ResponseEntity.ok(savedUser);
    }

    //Get user by ID
    @GetMapping ("/{id}")
    @PreAuthorize ("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<User> getUser(@PathVariable Integer id) {
        Optional<User> userOptional = userService.getUser(id);
        return userOptional.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping ("/{id}")
    @PreAuthorize ("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User user) {
        user.setId(id);
        User updated = userService.updateUser(user);
        return ResponseEntity.ok(updated);
    }

    @PutMapping ("/profile")
    public ResponseEntity<?> updateOwnProfile(
        @RequestBody ProfileUpdateRequest request,
        @RequestHeader ("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String currentUserEmail = jWTUtility.extractEmail(token);

        User currentUser = userService.findByEmail(currentUserEmail)
            .orElseThrow(() -> new RuntimeException("User not Found"));

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            currentUser.setEmail(request.getEmail());
        }
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            currentUser.setUsername(request.getUsername());
        }
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getOldPassword() == null || request.getOldPassword().isBlank()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Old Password or New Password Missing"));
            }
            if (!passwordEncoder.matches(request.getOldPassword(), currentUser.getPassword())) {
                return ResponseEntity.status(401)
                    .body(new ErrorResponse("Old Password is Incorrect"));
            }
            currentUser.setPassword(request.getNewPassword());
        }
        User updated = userService.updateUser(currentUser);
        return ResponseEntity.ok(updated);
    }
    public static class ErrorResponse
    {
        private String message;
        public ErrorResponse(String message)
        {
            this.message = message;
        }
        public String getMessage() {
            return message;
        }
        public void setMessage(String message) {
            this.message = message;
        }
    }


    @DeleteMapping ("/{id}")
    @PreAuthorize ("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
