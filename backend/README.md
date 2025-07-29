# SmartOutlet POS Project

## Overview

SmartOutlet POS is a microservices-based Point of Sale system for retail, built with Spring Boot, Kafka, PostgreSQL, and Docker. Each service manages a specific business domain (Product, Outlet, POS, Expense, Auth, etc.) and communicates via REST and Kafka event streams.

---

## Kafka Setup & Integration Guide

### 1. Install and Start Kafka

You need a running Kafka broker (and Zookeeper, if using classic Kafka setup). You can use Docker or install Kafka locally.

**Using Docker Compose (recommended for local dev):**
```yaml
version: '3.8'
services:
  zookeeper:
    image: wurstmeister/zookeeper:3.4.6
    ports:
      - "2181:2181"
  kafka:
    image: wurstmeister/kafka:2.13-2.8.0
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    depends_on:
      - zookeeper
```
Start with:
```bash
docker-compose up -d
```

Or, if running manually:
- Download and extract Kafka from https://kafka.apache.org/downloads
- Start Zookeeper: `bin/zookeeper-server-start.sh config/zookeeper.properties`
- Start Kafka: `bin/kafka-server-start.sh config/server.properties`

---

### 2. Create Required Kafka Topics

Each service expects certain topics to exist. You must create these before running the services.

#### **Product Service**
- `product-events`
- `inventory-updates`
- `price-updates`

#### **Outlet Service**
- `outlet-events`
- `outlet-updates`

#### **POS Service**
- `sales-events`
- `payment-events`
- `inventory-updates` (shared with product service)

#### **Expense Service**
- `sales-events` (consumes sales events for expense aggregation)

**Create topics:**
```bash
# Example for product-events
kafka-topics.sh --create --topic product-events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

# Repeat for each topic:
kafka-topics.sh --create --topic inventory-updates --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
kafka-topics.sh --create --topic price-updates --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
kafka-topics.sh --create --topic outlet-events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
kafka-topics.sh --create --topic outlet-updates --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
kafka-topics.sh --create --topic sales-events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
kafka-topics.sh --create --topic payment-events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
```

---

### 3. Kafka Configuration in Services

Each service has Kafka configuration in its `application.properties` or `application.yml`:
- `spring.kafka.bootstrap-servers=localhost:9092`
- Producer and consumer settings are pre-configured for local development.

**If you change the Kafka broker address or port, update the `spring.kafka.bootstrap-servers` property in each service.**

---

### 4. Running the Services

- Ensure Kafka is running and all required topics are created.
- Start each service (e.g., `mvn spring-boot:run` in each service directory).
- The services will automatically connect to Kafka and start producing/consuming events.

---

### 5. Troubleshooting

- If you see errors about missing topics, create them as shown above.
- If you see connection errors, ensure Kafka is running and accessible at the configured address.
- For local development, all services expect Kafka at `localhost:9092`.

---

### 6. Summary Table of Topics

| Service         | Produces To           | Consumes From         |
|-----------------|----------------------|-----------------------|
| Product         | product-events, inventory-updates, price-updates | (varies, see code) |
| Outlet          | outlet-events, outlet-updates | (varies, see code) |
| POS             | sales-events, payment-events, inventory-updates | (varies, see code) |
| Expense         | (none)               | sales-events          |

---

### 7. References

- [Kafka Quickstart](https://kafka.apache.org/quickstart)
- [Spring Kafka Docs](https://docs.spring.io/spring-kafka/docs/current/reference/html/)

---

Continue with the rest of the project setup and service-specific instructions as described below. 