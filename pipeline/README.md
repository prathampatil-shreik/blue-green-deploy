# CI/CD Pipeline

This project uses **GitHub Actions** for automated Blue-Green deployment to AWS ECS Fargate.

---

## Pipeline File

`.github/workflows/blue-green-deploy.yml`

---

## Trigger

| Trigger | Behaviour |
|---------|-----------|
| Push to `main` | Automatically deploys to GREEN |
| `workflow_dispatch` | Manual deploy — choose BLUE or GREEN, optionally simulate failure |

---

## Pipeline Stages

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  1. BUILD                                           │
│     ├── Checkout code                               │
│     ├── Build JAR (Maven)                           │
│     ├── Build Docker image                          │
│     └── Push to Amazon ECR                         │
│                                                     │
│  2. DEPLOY                                          │
│     ├── Register new ECS Task Definition            │
│     ├── Update ECS Service                          │
│     └── Wait for service to stabilize               │
│                                                     │
│  3. HEALTH CHECK & TRAFFIC SWITCH                   │
│     ├── Poll ALB Target Group health (10 retries)   │
│     ├── Switch ALB Listener to new Target Group     │
│     └── Verify live /health endpoint                │
│                                                     │
│  4. ROLLBACK (on failure only)                      │
│     ├── Switch ALB back to BLUE                     │
│     └── Print rollback summary                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | e.g. `us-east-1` |
| `ECR_REGISTRY` | e.g. `123456789.dkr.ecr.us-east-1.amazonaws.com` |
| `ECR_REPOSITORY` | e.g. `devops-calculator` |
| `ECS_CLUSTER` | ECS cluster name |
| `ECS_SERVICE_BLUE` | Blue ECS service name |
| `ECS_SERVICE_GREEN` | Green ECS service name |
| `TASK_DEF_BLUE` | Blue task definition family name |
| `TASK_DEF_GREEN` | Green task definition family name |
| `ALB_TG_BLUE_ARN` | Blue target group ARN |
| `ALB_TG_GREEN_ARN` | Green target group ARN |
| `ALB_LISTENER_ARN` | ALB listener ARN |
| `APP_URL` | Public ALB DNS e.g. `http://my-alb.us-east-1.elb.amazonaws.com` |
