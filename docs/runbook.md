# Runbook — Blue-Green Deployment

Operational procedures for the DevOps Calculator deployment.

---

## Deploy GREEN (normal)

```bash
# Via GitHub Actions — push to main or trigger manually
# workflow_dispatch → environment: green → simulate_failure: false
```

---

## Deploy GREEN (simulated failure)

```bash
# workflow_dispatch → environment: green → simulate_failure: true
# Pipeline will detect HTTP 500 from /health and auto-rollback to BLUE
```

---

## Manual traffic switch

```bash
# Switch to GREEN
./switch/switch-traffic.sh green

# Switch back to BLUE
./switch/switch-traffic.sh blue
```

---

## Verify current live environment

```bash
curl http://<ALB_DNS>/health
curl http://<ALB_DNS>/version
```

---

## Rollback manually

```bash
./switch/switch-traffic.sh blue
```

---

## Check ECS service status

```bash
aws ecs describe-services \
  --cluster <CLUSTER_NAME> \
  --services devops-calculator-blue devops-calculator-green
```

---

## View container logs

```bash
aws logs tail /ecs/devops-calculator-green --follow
aws logs tail /ecs/devops-calculator-blue  --follow
```
