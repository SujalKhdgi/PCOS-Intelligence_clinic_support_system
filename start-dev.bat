@echo off
echo Starting PCOS Diagnostic Application...
echo.

echo Starting Django Backend...
start cmd /k "cd PCOS_Intelligence && python manage.py runserver"

timeout /t 3 /nobreak > nul

echo Starting React Frontend...
start cmd /k "cd pcos-compass-main && npm run dev"

echo.
echo Both servers are starting up!
echo - Django Backend: http://localhost:8000
echo - React Frontend: http://localhost:5173 (or 3000)
echo.
echo Press any key to close this window...
pause > nul
