FROM openjdk:25-slim-bullseye

VOLUME /tmp

EXPOSE 8080

ARG JAR_FILE=target/auth-server.jar

ADD ${JAR_FILE} app.jar

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]