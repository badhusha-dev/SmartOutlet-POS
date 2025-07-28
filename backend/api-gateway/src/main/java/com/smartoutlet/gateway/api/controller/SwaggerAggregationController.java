package com.smartoutlet.gateway.api.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api-docs")
public class SwaggerAggregationController {

    @Value("${auth.service.url}")
    private String authServiceUrl;

    @Value("${product.service.url}")
    private String productServiceUrl;

    @Value("${outlet.service.url}")
    private String outletServiceUrl;

    @Value("${expense.service.url}")
    private String expenseServiceUrl;

    private final WebClient webClient;

    public SwaggerAggregationController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @GetMapping("/aggregated")
    public Mono<ResponseEntity<Map<String, Object>>> getAggregatedApiDocs() {
        Map<String, Object> aggregatedDocs = new HashMap<>();
        
        return Mono.zip(
            getServiceApiDocs(authServiceUrl + "/v3/api-docs", "auth-service"),
            getServiceApiDocs(productServiceUrl + "/v3/api-docs", "product-service"),
            getServiceApiDocs(outletServiceUrl + "/v3/api-docs", "outlet-service"),
            getServiceApiDocs(expenseServiceUrl + "/v3/api-docs", "expense-service")
        ).map(tuple -> {
            aggregatedDocs.put("auth-service", tuple.getT1());
            aggregatedDocs.put("product-service", tuple.getT2());
            aggregatedDocs.put("outlet-service", tuple.getT3());
            aggregatedDocs.put("expense-service", tuple.getT4());
            return ResponseEntity.ok(aggregatedDocs);
        }).onErrorReturn(ResponseEntity.ok(aggregatedDocs));
    }

    private Mono<Object> getServiceApiDocs(String url, String serviceName) {
        return webClient.get()
            .uri(url)
            .retrieve()
            .bodyToMono(Object.class)
            .onErrorReturn(Map.of("error", "Service " + serviceName + " not available"));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "API Gateway");
        return ResponseEntity.ok(health);
    }
}
