package org.aadi.auth_microservice.controller;

import org.aadi.auth_microservice.domain.LoginRequest;
import org.aadi.auth_microservice.domain.UserRole;
import org.aadi.auth_microservice.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody LoginRequest request) {
        try {
            authService.register(request.username(), request.password());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "User registered successfully",
                            "username", request.username()
                    ));
        } catch (Exception e) {
            log.error("Error during signup: {}", e.getMessage(), e);
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage()
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        try {
            // Get token from Keycloak
            Map<String, Object> tokenResponse = authService.validateUserAndGetToken(
                    request.username(), 
                    request.password()
            );

            // Get user role for backward compatibility
            UserRole role = authService.getUserRole(request.username());

            // Build response with token and role
            Map<String, Object> response = new HashMap<>(tokenResponse);
            response.put("role", role.name());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error during login: {}", e.getMessage(), e);
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid credentials"
            );
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "auth-microservice",
                "auth-provider", "Keycloak"
        ));
    }
}
