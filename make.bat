@echo off
cls
echo %date% %time%
echo.
node_modules\.bin\webpack --config webpack-config.js
