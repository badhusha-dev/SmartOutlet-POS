package com.smartoutlet.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .csrf().disable()
            .authorizeExchange()
                .pathMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html", "/webjars/**").permitAll()
                .pathMatchers("/actuator/**").permitAll()
                .pathMatchers("/auth/**", "/products/**", "/outlets/**", "/expenses/**", "/sales/**").permitAll()
                .anyExchange().permitAll()
            .and()
            .httpBasic().disable()
            .formLogin().disable();
        
        return http.build();
    }
} 