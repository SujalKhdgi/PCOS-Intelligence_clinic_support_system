#!/bin/bash

echo "Starting PCOS Diagnostic Application..."
echo

echo "Starting Django Backend..."
cd PCOS_Intelligence && python manage.py runserver &
DJANGO_PID=$!

echo "Waiting 3 seconds for Django to start..."
sleep 3

echo "Starting React Frontend..."
cd ../pcos-compass-main && npm run dev &
REACT_PID=$!

echo
echo "Both servers are running!"
echo "- Django Backend: http://localhost:8000"
echo "- React Frontend: http://localhost:5173 (or 3000)"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo 'Stopping servers...'; kill $DJANGO_PID $REACT_PID; exit" INT
wait
