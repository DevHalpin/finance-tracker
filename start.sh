#!/bin/bash

# === CONFIGURATION ===
PROJECT_ROOT="$HOME/dev_work/finance-tracker"
LOG_DIR="$PROJECT_ROOT/logs"
DJANGO_LOG="$LOG_DIR/django.log"
VITE_LOG="$LOG_DIR/vue.log"
VENV_PATH="$HOME/venv"
DJANGO_PORT=8000
VITE_PORT=5173

# === PROCESS IDS ===
DJANGO_PID=""
VITE_PID=""
TAIL_PID=""

# === FUNCTIONS ===

# Graceful shutdown
cleanup() {
    echo -e "\nCaught interrupt. Shutting down..."

    [[ -n "$DJANGO_PID" ]] && echo "Stopping Django (PID $DJANGO_PID)..." && kill "$DJANGO_PID"
    [[ -n "$VITE_PID" ]] && echo "Stopping Vue (PID $VITE_PID)..." && kill "$VITE_PID"
    [[ -n "$TAIL_PID" ]] && echo "Stopping log tail (PID $TAIL_PID)..." && kill "$TAIL_PID"

    wait
    echo "All processes stopped. Exiting."
    exit 0
}

# Trap signals
trap cleanup SIGINT SIGTERM

# === MAIN ===

echo "Starting development environment..."

# Activate virtualenv
if [ -z "$VIRTUAL_ENV" ]; then
    if [ -f "$VENV_PATH/bin/activate" ]; then
        echo "Activating virtual environment at $VENV_PATH"
        source "$VENV_PATH/bin/activate"
    else
        echo "Virtual environment not found at $VENV_PATH"
        exit 1
    fi
else
    echo "Already in a virtual environment: $VIRTUAL_ENV"
fi

# Create log directory
mkdir -p "$LOG_DIR"
: > "$DJANGO_LOG"
: > "$VITE_LOG"

# Kill any lingering processes on dev ports
lsof -ti:$DJANGO_PORT | xargs kill -9 2>/dev/null
lsof -ti:$VITE_PORT | xargs kill -9 2>/dev/null

# Start backend
cd "$PROJECT_ROOT/backend" || exit
echo "Waiting for database to be ready..."
python manage.py wait_for_db

echo "Starting Django backend on port $DJANGO_PORT..."
python manage.py runserver 0.0.0.0:$DJANGO_PORT >> "$DJANGO_LOG" 2>&1 &
DJANGO_PID=$!

# Start frontend
cd "$PROJECT_ROOT/frontend" || exit
echo "Starting Vue frontend on port $VITE_PORT..."
bun run dev -- --port $VITE_PORT --host >> "$VITE_LOG" 2>&1 &
VITE_PID=$!

# Tail logs unless in production mode
echo "Tailing logs..."
tail -f "$DJANGO_LOG" "$VITE_LOG" &
TAIL_PID=$!

# Wait for processes to finish
wait
