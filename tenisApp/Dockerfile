# 1. Bazna Java slika
FROM eclipse-temurin:17-jdk-jammy

# 2. Radni direktorijum
WORKDIR /app

# 3. Kopiranje Maven wrappera i POM fajla (koristi cache za dependencies)
COPY .mvn/ .mvn
COPY mvnw .
COPY pom.xml .

# 4. Preuzimanje dependencies (koristi cache ako se pom.xml nije menjao)
RUN ./mvnw dependency:go-offline

# 5. Kopiranje izvornog koda
COPY src ./src

# 6. Build aplikacije
RUN ./mvnw clean package -DskipTests

# 7. Health check (opciono)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# 8. Port izlozen za Render
EXPOSE 8080

# 9. Start komanda
CMD ["java", "-jar", "target/tenisApp-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=prod"]