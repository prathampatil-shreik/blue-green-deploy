package com.bluegreen.calculator.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Value("${app.env:BLUE}")
    private String appEnv;

    @Value("${app.version:v1.0}")
    private String appVersion;

    @Value("${simulate.failure:false}")
    private boolean simulateFailure;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> body = new LinkedHashMap<>();
        if (simulateFailure) {
            body.put("status", "unhealthy");
            body.put("application", "devops-calculator");
            body.put("environment", appEnv);
            body.put("version", appVersion);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
        body.put("status", "healthy");
        body.put("application", "devops-calculator");
        body.put("environment", appEnv);
        body.put("version", appVersion);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/version")
    public Map<String, String> version() {
        Map<String, String> body = new LinkedHashMap<>();
        body.put("application", "devops-calculator");
        body.put("environment", appEnv);
        body.put("version", appVersion);
        return body;
    }

    @GetMapping("/info")
    public Map<String, String> info() {
        Map<String, String> body = new LinkedHashMap<>();
        body.put("application", "devops-calculator");
        body.put("environment", appEnv);
        body.put("version", appVersion);
        body.put("status", simulateFailure ? "unhealthy" : "healthy");
        return body;
    }
}
