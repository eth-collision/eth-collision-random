#!/bin/bash

# Stop random.js using its recorded PID
if [ -f random_pid.txt ]; then
    kill -9 $(cat random_pid.txt)
    rm random_pid.txt
    echo "Stopped random.js."
else
    echo "random_pid.txt does not exist. random.js might not be running."
fi

# Stop count.js using its recorded PID
if [ -f count_pid.txt ]; then
    kill -9 $(cat count_pid.txt)
    rm count_pid.txt
    echo "Stopped count.js."
else
    echo "count_pid.txt does not exist. count.js might not be running."
fi
