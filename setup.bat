@echo off
echo ========================================
echo SmartProfits PWA 初始化设置
echo ========================================
echo.

REM 检查Git是否安装
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未检测到Git！请先安装Git。
    echo 下载地址：https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Git已安装，版本信息：
git --version
echo.

REM 初始化Git仓库
if not exist ".git" (
    echo 正在初始化Git仓库...
    git init
    echo.
)

REM 获取用户信息
set /p github_username="请输入你的GitHub用户名: "
set /p repo_name="请输入仓库名称: "

REM 设置远程仓库
echo 正在设置远程仓库...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%github_username%/%repo_name%.git

echo.
echo ========================================
echo 设置完成！
echo ========================================
echo 远程仓库: https://github.com/%github_username%/%repo_name%
echo.
echo 接下来的步骤：
echo 1. 在GitHub上创建名为 '%repo_name%' 的仓库
echo 2. 运行 deploy.bat 来部署你的PWA
echo 3. 在GitHub仓库设置中启用GitHub Pages
echo.
echo 你的PWA将在以下地址可用：
echo https://%github_username%.github.io/%repo_name%/
echo ========================================

pause 