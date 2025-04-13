FROM openjdk:23-slim

VOLUME /app

EXPOSE 8080

COPY target/pmbackend.jar /app/pmbackend.jar

ENTRYPOINT ["java", "-jar","/app/pmbackend.jar"]
