package com.smartoutlet.gateway.infrastructure.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JWT Token Relay Filter Tests")
class JwtTokenRelayFilterTest {

    @Mock
    private ServerWebExchange exchange;

    @Mock
    private ServerHttpRequest request;

    @Mock
    private ServerHttpRequest.Builder requestBuilder;

    @Mock
    private GatewayFilterChain chain;

    @Mock
    private HttpHeaders headers;

    private JwtTokenRelayFilter jwtTokenRelayFilter;

    @BeforeEach
    void setUp() {
        jwtTokenRelayFilter = new JwtTokenRelayFilter();
    }

    @Test
    @DisplayName("Should apply filter and relay JWT token")
    void shouldApplyFilterAndRelayJwtToken() {
        // Given
        String authHeader = "Bearer jwt-token-123";
        when(exchange.getRequest()).thenReturn(request);
        when(request.mutate()).thenReturn(requestBuilder);
        when(request.getHeaders()).thenReturn(headers);
        when(headers.getFirst(HttpHeaders.AUTHORIZATION)).thenReturn(authHeader);
        when(requestBuilder.header(eq(HttpHeaders.AUTHORIZATION), eq(authHeader))).thenReturn(requestBuilder);
        when(requestBuilder.build()).thenReturn(request);
        when(exchange.mutate()).thenReturn(exchange.mutate());
        when(chain.filter(any(ServerWebExchange.class))).thenReturn(Mono.empty());

        // When
        Mono<Void> result = jwtTokenRelayFilter.apply(new JwtTokenRelayFilter.Config()).filter(exchange, chain);

        // Then
        StepVerifier.create(result)
                .verifyComplete();

        verify(exchange).getRequest();
        verify(chain).filter(any(ServerWebExchange.class));
    }

    @Test
    @DisplayName("Should handle request without authorization header")
    void shouldHandleRequestWithoutAuthorizationHeader() {
        // Given
        when(exchange.getRequest()).thenReturn(request);
        when(request.getHeaders()).thenReturn(headers);
        when(headers.getFirst(HttpHeaders.AUTHORIZATION)).thenReturn(null);
        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // When
        Mono<Void> result = jwtTokenRelayFilter.apply(new JwtTokenRelayFilter.Config()).filter(exchange, chain);

        // Then
        StepVerifier.create(result)
                .verifyComplete();

        verify(exchange).getRequest();
        verify(chain).filter(exchange);
    }

    @Test
    @DisplayName("Should handle empty authorization header")
    void shouldHandleEmptyAuthorizationHeader() {
        // Given
        when(exchange.getRequest()).thenReturn(request);
        when(request.getHeaders()).thenReturn(headers);
        when(headers.getFirst(HttpHeaders.AUTHORIZATION)).thenReturn("");
        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // When
        Mono<Void> result = jwtTokenRelayFilter.apply(new JwtTokenRelayFilter.Config()).filter(exchange, chain);

        // Then
        StepVerifier.create(result)
                .verifyComplete();

        verify(exchange).getRequest();
        verify(chain).filter(exchange);
    }

    @Test
    @DisplayName("Should handle non-Bearer authorization header")
    void shouldHandleNonBearerAuthorizationHeader() {
        // Given
        String authHeader = "Basic dXNlcm5hbWU6cGFzc3dvcmQ=";
        when(exchange.getRequest()).thenReturn(request);
        when(request.getHeaders()).thenReturn(headers);
        when(headers.getFirst(HttpHeaders.AUTHORIZATION)).thenReturn(authHeader);
        when(chain.filter(exchange)).thenReturn(Mono.empty());

        // When
        Mono<Void> result = jwtTokenRelayFilter.apply(new JwtTokenRelayFilter.Config()).filter(exchange, chain);

        // Then
        StepVerifier.create(result)
                .verifyComplete();

        verify(exchange).getRequest();
        verify(chain).filter(exchange);
    }
}