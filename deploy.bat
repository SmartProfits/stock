@echo off
echo ========================================
echo SmartProfits PWA 部署脚本
echo ========================================
echo.

REM 检查是否在git仓库中
if not exist ".git" (
    echo 错误：当前目录不是Git仓库！
    echo 请先运行：git init
    echo 然后添加远程仓库：git remote add origin https://github.com/你的用户名/你的仓库名.git
    pause
    exit /b 1
)

echo 正在添加所有文件到Git...
git add .

echo.
set /p commit_message="请输入提交信息 (默认: Update PWA): "
if "%commit_message%"=="" set commit_message=Update PWA

echo 正在提交更改...
git commit -m "%commit_message%"

echo.
echo 正在推送到GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo 部署成功！
    echo ========================================
    echo 你的PWA应用将在几分钟后在以下地址可用：
    echo https://你的用户名.github.io/你的仓库名/
    echo.
    echo 请确保在GitHub仓库设置中启用了GitHub Pages！
    echo ========================================
) else (
    echo.
    echo 部署失败！请检查网络连接和Git配置。
)

echo.
pause 