# Koristimo OpenJDK 21 LTS
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Kopiramo Maven wrapper i POM fajl
COPY .mvn/ .mvn
COPY mvnw .
COPY pom.xml .

# Instaliramo zavisnosti (koristi cache)
RUN ./mvnw dependency:go-offline

# Kopiramo izvorni kod
COPY src ./src

# Build aplikacije
RUN ./mvnw clean package -DskipTests

# Health check za Render
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Port za Render
EXPOSE 8080

# Start komanda
CMD ["java", "-jar", "target/tenisApp-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=prod"]