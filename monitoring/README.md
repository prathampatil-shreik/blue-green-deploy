# Monitoring

Monitoring strategy for the Blue-Green deployment on AWS ECS Fargate.

---

## Health Endpoints

| Endpoint | Expected Response | Used By |
|----------|-------------------|---------|
| `GET /health` | HTTP 200 `{"status":"healthy"}` | ALB, ECS, Pipeline |
| `GET /version` | HTTP 200 `{"version":"v1.0"}` | Deployment verification |
| `GET /info` | HTTP 200 full info JSON | Dashboards |

---

## ALB Target Group Health Checks

- Protocol: HTTP
- Path: `/health`
- Interval: 30s
- Timeout: 5s
- Healthy threshold: 2
- Unhealthy threshold: 3

---

## CloudWatch Metrics to Watch

| Metric | Namespace | Description |
|--------|-----------|-------------|
| `HealthyHostCount` | `AWS/ApplicationELB` | Targets passing health checks |
| `UnHealthyHostCount` | `AWS/ApplicationELB` | Targets failing health checks |
| `HTTPCode_Target_5XX_Count` | `AWS/ApplicationELB` | 5xx errors from targets |
| `TargetResponseTime` | `AWS/ApplicationELB` | Response latency |
| `CPUUtilization` | `AWS/ECS` | ECS task CPU usage |
| `MemoryUtilization` | `AWS/ECS` | ECS task memory usage |

---

## Suggested CloudWatch Alarms

```
UnHealthyHostCount >= 1  →  SNS Alert + trigger rollback
HTTPCode_Target_5XX_Count > 10 (per minute)  →  SNS Alert
CPUUtilization > 80%  →  SNS Alert
```

---

## Simulated Failure Testing

Set `SIMULATE_FAILURE=true` on the GREEN task definition.  
The `/health` endpoint returns HTTP 500 → ALB marks targets unhealthy → pipeline rollback triggers automatically.
