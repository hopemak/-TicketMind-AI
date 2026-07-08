#!/bin/bash

echo "🚀 Starting TicketMind AI Enterprise Production Cluster..."
echo "---------------------------------------------------------"

# 1. Start the Python Machine Learning Service
echo "🐍 Booting Python ML Sidecar Service (Port 5000)..."
cd ml_service
# Activate virtual environment if present, otherwise fall back to system python
if [ -d "venv" ]; then
    source venv/Scripts/activate
fi
python app/main.py &
ML_PID=$!
cd ..

# 2. Start the Backend Express API Server
echo "📦 Initializing Node.js Express Core Gateway (Port 5000/api)..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# 3. Start the Frontend Vite UX Dashboard
echo "⚡ Launching Frontend Vite Client Engine..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "---------------------------------------------------------"
echo "🎯 All services are streaming online in parallel background threads!"
echo "   - ML Sandbox Classifier: Running on background PID $ML_PID"
echo "   - Enterprise Node Layer: Running on background PID $BACKEND_PID"
echo "   - Interactive Dashboard UI: Running on background PID $FRONTEND_PID"
echo "---------------------------------------------------------"
echo "Press [CTRL+C] at any time to shut down the entire active development pool stack cleanly."

# Trap control-c interrupts to kill all spawned background child processes cleanly
trap "echo '🛑 Shutting down microservices safely...'; kill $ML_PID $BACKEND_PID $FRONTEND_PID; exit" INT

# Wait for background processes to keep the terminal process persistent
wait
