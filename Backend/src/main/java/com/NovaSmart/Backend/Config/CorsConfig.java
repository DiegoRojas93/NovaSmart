package com.NovaSmart.Backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica a todos los controladores (rutas)
            .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173") // Acepta ambas formas de localhost
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // OPTIONS es vital para el preflight
            .allowedHeaders("*") // Permite cualquier cabecera (como Content-Type)
            .allowCredentials(true);
    }
}
