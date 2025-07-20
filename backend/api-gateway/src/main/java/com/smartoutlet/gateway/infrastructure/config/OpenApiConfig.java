package com.smartoutlet.gateway.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("SmartOutlet API Gateway")
                .description("API Gateway for SmartOutlet POS System - Routes requests to appropriate microservices")
                .version("1.0.0")
                .contact(new Contact()
                    .name("SmartOutlet Development Team")
                    .email("dev@smartoutlet.com")
                    .url("https://smartoutlet.com"))
                .license(new License()
                    .name("MIT License")
                    .url("https://opensource.org/licenses/MIT")))
            .servers(List.of(
                new Server().url("http://localhost:8080").description("Local Development Server"),
                new Server().url("https://api.smartoutlet.com").description("Production Server")
            ));
    }
} 