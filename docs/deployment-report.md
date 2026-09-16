# Deployment Report

## Project: DevOps Calculator — Blue-Green Deployment

---

## Stage 1 — Application (Complete ✅)

| Item | Detail |
|------|--------|
| Application | Spring Boot Calculator |
| Language | Java 17 |
| Build Tool | Maven |
| Frontend | Thymeleaf + HTML5 + CSS3 + Vanilla JS |
| Port | 8080 |
| Health Endpoint | `GET /health` |
| Docker Image | `devops-calculator:blue` / `devops-calculator:green` |

---

## Stage 2 — ECR (Upcoming)

- [ ] Create ECR repository
- [ ] Tag and push BLUE image
- [ ] Tag and push GREEN image

---

## Stage 3 — ECS Fargate (Upcoming)

- [ ] Create ECS Cluster
- [ ] Register BLUE task definition
- [ ] Register GREEN task definition
- [ ] Create BLUE ECS service
- [ ] Create GREEN ECS service

---

## Stage 4 — Load Balancer (Upcoming)

- [ ] Create Application Load Balancer
- [ ] Create BLUE target group
- [ ] Create GREEN target group
- [ ] Configure listener rules

---

## Stage 5 — Blue-Green Switch (Upcoming)

- [ ] Deploy GREEN
- [ ] Run health checks
- [ ] Switch ALB traffic to GREEN
- [ ] Verify live endpoint
- [ ] Demonstrate rollback with `SIMULATE_FAILURE=true`
