package com.smartcampus.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oauthSuccessHandler())
                .failureUrl("http://localhost:5173?error=oauth_failed")
            );
        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler oauthSuccessHandler() {
        return new AuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(
                    HttpServletRequest request,
                    HttpServletResponse response,
                    Authentication authentication) throws IOException {

                OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

                String name = oauthUser.getAttribute("name");
                String email = oauthUser.getAttribute("email");
                String picture = oauthUser.getAttribute("picture");

                // Assign role based on email
                String role = "STUDENT";
                if (email != null) {
                    if (email.contains("admin")) role = "ADMIN";
                    else if (email.contains("tech")) role = "TECHNICIAN";
                    else if (email.contains("lec") || email.contains("dr")) role = "LECTURER";
                }

                // Redirect to frontend with user info
                String redirectUrl = String.format(
                    "http://localhost:5173/oauth-success?name=%s&email=%s&role=%s&picture=%s",
                    URLEncoder.encode(name != null ? name : "User", StandardCharsets.UTF_8),
                    URLEncoder.encode(email != null ? email : "", StandardCharsets.UTF_8),
                    URLEncoder.encode(role, StandardCharsets.UTF_8),
                    URLEncoder.encode(picture != null ? picture : "", StandardCharsets.UTF_8)
                );

                response.sendRedirect(redirectUrl);
            }
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}