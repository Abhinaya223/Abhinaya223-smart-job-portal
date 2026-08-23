package com.smartjobportal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<?> home() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "SmartJobPortal Backend API",
            "message", "Backend is online and functioning properly!"
        ));
    }

    @GetMapping("/api")
    public ResponseEntity<?> apiHome() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "SmartJobPortal API",
            "endpoints", Map.of(
                "auth", "/api/auth/login, /api/auth/signup",
                "jobs", "/api/jobs",
                "applications", "/api/applications"
            )
        ));
    }
}
