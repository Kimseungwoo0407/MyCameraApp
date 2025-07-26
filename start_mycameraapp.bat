@echo off
title 📸 MyCameraApp 서버 및 터널 실행

:: 1. Node 서버 실행 (새 창에서)
start cmd /k "cd /d %~dp0 && node server.js"

:: 2. SSH 터널 실행 (새 창에서)
timeout /t 2 >nul
start cmd /k "cd /d %~dp0 && ssh -R 80:localhost:5000 ssh.localhost.run"

echo --------------------------------------------
echo [✔] 서버 및 SSH 터널이 실행되었습니다.
echo [👉] 위 창에서 'https://xxx.localhost.run' 주소를 복사해서
echo      HTML의 fetch('...') 부분에 붙여넣으세요!
echo --------------------------------------------
pause
