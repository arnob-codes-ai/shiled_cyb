@echo off
echo ===================================================
echo   CYBER SHIELD: Cash-Out Intelligence Platform
echo ===================================================
echo [1/3] Seeding 12,000+ synthetic transactions and benchmark database...
python backend\scripts\generate_demo_data.py
echo [2/3] Training and calibrating ML Spatio-Temporal Cash-Out Ensemble...
python backend\scripts\train_model.py
echo [3/3] Launching backend and frontend servers...
start cmd /k "python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000"
cd frontend
start cmd /k "npm.cmd run dev"
echo [OK] CYBER SHIELD is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://127.0.0.1:8000
echo   API Docs: http://127.0.0.1:8000/docs
pause
