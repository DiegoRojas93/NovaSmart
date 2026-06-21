# Etapa 1: Construcción (Builder)
FROM eclipse-temurin:25-jdk-alpine AS builder
WORKDIR /app

# Copiar archivos de Maven
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
# Dar permisos de ejecución al wrapper (por si se perdieron en Windows)
RUN chmod +x ./mvnw
# Descargar dependencias offline
RUN ./mvnw dependency:go-offline

# Copiar el código fuente y compilar
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Etapa 2: Producción / Ejecución
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
# Copiar el JAR compilado desde la etapa 1
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]