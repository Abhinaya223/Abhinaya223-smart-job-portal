package com.smartjobportal.config;

import com.smartjobportal.jwt.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization", "Content-Disposition"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public auth & documentation & console
                        .requestMatchers("/api/auth/**", "/h2-console/**").permitAll()

                        // Public jobs viewing
                        .requestMatchers(HttpMethod.GET, "/api/jobs", "/api/jobs/*").permitAll()

                        // Resume viewing/downloading public or authenticated (allows direct tab preview)
                        .requestMatchers(HttpMethod.GET, "/api/applications/*/resume", "/api/applications/resume/**").permitAll()

                        // Recruiter-only endpoints
                        .requestMatchers(HttpMethod.POST, "/api/jobs").hasAnyAuthority("RECRUITER", "ROLE_RECRUITER")
                        .requestMatchers("/api/applications/recruiter").hasAnyAuthority("RECRUITER", "ROLE_RECRUITER")
                        .requestMatchers(HttpMethod.PATCH, "/api/applications/*/status").hasAnyAuthority("RECRUITER", "ROLE_RECRUITER")
                        .requestMatchers(HttpMethod.PUT, "/api/applications/*/*").hasAnyAuthority("RECRUITER", "ROLE_RECRUITER")

                        // Candidate-only endpoints
                        .requestMatchers(HttpMethod.POST, "/api/applications").hasAnyAuthority("CANDIDATE", "ROLE_CANDIDATE", "JOB_SEEKER", "ROLE_JOB_SEEKER")
                        .requestMatchers("/api/applications/my").hasAnyAuthority("CANDIDATE", "ROLE_CANDIDATE", "JOB_SEEKER", "ROLE_JOB_SEEKER")

                        // Any other request authenticated
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}