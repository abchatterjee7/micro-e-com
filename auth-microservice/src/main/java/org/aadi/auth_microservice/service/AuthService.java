package org.aadi.auth_microservice.service;

import jakarta.ws.rs.core.Response;
import org.aadi.auth_microservice.domain.UserRole;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final Keycloak keycloakAdminClient;
    private final WebClient webClient;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.admin-client-id}")
    private String clientId;

    @Value("${keycloak.admin-client-secret}")
    private String clientSecret;

    @Value("${keycloak.token-uri}")
    private String tokenUri;

    public AuthService(Keycloak keycloakAdminClient, WebClient webClient) {
        this.keycloakAdminClient = keycloakAdminClient;
        this.webClient = webClient;
    }

    /**
     * Register a new user in Keycloak
     */
    public void register(String username, String password) {
        try {
            // Create user representation
            UserRepresentation user = new UserRepresentation();
            user.setUsername(username);
            user.setEnabled(true);
            user.setEmailVerified(true);
            user.setEmail(username + "@example.com");

            // Create credential
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(password);
            credential.setTemporary(false);
            user.setCredentials(Collections.singletonList(credential));

            // Create user in Keycloak
            Response response = keycloakAdminClient.realm(realm).users().create(user);

            if (response.getStatus() == 201) {
                log.info("User {} created successfully", username);

                // Extract user ID from Location header
                String locationHeader = response.getHeaderString("Location");
                String userId = locationHeader.substring(locationHeader.lastIndexOf('/') + 1);

                // Assign default role
                assignRoleToUser(userId, UserRole.CUSTOMER);
            } else if (response.getStatus() == 409) {
                throw new RuntimeException("User already exists");
            } else {
                throw new RuntimeException("Failed to create user: " + response.getStatusInfo());
            }

            response.close();
        } catch (Exception e) {
            log.error("Error registering user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to register user: " + e.getMessage());
        }
    }

    /**
     * Validate user credentials and return token from Keycloak
     */
    public Map<String, Object> validateUserAndGetToken(String username, String password) {
        try {
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("client_id", clientId);
            formData.add("client_secret", clientSecret);
            formData.add("grant_type", "password");
            formData.add("username", username);
            formData.add("password", password);

            Map<String, Object> tokenResponse = webClient.post()
                    .uri(tokenUri)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData(formData))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            log.info("Token obtained successfully for user: {}", username);
            return tokenResponse;
        } catch (Exception e) {
            log.error("Error validating user: {}", e.getMessage(), e);
            throw new RuntimeException("Invalid credentials");
        }
    }

    /**
     * Assign role to user in Keycloak
     */
    private void assignRoleToUser(String userId, UserRole role) {
        try {
            RoleRepresentation roleRepresentation = keycloakAdminClient
                    .realm(realm)
                    .roles()
                    .get(role.name())
                    .toRepresentation();

            keycloakAdminClient.realm(realm)
                    .users()
                    .get(userId)
                    .roles()
                    .realmLevel()
                    .add(Collections.singletonList(roleRepresentation));

            log.info("Role {} assigned to user {}", role, userId);
        } catch (Exception e) {
            log.error("Error assigning role: {}", e.getMessage(), e);
        }
    }

    /**
     * Get user role from Keycloak (for backward compatibility)
     */
    public UserRole getUserRole(String username) {
        try {
            List<UserRepresentation> users = keycloakAdminClient.realm(realm)
                    .users()
                    .search(username, true);

            if (users.isEmpty()) {
                return UserRole.USER;
            }

            UserRepresentation user = users.get(0);
            List<RoleRepresentation> roles = keycloakAdminClient.realm(realm)
                    .users()
                    .get(user.getId())
                    .roles()
                    .realmLevel()
                    .listAll();

            // Check if user has ADMIN role
            boolean isAdmin = roles.stream()
                    .anyMatch(role -> role.getName().equalsIgnoreCase("ADMIN"));

            return isAdmin ? UserRole.ADMIN : UserRole.CUSTOMER;
        } catch (Exception e) {
            log.error("Error fetching user role: {}", e.getMessage(), e);
            return UserRole.CUSTOMER;
        }
    }
}
