package org.aadi.order_service.controller;

import org.aadi.order_service.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UUID> creatOrder(
            @RequestHeader("Idempotency-Key") String key,
            @RequestHeader("X-User-Id") String userId) {
        return new ResponseEntity<>(service.createOrder(userId, key), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        String userId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponse> orders = service.getOrdersByCustomerId(userId, pageable);
        return ResponseEntity.ok(orders);
    }

    // Response DTO to avoid exposing internal domain
    public static class OrderResponse {
        private UUID id;
        private String status;
        private String createdAt;
        
        public OrderResponse(UUID id, String status, String createdAt) {
            this.id = id;
            this.status = status;
            this.createdAt = createdAt;
        }
        
        // Getters
        public UUID getId() { return id; }
        public String getStatus() { return status; }
        public String getCreatedAt() { return createdAt; }
    }
}
