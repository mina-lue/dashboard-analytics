# How to Run the Analytics Solution

Follow these steps to get the entire engine running locally.

## 1. Prerequisites
- Docker & Docker Desktop
- Java 17 or higher
- Node.js & npm

## 2. Start Infrastructure
Navigate to the backend directory and start the core services:
```bash
cd analytics-dashboard-api
docker-compose up -d
```
*Wait for Kafka, Elasticsearch, and Redis to be healthy.*

## 3. Start Backend Services
Launch the microservices in this order (using separate terminals or background):
1. **Eureka Server**: `cd news-server && ./mvnw spring-boot:run`
2. **Producer API**: `cd producer-api && ./mvnw spring-boot:run`
3. **Categorizer**: `cd categorizer-service && ./mvnw spring-boot:run`
4. **Collector**: `cd collector-service && ./mvnw spring-boot:run`
5. **Publisher**: `cd publisher-api && ./mvnw spring-boot:run`

## 4. Start Frontend
Launch the modern dashboard:
```bash
cd analytics-dashboard
npm install
npm run dev
```

## 5. View Dashboard
Open `http://localhost:5175/` (or the port shown in your terminal).

## Ports Reference
- **Dashboard**: 5175
- **Eureka Server**: 8761
- **Publisher API**: 9081
- **Producer API**: 9080
- **Kafka Drop (GUI)**: 9000
- **Elasticsearch**: 9200
