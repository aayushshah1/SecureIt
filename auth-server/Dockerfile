FROM openjdk:23-slim

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

VOLUME /app

EXPOSE 8081

COPY target/auth-server-0.0.1-SNAPSHOT.jar /app/auth_server.jar

ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar","/app/auth_server.jar"]