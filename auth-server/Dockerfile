FROM openjdk:23-slim

VOLUME /app

EXPOSE 8080

COPY target/auth-server-0.0.1-SNAPSHOT.jar /app/auth_server.jar

ENTRYPOINT ["java", "-jar","/app/auth_server.jar"]