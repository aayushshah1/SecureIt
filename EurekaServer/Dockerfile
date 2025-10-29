FROM openjdk:23-slim

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

VOLUME /app

EXPOSE 8761

COPY target/EurekaServer-0.0.1-SNAPSHOT.jar /app/app.jar

ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar","/app/app.jar"]
