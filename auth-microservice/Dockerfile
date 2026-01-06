# Multi-stage build with layer caching optimization
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

# Copy only pom.xml first to leverage Docker cache for dependencies
COPY pom.xml .

# Resolve dependencies (cached unless pom.xml changes)
RUN mvn -B -DskipTests package

# Now copy source code
COPY src ./src

# Build the application
RUN mvn -B -DskipTests package

# Runtime stage
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
