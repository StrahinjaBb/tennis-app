FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Kopirajte Maven wrapper i POM fajl
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Kopirajte source code
COPY src ./src

# Build aplikacije
RUN ./mvnw clean package -DskipTests

# Start komanda
CMD ["java", "-jar", "target/tenisApp-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=prod"]