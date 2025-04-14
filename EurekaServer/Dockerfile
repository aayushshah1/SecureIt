FROM openjdk:23-slim

VOLUME /app

EXPOSE 8671

COPY target/eureka.jar /app/eureka.jar

ENTRYPOINT ["java", "-jar","/app/eureka.jar"]
