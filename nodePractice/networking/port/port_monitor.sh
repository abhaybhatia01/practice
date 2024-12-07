#!/bin/bash

# Log file path
LOG_FILE="./port-usage.log"

# Function to get the number of active ports
get_port_usage() {
  local port_count=$(netstat -an | grep -E 'ESTABLISHED|TIME_WAIT' | wc -l)
  local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  echo "$timestamp - Active Ports: $port_count" | tee -a "$LOG_FILE"
}

# Monitor ports every 10 seconds (adjust as needed)
echo "Monitoring port usage... Press Ctrl+C to stop."

while true; do
  get_port_usage
  sleep 1
done