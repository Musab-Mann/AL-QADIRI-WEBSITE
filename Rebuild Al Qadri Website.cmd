@echo off
title Rebuild Al Qadri Restaurant
set "PATH=C:\Users\Dell\Downloads\node-v26.8.2-win-x64\node-v26.8.2-win-x64;%PATH%"
cd /d "C:\Users\Dell\Desktop\Claude Web Developer\al-qadri\al-qadri-site"

rem Run this after the code changes, so the fast version picks the changes up.
echo Rebuilding the fast version of the site. This takes a few minutes...
call npm run build && echo Done. Now open "Open Al Qadri Website" or "Open Al Qadri Admin".
pause
