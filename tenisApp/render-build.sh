#!/bin/bash
chmod +x ./mvnw
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
./mvnw clean package -DskipTests