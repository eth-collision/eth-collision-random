#!/bin/bash

# Start random.js and record its PID
nohup node random.js & echo $! > random_pid.txt

# Start count.js and record its PID
nohup node count.js & echo $! > count_pid.txt

echo "Both scripts started and PIDs recorded."
