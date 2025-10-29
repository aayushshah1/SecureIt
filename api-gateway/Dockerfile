FROM openjdk:23-slim

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

VOLUME /app

EXPOSE 8000

COPY target/api-gateway-0.0.1-SNAPSHOT.jar /app/api-gateway.jar

ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "/app/api-gateway.jar"]
