# Use the modern Eclipse Temurin JDK 17
FROM eclipse-temurin:17-jdk-alpine
# Copy the compiled JAR file from the target folder
COPY target/*.jar app.jar
# Run the application
ENTRYPOINT ["java","-jar","/app.jar"]