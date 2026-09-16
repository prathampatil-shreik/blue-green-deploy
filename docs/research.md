# Research — Blue-Green Deployment

## What is Blue-Green Deployment?

Blue-Green deployment is a release strategy that maintains two identical production environments:

- **BLUE** — the current live environment serving all traffic
- **GREEN** — the new version being deployed and tested

Traffic is switched at the load balancer level. If GREEN is healthy, it becomes live. If it fails, traffic instantly rolls back to BLUE — zero downtime.

---

## Architecture

```
Internet
    │
    ▼
Application Load Balancer
    │
    ├──► Listener Rule ──► Target Group BLUE  ──► ECS Tasks (v1.0)
    │
    └──► Listener Rule ──► Target Group GREEN ──► ECS Tasks (v2.0)
```

Only one target group receives traffic at a time. Switching is instant.

---

## Why AWS ECS Fargate?

| Feature | Benefit |
|---------|---------|
| Serverless containers | No EC2 instances to manage |
| Per-task billing | Cost efficient for small workloads |
| Native ALB integration | Easy target group registration |
| IAM task roles | Fine-grained security |
| CloudWatch Logs | Built-in log aggregation |

---

## Health Check Strategy

The `/health` endpoint is the single source of truth:

- ALB polls it every 30 seconds
- ECS uses it for container health
- GitHub Actions pipeline polls it before switching traffic
- `SIMULATE_FAILURE=true` forces HTTP 500 to test rollback

---

## Rollback Strategy

Rollback is instant — just point the ALB listener back to the BLUE target group. No redeployment needed because BLUE is still running.
