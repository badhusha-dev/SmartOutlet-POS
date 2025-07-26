package com.smartoutlet.gateway.infrastructure.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtTokenRelayFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenRelayFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        
        if (token != null && token.startsWith("Bearer ")) {
            logger.debug("Forwarding JWT token to downstream service: {}", token.substring(0, 20) + "...");
            
            // Forward the token to downstream services
            exchange.getRequest().mutate()
                .header(HttpHeaders.AUTHORIZATION, token)
                .build();
        } else {
            logger.debug("No JWT token found in request");
        }
        
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 100;
    }
} 