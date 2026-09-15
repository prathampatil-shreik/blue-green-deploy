# 🟦 DevOps Calculator — Blue-Green Deployment on AWS ECS Fargate

A professional web-based **Calculator** application built with **Java 17 + Spring Boot + Thymeleaf**, containerized with **Docker**, and designed for **Blue-Green deployment on AWS ECS Fargate** with an Application Load Balancer.

---

## 📸 Preview

```
⚙ DEVOPS CALCULATOR
Environment: BLUE   Version: v1.0   Status: HEALTHY

┌─────────────────────────┐
│                   125.50│
├─────────────────────────┤
│  AC  │  +/-  │  %  │ ÷ │
│   7  │   8   │  9  │ × │
│   4  │   5   │  6  │ - │
│   1  │   2   │  3  │ + │
│      0       │  .  │ = │
└─────────────────────────┘
```

---

## 🏗️ Project Stages

| Stage | Description | Status |
|-------|-------------|--------|
| **Stage 1** | Spring Boot Calculator App + Docker | ✅ Complete |
| **Stage 2** | Push to Amazon ECR | 🔜 Upcoming |
| **Stage 3** | AWS ECS Fargate Setup + ALB | 🔜 Upcoming |
| **Stage 4** | Blue-Green Deployment Pipeline | 🔜 Upcoming |
| **Stage 5** | Automated Rollback on Failure | 🔜 Upcoming |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Java 17 |
| Framework | Spring Boot 3.2.5 |
| Templating | Thymeleaf |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Build | Maven |
| Container | Docker (multi-stage build) |
| Cloud | AWS ECS Fargate |
| Load Balancer | AWS Application Load Balancer |
| Deployment | Blue-Green via AWS CodeDeploy |

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- Docker Desktop

### Run locally with Maven
```bash
mvn spring-boot:run
```
Open: http://localhost:8080

### Run with GREEN environment
```bash
APP_ENV=GREEN APP_VERSION=v2.0 mvn spring-boot:run
```

---

## 🐳 Docker

### Build the image
```bash
docker build -t devops-calculator:blue .
```

### Run — BLUE (port 8080)
```bash
docker run -d --name calculator-blue \
  -p 8080:8080 \
  -e APP_ENV=BLUE \
  -e APP_VERSION=v1.0 \
  -e SIMULATE_FAILURE=false \
  devops-calculator:blue
```

### Run — GREEN healthy (port 8081)
```bash
docker run -d --name calculator-green \
  -p 8081:8080 \
  -e APP_ENV=GREEN \
  -e APP_VERSION=v2.0 \
  -e SIMULATE_FAILURE=false \
  devops-calculator:blue
```

### Run — GREEN with simulated failure (port 8082)
```bash
docker run -d --name calculator-green-broken \
  -p 8082:8080 \
  -e APP_ENV=GREEN \
  -e APP_VERSION=v2.0 \
  -e SIMULATE_FAILURE=true \
  devops-calculator:blue
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_ENV` | `BLUE` | Deployment environment — `BLUE` or `GREEN` |
| `APP_VERSION` | `v1.0` | Application version displayed in the UI |
| `SIMULATE_FAILURE` | `false` | Set `true` to make `/health` return HTTP 500 |

---

## 🔌 API Endpoints

| Endpoint | Method | Status Code | Description |
|----------|--------|-------------|-------------|
| `/` | GET | 200 | Calculator UI |
| `/health` | GET | 200 / 500 | Health check for ALB & ECS |
| `/version` | GET | 200 | Version and environment info |
| `/info` | GET | 200 | Full application info |

### `/health` — SIMULATE_FAILURE=false
```json
{
  "status": "healthy",
  "application": "devops-calculator",
  "environment": "BLUE",
  "version": "v1.0"
}
```

### `/health` — SIMULATE_FAILURE=true (HTTP 500)
```json
{
  "status": "unhealthy",
  "application": "devops-calculator",
  "environment": "GREEN",
  "version": "v2.0"
}
```

---

## 🧮 Calculator Features

- ➕ Addition, ➖ Subtraction, ✖️ Multiplication, ➗ Division
- 📊 Percentage calculation
- 🔢 Decimal numbers
- ➕➖ Positive / Negative toggle
- ⌫ Backspace
- 🔄 Clear (AC)
- ⚠️ Division by zero → displays `Cannot divide by zero`
- ⌨️ Full keyboard support
- 📱 Responsive — works on mobile, tablet, desktop

---

## 📁 Project Structure

```
blue-green-deploy/
├── src/
│   └── main/
│       ├── java/com/bluegreen/calculator/
│       │   ├── CalculatorApplication.java
│       │   └── controller/
│       │       ├── CalculatorController.java
│       │       └── HealthController.java
│       └── resources/
│           ├── templates/
│           │   └── index.html
│           ├── static/
│           │   ├── css/style.css
│           │   └── js/calculator.js
│           └── application.properties
├── pom.xml
├── Dockerfile
├── .dockerignore
├── .gitignore
└── README.md
```

---

## 🔵🟢 Blue-Green Deployment Strategy

This application is designed to run as two identical environments:

```
Internet
    │
    ▼
Application Load Balancer
    │
    ├──► Target Group BLUE  ──► ECS Task (APP_ENV=BLUE,  v1.0)
    │
    └──► Target Group GREEN ──► ECS Task (APP_ENV=GREEN, v2.0)
```

- Traffic is switched at the ALB level — zero downtime
- `/health` endpoint is polled by the ALB target group health checks
- If `SIMULATE_FAILURE=true`, the health check returns HTTP 500 → ALB stops routing traffic → automatic rollback

---

## 🛡️ Health Check Flow

```
ALB polls GET /health every 30s
        │
        ├── HTTP 200 → Target is HEALTHY → receives traffic
        │
        └── HTTP 500 → Target is UNHEALTHY → removed from rotation → rollback triggered
```

---

## 📄 License

MIT License — free to use for learning and demonstration purposes.
