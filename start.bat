@echo off
echo.
echo  ========================================
echo       RETRO ARCADE - Starting Server
echo  ========================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting server at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

:: Start the server
npm start
