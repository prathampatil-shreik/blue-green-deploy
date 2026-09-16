#!/bin/bash
# ─────────────────────────────────────────────────────────────
# switch-traffic.sh
# Manually switch ALB traffic between BLUE and GREEN
#
# Usage:
#   ./switch/switch-traffic.sh blue
#   ./switch/switch-traffic.sh green
# ─────────────────────────────────────────────────────────────

set -e

TARGET="${1,,}"   # lowercase the argument

if [[ "$TARGET" != "blue" && "$TARGET" != "green" ]]; then
  echo "Usage: $0 [blue|green]"
  exit 1
fi

# ── Load config from environment or .env file ────────────────
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

: "${ALB_LISTENER_ARN:?  ALB_LISTENER_ARN is not set}"
: "${ALB_TG_BLUE_ARN:?   ALB_TG_BLUE_ARN is not set}"
: "${ALB_TG_GREEN_ARN:?  ALB_TG_GREEN_ARN is not set}"
: "${AWS_REGION:?         AWS_REGION is not set}"
: "${APP_URL:?            APP_URL is not set}"

# ── Select target group ───────────────────────────────────────
if [ "$TARGET" = "blue" ]; then
  TG_ARN="$ALB_TG_BLUE_ARN"
else
  TG_ARN="$ALB_TG_GREEN_ARN"
fi

echo "──────────────────────────────────────────"
echo "  Switching traffic to: ${TARGET^^}"
echo "  Target Group ARN: $TG_ARN"
echo "──────────────────────────────────────────"

# ── Switch ALB listener ───────────────────────────────────────
aws elbv2 modify-listener \
  --listener-arn "$ALB_LISTENER_ARN" \
  --default-actions Type=forward,TargetGroupArn="$TG_ARN" \
  --region "$AWS_REGION"

echo "Traffic switched to ${TARGET^^}."

# ── Verify health ─────────────────────────────────────────────
echo "Verifying health endpoint..."
sleep 5

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/health")

if [ "$HTTP_STATUS" = "200" ]; then
  echo "Health check PASSED (HTTP 200)"
  echo "Live environment: ${TARGET^^}"
else
  echo "Health check FAILED (HTTP $HTTP_STATUS)"
  echo "Consider rolling back with: $0 blue"
  exit 1
fi
