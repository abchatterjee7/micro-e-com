package org.aadi.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class GatewaySecurityConfig {

        @Bean
        public SecurityWebFilterChain springSecurityFilterChain(
                        ServerHttpSecurity http,
                        JwtAuthenticationConverter jwtAuthenticationConverter) {

                // ADAPT SERVLET CONVERTER → REACTIVE
                ReactiveJwtAuthenticationConverterAdapter reactiveAdapter = new ReactiveJwtAuthenticationConverterAdapter(
                                jwtAuthenticationConverter);

                http
                                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                                .cors(cors -> cors.configurationSource(request -> {
                                        var config = new org.springframework.web.cors.CorsConfiguration();
                                        config.addAllowedOrigin("http://localhost:5173");
                                        config.addAllowedHeader("*");
                                        config.addAllowedMethod("*");
                                        config.setAllowCredentials(true);
                                        return config;
                                }))
                                .authorizeExchange(ex -> ex
                                                .pathMatchers("/products", "/products/**").permitAll()
                                                .pathMatchers("/categories", "/categories/**").permitAll()
                                                .pathMatchers("/actuator/health").permitAll()
                                                .pathMatchers("/admin/**").hasAuthority("ROLE_ADMIN")
                                                .pathMatchers("/api/**").hasAnyAuthority("ROLE_CUSTOMER", "ROLE_USER", "ROLE_ADMIN")
                                                .anyExchange().authenticated())
                                .oauth2ResourceServer(oauth -> oauth
                                                .jwt(jwt -> jwt.jwtAuthenticationConverter(reactiveAdapter)));

                return http.build();
        }
}
