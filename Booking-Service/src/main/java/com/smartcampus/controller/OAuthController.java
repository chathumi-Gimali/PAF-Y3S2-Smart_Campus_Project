package com.smartcampus.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class OAuthController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        return ResponseEntity.ok(Map.of(
            "name", principal.getAttribute("name"),
            "email", principal.getAttribute("email"),
            "picture", principal.getAttribute("picture")
        ));
    }

    @GetMapping("/google")
    public ResponseEntity<Map<String, String>> googleLogin() {
        return ResponseEntity.ok(Map.of(
            "url", "http://localhost:8081/oauth2/authorization/google"
        ));
    }
}