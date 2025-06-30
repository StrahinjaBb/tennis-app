# Koristimo OpenJDK 21 LTS sa Alpine Linuxom (manja veličina slike)
FROM eclipse-temurin:21-jdk-alpine

# Postavi radni direktorij
WORKDIR /app

# Kopiraj samo fajlove potrebne za Maven build (poboljšava caching)
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Postavi izvršne dozvole za Maven wrapper i instaliraj zavisnosti
RUN chmod +x mvnw && \
    ./mvnw dependency:go-offline -B

# Kopiraj izvorni kod
COPY src ./src

# Build aplikacije (sa caching layera)
RUN ./mvnw clean package -DskipTests -B

# Koristimo lightweight JRE umjesto punog JDK-a za runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Kopiraj samo buildovani JAR iz prethodne faze
COPY --from=0 /app/target/tenisApp-*.jar ./app.jar

# Health check za Render
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:8080/actuator/health || exit 1

# Port za Render
EXPOSE 8080

# Start komanda sa optimizacijama za produkciju
ENTRYPOINT ["java", "-jar", "app.jar"]
CMD ["--spring.profiles.active=prod"]