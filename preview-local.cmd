@echo off
cd /d "%~dp0"
node node_modules/astro/bin/astro.mjs dev --host 127.0.0.1
if errorlevel 1 pause
