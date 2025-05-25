@echo off 
cd /d "C:\projects\2025\team-task-track\server"

if "%~1"=="" (
  ECHO Argument needed: dev, testDev or testDevClean
  EXIT /b 1
) 

echo Starting Apollo server...
start "Apollo Server" cmd /c "npm run %1"
REM start "Apollo Server" cmd /c "npm run %1"
REM The 'start' command runs it in a new window, preventing the batch script from blocking.
REM 'cmd /c' ensures the command runs and then closes the cmd window if npm start blocks.