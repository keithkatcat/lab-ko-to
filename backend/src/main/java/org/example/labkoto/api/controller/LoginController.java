package org.example.labkoto.api.controller;

import org.example.labkoto.services.LoginService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping ("/api/auth")
public class LoginController {

    private final LoginService loginService;


    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    //Login Request
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    //Login Response
    public static class LoginResponse {
        private String token;
        private String message;

        public LoginResponse(String token, String message) {
            this.token = token;
            this.message = message;
        }

        public String getToken() {
            return token;
        }

        public String getMessage() {
            return message;
        }
    }

    @PostMapping ("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        Optional<String> tokenOpt = loginService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (tokenOpt.isPresent()) {
            return ResponseEntity.ok(new LoginResponse(tokenOpt.get(), "Login Successful"));
        } else {
            return ResponseEntity.status(401).body(new LoginResponse(null, "Invalid Credentials"));
        }
    }
}
