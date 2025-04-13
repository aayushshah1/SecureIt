FROM openjdk:25-slim-bullseye

VOLUME /tmp

EXPOSE 8761

ARG JAR_FILE=target/eureka-server.jar

ADD ${JAR_FILE} app.jar

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]