FROM openjdk:23-slim

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

VOLUME /app

EXPOSE 8080

COPY target/pmbackend.jar /app/pmbackend.jar

ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar","/app/pmbackend.jar"]
