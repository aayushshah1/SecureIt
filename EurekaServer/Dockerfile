FROM openjdk:23-slim

VOLUME /app

EXPOSE 8761

COPY target/EurekaServer-0.0.1-SNAPSHOT.jar /app/app.jar

ENTRYPOINT ["java", "-jar","/app/app.jar"]
