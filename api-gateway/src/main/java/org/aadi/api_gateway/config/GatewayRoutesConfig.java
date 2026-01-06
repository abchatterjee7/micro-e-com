package org.aadi.api_gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.security.Principal;

@Configuration
public class GatewayRoutesConfig {

        @org.springframework.beans.factory.annotation.Value("${ORDER_SERVICE_URL:http://localhost:8097}")
        private String orderServiceUrl;

        @org.springframework.beans.factory.annotation.Value("${DLT_REPLAY_SERVICE_URL:http://localhost:8088}")
        private String dltReplayServiceUrl;

        @org.springframework.beans.factory.annotation.Value("${PRODUCT_SERVICE_URL:http://localhost:8090}")
        private String productServiceUrl;

        @Bean
        RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {

                return builder.routes()

                                // ---- Order Service ----
                                .route("order-service", r -> r
                                                .path("/api/orders/**")
                                                .filters(f -> f
                                                                .requestRateLimiter(config -> config
                                                                                .setRateLimiter(redisRateLimiter())
                                                                                .setKeyResolver(userKeyResolver())))
                                                .uri(orderServiceUrl))

                                // ---- DLT ADMIN Service ----
                                .route("dlt-replay-service", r -> r
                                                .path("/admin/dlt/**")
                                                .filters(f -> f
                                                                .requestRateLimiter(config -> config
                                                                                .setRateLimiter(redisRateLimiter())
                                                                                .setKeyResolver(userKeyResolver())))
                                                .uri(dltReplayServiceUrl))

                                // ---- Product Service ----
                                .route("product-service", r -> r
                                                .path("/products/**", "/products", "/categories/**", "/categories")
                                                .uri(productServiceUrl))

                                .build();
        }

        @Bean
        RedisRateLimiter redisRateLimiter() {
                return new RedisRateLimiter(5, 10);
        }

        @Bean
        KeyResolver userKeyResolver() {
                return exchange -> exchange.getPrincipal()
                                .map(Principal::getName)
                                .defaultIfEmpty("anonymous");
        }
}
