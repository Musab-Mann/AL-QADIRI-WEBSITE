@echo off
title Al Qadri Restaurant
set "PATH=C:\Users\Dell\Downloads\node-v26.8.2-win-x64\node-v26.8.2-win-x64;%PATH%"
cd /d "C:\Users\Dell\Desktop\Claude Web Developer\al-qadri\al-qadri-site"

rem Runs the fast production version on Node.js (smooth scrolling and a quick admin).
if not exist ".next\BUILD_ID" (
  echo First run: building the fast version of the site. This takes a few minutes...
  call npm run build || goto failed
)

echo.
echo  Website:          http://localhost:3000
echo  Admin dashboard:  http://localhost:3000/admin
echo.
echo  Keep this window open while you use the site. Close it to stop.
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep 4; Start-Process 'http://localhost:3000'"
call npm run start
pause
exit /b

:failed
echo The build failed. Scroll up to see why.
pause
