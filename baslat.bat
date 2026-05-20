@echo off
title AI OCR - Sunucu Yoneticisi
cd /d "%~dp0"

echo.
echo  AI OCR Donusturucu
echo  ==================
echo.

:: Node.js / npm kontrolu
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo  [HATA] Node.js bulunamadi!
    echo  Lutfen https://nodejs.org adresinden Node.js yukleyin.
    echo.
    pause
    exit /b 1
)

:: Eger port 5173 kullanimdaysa eski sunucuyu otomatik kapat
echo  Port 5173 kontrol ediliyor...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo  Eski sunucu sureci tespit edildi PID %%a - kapatiliyor...
    taskkill /f /pid %%a >nul 2>nul
)

:: node_modules yoksa kurulum yap
if not exist "node_modules\" (
    echo  Ilk kurulum: bagimliliklar yukleniyor...
    call npm install
    if %errorlevel% neq 0 (
        echo  [HATA] npm install basarisiz oldu!
        pause
        exit /b 1
    )
    echo  Kurulum tamamlandi.
    echo.
)

:: Gelistirme sunucusunu arka planda 127.0.0.1 uzerinde baslat
echo  Sunucu baslatiliyor...
start "AI_OCR_DEV_SERVER" /min cmd /c "npm run dev -- --host 127.0.0.1"

:: Vite port kontrolu (en fazla 30 saniye)
echo  Sunucunun hazir olmasi bekleniyor...
powershell -NoProfile -Command "for ($i=0; $i -lt 30; $i++) { try { $t = New-Object System.Net.Sockets.TcpClient; $task = $t.ConnectAsync('127.0.0.1', 5173); if ($task.Wait(1000) -and $t.Connected) { $t.Close(); exit 0 } } catch {} Start-Sleep -Seconds 1 }; exit 1"

if %errorlevel% neq 0 (
    echo  [HATA] Sunucu baslatilamadi!
    echo  Lutfen npm run dev komutunu manuel calistirarak hatayi kontrol edin.
    taskkill /fi "windowtitle eq AI_OCR_DEV_SERVER*" /t /f >nul 2>nul
    pause
    exit /b 1
)

echo  Hazir!
echo.

:: Tarayicida ac
start http://127.0.0.1:5173
echo  Tarayici acildi: http://127.0.0.1:5173
echo.
echo  ======================================================
echo  Sunucu calisiyor.
echo  Arayuz kapatildiginda sunucu otomatik duracaktir.
echo  ======================================================
echo.

:: Arka planda tarayici baglantisini dinle
:: Baglanti kurulduktan sonra taray??c?? sekmesi kapatilirsa (8 sn) sunucu durur.
:: Ilk baglanti 40 saniye icinde kurulmazsa zaman asimi ile durur.
powershell -NoProfile -Command "$ever = $false; $disc = 0; while ($true) { Start-Sleep -Seconds 2; $conns = Get-NetTCPConnection -LocalPort 5173 -State Established -ErrorAction SilentlyContinue; if ($conns) { $ever = $true; $disc = 0; } else { if ($ever) { $disc++; if ($disc -ge 4) { exit 0 } } else { $disc++; if ($disc -ge 20) { exit 0 } } } }"

echo  Sunucu durduruluyor...
taskkill /fi "windowtitle eq AI_OCR_DEV_SERVER*" /t /f >nul 2>nul
echo  Sunucu durduruldu.
timeout /t 2 >nul
exit /b 0
