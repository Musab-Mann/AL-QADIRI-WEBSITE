@echo off
title Al Qadri Restaurant admin
set "PATH=C:\Users\Dell\Downloads\node-v26.8.2-win-x64\node-v26.8.2-win-x64;%PATH%"
cd /d "C:\Users\Dell\Desktop\Claude Web Developer\al-qadri\al-qadri-site"

rem Same fast Node.js server as the website, opened straight on the admin dashboard.
if not exist ".next\BUILD_ID" (
  echo First run: building the fast version of the site. This takes a few minutes...
  call npm run build || goto failed
)

echo.
echo  Admin dashboard:  http://localhost:3000/admin
echo  Website:          http://localhost:3000
echo.
echo  Keep this window open while you use the dashboard. Close it to stop.
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep 4; Start-Process 'http://localhost:3000/admin'"
call npm run start
pause
exit /b

:failed
echo The build failed. Scroll up to see why.
pause
