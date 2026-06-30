# Stage 1: Build the application using Maven
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src
# Compile the application and skip tests to save time
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copy the compiled JAR from Stage 1
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]